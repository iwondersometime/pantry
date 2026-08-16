import { Recipe, RecipeIngredient } from '../types';
import { getRecipeImage, ERROR_IMAGE_FALLBACK } from '../data/recipeImages';

export interface CacheEntry {
  id: string;
  url: string;
  blobUrl?: string;
  dataUrl?: string;
  timestamp: number;
}

interface QueueItem {
  id: string;
  recipe: Recipe;
  priority: 'high' | 'low';
  resolve: (url: string) => void;
  reject: (err: any) => void;
}

const DB_NAME = 'PantryPalette_RecipeImages';
const DB_VERSION = 1;
const STORE_NAME = 'cached_images';
const MAX_CONCURRENT_REQUESTS = 5;
const MAX_RETRIES = 2;

/**
 * Authoritative, High-Performance Recipe Image Service
 * 
 * Architecture:
 * 1. Synchronous Memory Cache: Zero-latency instantaneous display for seen recipes.
 * 2. Persistent Storage (IndexedDB): Preserves cached images across sessions and page reloads.
 * 3. Priority Concurrency Queue: 5 parallel requests max, prioritizes visible UI viewport images.
 * 4. Deduplication Engine: Consolidates duplicate requests into a single in-flight promise.
 * 5. Resilient Retries: Exponential backoff on transient network drops before falling back to verified placeholder.
 * 6. Authoritative 1-to-1 Mapping: Never alters recipe IDs or cross-assigns images.
 */
export class RecipeImageService {
  // In-Memory Fast Cache
  private static memoryCache = new Map<string, string>();
  private static inFlightMap = new Map<string, Promise<string>>();
  private static failureCountMap = new Map<string, number>();
  
  // Request Queue
  private static queue: QueueItem[] = [];
  private static activeCount = 0;

  // IndexedDB Reference
  private static dbPromise: Promise<IDBDatabase | null> | null = null;
  private static isDbInitialized = false;

  /**
   * Initializes or returns the IndexedDB instance for persistent storage
   */
  private static getDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || typeof indexedDB === 'undefined') {
      return Promise.resolve(null);
    }

    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };

        request.onsuccess = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          this.isDbInitialized = true;
          resolve(db);
        };

        request.onerror = (err) => {
          console.warn('[RecipeImageService] IndexedDB open error, continuing with memory cache:', err);
          resolve(null);
        };
      } catch (err) {
        console.warn('[RecipeImageService] IndexedDB not available, using memory cache:', err);
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  /**
   * Synchronous cache retrieval for zero-latency component initial render
   */
  static getCachedSync(recipeOrId: string | Recipe): string | null {
    const id = typeof recipeOrId === 'string' ? recipeOrId : recipeOrId?.id;
    if (!id) return null;
    return this.memoryCache.get(id) || null;
  }

  /**
   * Reads from Persistent IndexedDB Cache
   */
  private static async getFromPersistentCache(id: string): Promise<string | null> {
    // 1. Check memory cache first
    const mem = this.memoryCache.get(id);
    if (mem) return mem;

    try {
      const db = await this.getDB();
      if (!db) return null;

      return new Promise<string | null>((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const getReq = store.get(id);

          getReq.onsuccess = () => {
            const entry: CacheEntry | undefined = getReq.result;
            if (entry && (entry.dataUrl || entry.blobUrl || entry.url)) {
              const validUrl = entry.dataUrl || entry.blobUrl || entry.url;
              this.memoryCache.set(id, validUrl);
              resolve(validUrl);
            } else {
              resolve(null);
            }
          };

          getReq.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    } catch {
      return null;
    }
  }

  /**
   * Saves to Persistent IndexedDB Cache and Memory Cache
   */
  private static async saveToPersistentCache(id: string, url: string, blobData?: Blob): Promise<void> {
    if (!id || !url) return;
    this.memoryCache.set(id, url);

    try {
      const db = await this.getDB();
      if (!db) return;

      const entry: CacheEntry = {
        id,
        url,
        timestamp: Date.now(),
      };

      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(entry);
    } catch (err) {
      console.warn('[RecipeImageService] Error saving to persistent cache:', err);
    }
  }

  /**
   * Synchronous authoritative image resolver (Backwards Compatible)
   */
  static getRecipeImageUrl(
    title: string,
    cuisine?: string,
    imageQuery?: string,
    dishCategory?: string,
    ingredients?: (string | RecipeIngredient)[],
    recipeId?: string
  ): string {
    const id = recipeId || title;
    // Check if we have a cached version
    const cached = this.memoryCache.get(id);
    if (cached) return cached;

    // Resolve authoritative static image
    const authoritative = getRecipeImage(recipeId || ({ id: recipeId || title, title, cuisine } as Recipe));
    if (id) {
      this.memoryCache.set(id, authoritative);
    }
    return authoritative;
  }

  /**
   * Enriches a recipe with its verified authoritative image
   */
  static enrichRecipeWithImage(recipe: Recipe): Recipe {
    const id = recipe.id || recipe.title;
    const cached = this.memoryCache.get(id);
    const resolved = cached || getRecipeImage(recipe);
    if (id && !cached) {
      this.memoryCache.set(id, resolved);
    }
    return {
      ...recipe,
      imageUrl: resolved,
    };
  }

  /**
   * Primary Asynchronous Load API with Concurrency, Deduplication, and Caching
   */
  static async loadRecipeImage(
    recipe: Recipe | string,
    priority: 'high' | 'low' = 'low'
  ): Promise<string> {
    const id = typeof recipe === 'string' ? recipe : recipe.id || recipe.title;
    const recipeObj = typeof recipe === 'string' ? ({ id, title: id } as Recipe) : recipe;

    if (!id) {
      return ERROR_IMAGE_FALLBACK;
    }

    // 1. Check synchronous memory cache
    const memCached = this.memoryCache.get(id);
    if (memCached) {
      return memCached;
    }

    // 2. Check in-flight requests (Deduplication)
    const existingInFlight = this.inFlightMap.get(id);
    if (existingInFlight) {
      return existingInFlight;
    }

    // 3. Check persistent IndexedDB cache
    const persistentCached = await this.getFromPersistentCache(id);
    if (persistentCached) {
      return persistentCached;
    }

    // 4. Authoritative target URL from registry
    const authoritativeUrl = getRecipeImage(recipeObj);
    if (!authoritativeUrl || authoritativeUrl === ERROR_IMAGE_FALLBACK) {
      this.memoryCache.set(id, ERROR_IMAGE_FALLBACK);
      return ERROR_IMAGE_FALLBACK;
    }

    // 5. Enqueue network task with concurrency limits
    const requestPromise = new Promise<string>((resolve, reject) => {
      const queueItem: QueueItem = {
        id,
        recipe: recipeObj,
        priority,
        resolve: (url) => {
          this.inFlightMap.delete(id);
          resolve(url);
        },
        reject: (err) => {
          this.inFlightMap.delete(id);
          reject(err);
        },
      };

      if (priority === 'high') {
        // Jump to front of queue
        this.queue.unshift(queueItem);
      } else {
        this.queue.push(queueItem);
      }

      this.processQueue();
    });

    this.inFlightMap.set(id, requestPromise);
    return requestPromise;
  }

  /**
   * Processes the Priority Concurrency Queue
   */
  private static processQueue(): void {
    while (this.activeCount < MAX_CONCURRENT_REQUESTS && this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;

      this.activeCount++;
      this.fetchAndVerifyImage(item.id, item.recipe)
        .then((finalUrl) => {
          item.resolve(finalUrl);
        })
        .catch(() => {
          item.resolve(ERROR_IMAGE_FALLBACK);
        })
        .finally(() => {
          this.activeCount--;
          this.processQueue();
        });
    }
  }

  /**
   * Fetches, preloads, and stores image with exponential backoff retries
   */
  private static async fetchAndVerifyImage(
    id: string,
    recipe: Recipe,
    attempt: number = 1
  ): Promise<string> {
    const authoritativeUrl = getRecipeImage(recipe);

    return new Promise<string>((resolve, reject) => {
      if (typeof window === 'undefined') {
        this.saveToPersistentCache(id, authoritativeUrl);
        resolve(authoritativeUrl);
        return;
      }

      const img = new Image();
      let isResolved = false;

      const cleanup = () => {
        img.onload = null;
        img.onerror = null;
      };

      // 10-second timeout guard per single request attempt
      const timer = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          handleFailure(new Error('Image load timeout'));
        }
      }, 10000);

      img.onload = () => {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(timer);
        cleanup();

        // Successful load: save to memory and IndexedDB
        this.saveToPersistentCache(id, authoritativeUrl);
        this.failureCountMap.delete(id);
        resolve(authoritativeUrl);
      };

      const handleFailure = async (err: any) => {
        if (attempt <= MAX_RETRIES) {
          const backoff = attempt * 500;
          setTimeout(async () => {
            try {
              const retryUrl = await this.fetchAndVerifyImage(id, recipe, attempt + 1);
              resolve(retryUrl);
            } catch (retryErr) {
              reject(retryErr);
            }
          }, backoff);
        } else {
          // Permanently failed after retries: fallback to ERROR_IMAGE_FALLBACK
          console.warn(`[RecipeImageService] Image load failed for "${recipe.title}" (${id}) after ${MAX_RETRIES + 1} attempts`);
          this.memoryCache.set(id, ERROR_IMAGE_FALLBACK);
          resolve(ERROR_IMAGE_FALLBACK);
        }
      };

      img.onerror = (e) => {
        if (isResolved) return;
        isResolved = true;
        clearTimeout(timer);
        cleanup();
        handleFailure(e);
      };

      img.referrerPolicy = 'no-referrer';
      img.src = authoritativeUrl;
    });
  }

  /**
   * Explicit failure handler invoked from component onerror
   */
  static async handleImageFailure(id: string): Promise<string> {
    const currentFailures = (this.failureCountMap.get(id) || 0) + 1;
    this.failureCountMap.set(id, currentFailures);

    if (currentFailures > MAX_RETRIES) {
      this.memoryCache.set(id, ERROR_IMAGE_FALLBACK);
      return ERROR_IMAGE_FALLBACK;
    }

    // Try reloading one more time
    return this.loadRecipeImage(id, 'high');
  }

  /**
   * Preload an image URL into browser cache
   */
  static preloadImage(url: string, priority: 'high' | 'low' = 'low'): void {
    if (!url || typeof window === 'undefined') return;
    try {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      img.src = url;
    } catch {}
  }

  /**
   * Preload next batch of recipe images for smooth swiping in background
   */
  static preloadRecipeDeck(recipes: { recipe: Recipe }[], startIndex: number, count: number = 3): void {
    for (let i = startIndex; i < Math.min(recipes.length, startIndex + count); i++) {
      const r = recipes[i]?.recipe;
      if (r) {
        this.loadRecipeImage(r, 'low').catch(() => {});
      }
    }
  }
}

export { ERROR_IMAGE_FALLBACK } from '../data/recipeImages';
