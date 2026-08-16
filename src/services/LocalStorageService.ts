import { SavedRecipeItem, ScanHistoryItem, Recipe, DietaryFilters, ShoppingListItem, RecipeIngredient, AppTheme } from '../types';

const BASE_SAVED_KEY = 'pantry_saved_recipes_v1';
const BASE_HISTORY_KEY = 'pantry_scan_history_v1';
const BASE_COOKED_KEY = 'pantry_cooked_count_v1';
const BASE_SHOPPING_KEY = 'pantry_shopping_list_v1';
const ACTIVE_INGREDIENTS_KEY = 'pantry_active_ingredients_v1';
const EXPIRING_INGREDIENTS_KEY = 'pantry_expiring_ingredients_v1';
const DIETARY_FILTERS_KEY = 'pantry_dietary_filters_v1';
const ALLERGIES_KEY = 'pantry_user_allergies_v1';
const ONBOARDING_COMPLETED_KEY = 'pantry_onboarding_completed_v1';
const THEME_KEY = 'pantry_app_theme_v1';

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

  private static getShoppingKey(userId?: string): string {
    return userId ? `pantry_shopping_list_${userId}` : BASE_SHOPPING_KEY;
  }

  // ONBOARDING
  static isOnboardingCompleted(): boolean {
    try {
      return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
    } catch {
      return false;
    }
  }

  static setOnboardingCompleted() {
    try {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    } catch (e) {
      console.error(e);
    }
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

      // Migrate shopping list
      const baseShopping = localStorage.getItem(BASE_SHOPPING_KEY);
      const userShoppingKey = this.getShoppingKey(userId);
      if (baseShopping && !localStorage.getItem(userShoppingKey)) {
        localStorage.setItem(userShoppingKey, baseShopping);
      }
    } catch (e) {
      console.warn('Data migration notice:', e);
    }
  }

  // SHOPPING LIST
  static getShoppingList(userId?: string): ShoppingListItem[] {
    try {
      const data = localStorage.getItem(this.getShoppingKey(userId));
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addShoppingListItem(name: string, amount?: string, recipeId?: string, recipeTitle?: string, userId?: string): ShoppingListItem[] {
    const list = this.getShoppingList(userId);
    const trimmed = name.trim();
    if (!trimmed) return list;

    // Avoid exact duplicate
    const existingIndex = list.findIndex(item => item.name.toLowerCase() === trimmed.toLowerCase() && !item.checked);
    if (existingIndex >= 0) {
      return list;
    }

    const newItem: ShoppingListItem = {
      id: `shop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      amount: amount || '',
      recipeId,
      recipeTitle,
      checked: false,
      addedAt: Date.now(),
    };

    const updated = [newItem, ...list];
    this.saveShoppingList(updated, userId);
    return updated;
  }

  static addMissingIngredientsToShoppingList(
    missingIngredients: RecipeIngredient[],
    recipeId: string,
    recipeTitle: string,
    userId?: string
  ): { updatedList: ShoppingListItem[]; addedCount: number } {
    let currentList = this.getShoppingList(userId);
    let addedCount = 0;

    missingIngredients.forEach((ing) => {
      const name = ing.name.trim();
      const exists = currentList.some(
        (item) => item.name.toLowerCase() === name.toLowerCase() && !item.checked
      );
      if (!exists) {
        const newItem: ShoppingListItem = {
          id: `shop_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name,
          amount: ing.amount,
          recipeId,
          recipeTitle,
          checked: false,
          addedAt: Date.now(),
        };
        currentList = [newItem, ...currentList];
        addedCount++;
      }
    });

    this.saveShoppingList(currentList, userId);
    return { updatedList: currentList, addedCount };
  }

  static toggleShoppingListItem(id: string, userId?: string): ShoppingListItem[] {
    const list = this.getShoppingList(userId);
    const updated = list.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item));
    this.saveShoppingList(updated, userId);
    return updated;
  }

  static removeShoppingListItem(id: string, userId?: string): ShoppingListItem[] {
    const list = this.getShoppingList(userId);
    const updated = list.filter((item) => item.id !== id);
    this.saveShoppingList(updated, userId);
    return updated;
  }

  static clearCompletedShoppingList(userId?: string): ShoppingListItem[] {
    const list = this.getShoppingList(userId);
    const updated = list.filter((item) => !item.checked);
    this.saveShoppingList(updated, userId);
    return updated;
  }

  private static saveShoppingList(list: ShoppingListItem[], userId?: string) {
    try {
      localStorage.setItem(this.getShoppingKey(userId), JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save shopping list', e);
    }
  }

  // EXPIRING SOON INGREDIENTS
  static getExpiringIngredients(): string[] {
    try {
      const data = localStorage.getItem(EXPIRING_INGREDIENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static toggleExpiringIngredient(ingredient: string): string[] {
    const current = this.getExpiringIngredients();
    const normalized = ingredient.trim().toLowerCase();
    const exists = current.some((item) => item.trim().toLowerCase() === normalized);

    let updated: string[];
    if (exists) {
      updated = current.filter((item) => item.trim().toLowerCase() !== normalized);
    } else {
      updated = [...current, ingredient];
    }

    try {
      localStorage.setItem(EXPIRING_INGREDIENTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    return updated;
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

  // USER ALLERGIES
  static getUserAllergies(userId?: string): string[] {
    try {
      const key = userId ? `${ALLERGIES_KEY}_${userId}` : ALLERGIES_KEY;
      const data = localStorage.getItem(key) || localStorage.getItem(ALLERGIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static setUserAllergies(allergies: string[], userId?: string) {
    try {
      localStorage.setItem(ALLERGIES_KEY, JSON.stringify(allergies));
      if (userId) {
        localStorage.setItem(`${ALLERGIES_KEY}_${userId}`, JSON.stringify(allergies));
      }
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
      highProtein: false,
      quickOnly: false,
      cookTime: 'all',
      difficulty: 'All',
      cuisine: 'All',
    };
  }

  static setDietaryFilters(filters: DietaryFilters) {
    try {
      localStorage.setItem(DIETARY_FILTERS_KEY, JSON.stringify(filters));
    } catch (e) {
      console.error(e);
    }
  }

  // QUICK COOKING PREFERENCES
  static getQuickCookingPreferences(userId?: string): { vibe: string | null; time: string | null } | null {
    try {
      const key = userId ? `pantry_quick_cooking_${userId}` : 'pantry_quick_cooking_v1';
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static saveQuickCookingPreferences(vibe: string | null, time: string | null, userId?: string) {
    try {
      const key = userId ? `pantry_quick_cooking_${userId}` : 'pantry_quick_cooking_v1';
      localStorage.setItem(key, JSON.stringify({ vibe, time, updatedAt: Date.now() }));
    } catch (e) {
      console.error('Failed to save quick cooking preferences', e);
    }
  }

  // THEME MANAGEMENT
  static getTheme(userId?: string): AppTheme {
    try {
      const userThemeKey = userId ? `${THEME_KEY}_${userId}` : THEME_KEY;
      const theme = (localStorage.getItem(userThemeKey) || localStorage.getItem(THEME_KEY)) as AppTheme;
      if (theme === 'light' || theme === 'dark' || theme === 'system') {
        return theme;
      }
    } catch {}
    return 'system';
  }

  static setTheme(theme: AppTheme, userId?: string) {
    try {
      localStorage.setItem(THEME_KEY, theme);
      if (userId) {
        localStorage.setItem(`${THEME_KEY}_${userId}`, theme);
      }
      this.applyTheme(theme);
    } catch (e) {
      console.error(e);
    }
  }

  static applyTheme(theme: AppTheme) {
    try {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
        document.body.classList.add('dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        document.body.classList.remove('dark');
      }

      // Update mobile status bar theme color if present
      let metaTheme = document.querySelector('meta[name="theme-color"]');
      if (!metaTheme) {
        metaTheme = document.createElement('meta');
        metaTheme.setAttribute('name', 'theme-color');
        document.head.appendChild(metaTheme);
      }
      metaTheme.setAttribute('content', isDark ? '#0D1A13' : '#F8F0E2');
    } catch (e) {
      console.warn('Could not apply theme to DOM:', e);
    }
  }

  // RECIPE INTENT & PROMPT TIMING
  static getRecipeIntent(userId?: string): string {
    try {
      const key = userId ? `pantry_recipe_intent_${userId}` : 'pantry_recipe_intent_v1';
      return localStorage.getItem(key) || 'none';
    } catch {
      return 'none';
    }
  }

  static setRecipeIntent(intent: string, userId?: string) {
    try {
      const key = userId ? `pantry_recipe_intent_${userId}` : 'pantry_recipe_intent_v1';
      localStorage.setItem(key, intent);
    } catch (e) {
      console.error(e);
    }
  }

  static getLastRecipeIntentPromptAt(userId?: string): number {
    try {
      const key = userId ? `pantry_last_recipe_intent_prompt_${userId}` : 'pantry_last_recipe_intent_prompt_v1';
      const val = localStorage.getItem(key);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  }

  static setLastRecipeIntentPromptAt(timestamp: number, userId?: string) {
    try {
      const key = userId ? `pantry_last_recipe_intent_prompt_${userId}` : 'pantry_last_recipe_intent_prompt_v1';
      localStorage.setItem(key, timestamp.toString());
    } catch (e) {
      console.error(e);
    }
  }

  // --- CACHED DYNAMIC RECIPES (BACKGROUND/PERSISTED POOL) ---
  static getCachedRecipes(userId?: string): Recipe[] {
    try {
      const key = userId ? `pantry_cached_recipes_${userId}` : 'pantry_cached_recipes_v1';
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveCachedRecipes(recipes: Recipe[], userId?: string) {
    try {
      const key = userId ? `pantry_cached_recipes_${userId}` : 'pantry_cached_recipes_v1';
      const existing = this.getCachedRecipes(userId);
      const merged = [...recipes];
      existing.forEach((ex) => {
        if (!merged.some((r) => r.id === ex.id)) {
          merged.push(ex);
        }
      });
      localStorage.setItem(key, JSON.stringify(merged));
    } catch (e) {
      console.error('Error saving cached recipes to LocalStorage:', e);
    }
  }
}


