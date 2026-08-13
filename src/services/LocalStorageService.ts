import { SavedRecipeItem, ScanHistoryItem, Recipe, DietaryFilters } from '../types';

const BASE_SAVED_KEY = 'pantry_saved_recipes_v1';
const BASE_HISTORY_KEY = 'pantry_scan_history_v1';
const BASE_COOKED_KEY = 'pantry_cooked_count_v1';
const ACTIVE_INGREDIENTS_KEY = 'pantry_active_ingredients_v1';
const DIETARY_FILTERS_KEY = 'pantry_dietary_filters_v1';

export class LocalStorageService {
  private static getSavedKey(userId?: string): string {
    return userId ? `pantry_saved_recipes_${userId}` : BASE_SAVED_KEY;
  }

  private static getHistoryKey(userId?: string): string {
    return userId ? `pantry_scan_history_${userId}` : BASE_HISTORY_KEY;
  }

  private static getCookedKey(userId?: string): string {
    return userId ? `pantry_cooked_count_${userId}` : BASE_COOKED_KEY;
  }

  // --- DATA MIGRATION FOR NEW/EXISTING USERS ---
  static migrateLocalDataToUser(userId: string) {
    if (!userId) return;

    try {
      // Migrate saved recipes if user key is empty
      const baseSaved = localStorage.getItem(BASE_SAVED_KEY);
      const userSavedKey = this.getSavedKey(userId);
      const userSaved = localStorage.getItem(userSavedKey);

      if (baseSaved && (!userSaved || userSaved === '[]')) {
        localStorage.setItem(userSavedKey, baseSaved);
      }

      // Migrate history if user key is empty
      const baseHistory = localStorage.getItem(BASE_HISTORY_KEY);
      const userHistoryKey = this.getHistoryKey(userId);
      const userHistory = localStorage.getItem(userHistoryKey);

      if (baseHistory && (!userHistory || userHistory === '[]')) {
        localStorage.setItem(userHistoryKey, baseHistory);
      }

      // Migrate cooked count
      const baseCooked = localStorage.getItem(BASE_COOKED_KEY);
      const userCookedKey = this.getCookedKey(userId);
      if (baseCooked && !localStorage.getItem(userCookedKey)) {
        localStorage.setItem(userCookedKey, baseCooked);
      }
    } catch (e) {
      console.warn('Data migration notice:', e);
    }
  }

  // SAVED RECIPES
  static getSavedRecipes(userId?: string): SavedRecipeItem[] {
    try {
      const data = localStorage.getItem(this.getSavedKey(userId));
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static isRecipeSaved(recipeId: string, userId?: string): boolean {
    const saved = this.getSavedRecipes(userId);
    return saved.some((s) => s.recipeId === recipeId);
  }

  static saveRecipe(recipe: Recipe, userId?: string): SavedRecipeItem[] {
    const saved = this.getSavedRecipes(userId);
    if (saved.some((s) => s.recipeId === recipe.id)) {
      return saved; // Already saved
    }
    const newItem: SavedRecipeItem = {
      id: `saved-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      recipeId: recipe.id,
      savedAt: Date.now(),
      recipe,
    };
    const updated = [newItem, ...saved];
    try {
      localStorage.setItem(this.getSavedKey(userId), JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save recipe to localStorage', e);
    }
    return updated;
  }

  static removeSavedRecipe(recipeId: string, userId?: string): SavedRecipeItem[] {
    const saved = this.getSavedRecipes(userId);
    const updated = saved.filter((s) => s.recipeId !== recipeId);
    try {
      localStorage.setItem(this.getSavedKey(userId), JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove saved recipe', e);
    }
    return updated;
  }

  // SCAN HISTORY
  static getScanHistory(userId?: string): ScanHistoryItem[] {
    try {
      const data = localStorage.getItem(this.getHistoryKey(userId));
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    // Return initial history items for new users/unauthenticated state
    const initialHistory: ScanHistoryItem[] = [
      {
        id: 'hist-1',
        timestamp: '13 AUG, 8:21',
        rawDate: Date.now() - 3600000 * 5,
        ideasCount: 6,
        ingredients: ['Eggs', 'Chicken', 'Rice'],
      },
      {
        id: 'hist-2',
        timestamp: '12 AUG, 19:45',
        rawDate: Date.now() - 3600000 * 28,
        ideasCount: 8,
        ingredients: ['Tomatoes', 'Paneer', 'Spinach', 'Garlic', 'Butter'],
      },
    ];
    this.saveScanHistoryItems(initialHistory, userId);
    return initialHistory;
  }

  static addScanHistory(ingredients: string[], ideasCount: number, imageUrl?: string, userId?: string): ScanHistoryItem[] {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const formattedStamp = `${day} ${month}, ${hours}:${mins}`;

    const newItem: ScanHistoryItem = {
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: formattedStamp,
      rawDate: Date.now(),
      ideasCount,
      ingredients,
      imageUrl,
    };

    const current = this.getScanHistory(userId);
    const updated = [newItem, ...current.filter((item) => item.id !== 'hist-1' && item.id !== 'hist-2')];
    this.saveScanHistoryItems(updated, userId);
    return updated;
  }

  static deleteScanHistoryItem(id: string, userId?: string): ScanHistoryItem[] {
    const current = this.getScanHistory(userId);
    const updated = current.filter((item) => item.id !== id);
    this.saveScanHistoryItems(updated, userId);
    return updated;
  }

  private static saveScanHistoryItems(items: ScanHistoryItem[], userId?: string) {
    try {
      localStorage.setItem(this.getHistoryKey(userId), JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }

  // COOKED RECIPES TRACKING
  static getCookedCount(userId?: string): number {
    try {
      const data = localStorage.getItem(this.getCookedKey(userId));
      return data ? parseInt(data, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  static incrementCookedCount(userId?: string): number {
    const current = this.getCookedCount(userId);
    const next = current + 1;
    try {
      localStorage.setItem(this.getCookedKey(userId), String(next));
    } catch (e) {
      console.error(e);
    }
    return next;
  }

  // ACTIVE INGREDIENTS
  static getActiveIngredients(): string[] {
    try {
      const data = localStorage.getItem(ACTIVE_INGREDIENTS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return ['Eggs', 'Chicken', 'Rice']; // Default initial set matching reference
  }

  static setActiveIngredients(ingredients: string[]) {
    try {
      localStorage.setItem(ACTIVE_INGREDIENTS_KEY, JSON.stringify(ingredients));
    } catch (e) {
      console.error(e);
    }
  }

  // DIETARY FILTERS
  static getDietaryFilters(): DietaryFilters {
    try {
      const data = localStorage.getItem(DIETARY_FILTERS_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      lowCarb: false,
      quickOnly: false,
    };
  }

  static setDietaryFilters(filters: DietaryFilters) {
    try {
      localStorage.setItem(DIETARY_FILTERS_KEY, JSON.stringify(filters));
    } catch (e) {
      console.error(e);
    }
  }
}

