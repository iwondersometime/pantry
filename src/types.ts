export type CuisineType = 
  | 'Indian'
  | 'Chinese'
  | 'Japanese'
  | 'Italian'
  | 'Mexican'
  | 'Korean'
  | 'American'
  | 'Mediterranean'
  | 'Thai'
  | 'French'
  | 'Greek'
  | 'Middle Eastern'
  | 'Vietnamese'
  | 'Spanish'
  | 'Turkish'
  | 'Other';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface RecipeIngredient {
  name: string;
  amount: string;
  unit?: string;
  optional?: boolean;
}

export interface CookingStep {
  stepNumber: number;
  instruction: string;
  timerMinutes?: number; // Optional timer for this step (e.g., 10 minutes)
}

export interface NutritionInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: CuisineType;
  countryOrRegion?: string;
  servings: number;
  prepTimeMinutes?: number;
  cookTimeMinutes: number;
  totalTimeMinutes?: number;
  difficulty: DifficultyLevel;
  ingredients: RecipeIngredient[];
  instructions: CookingStep[];
  imageUrl?: string;
  tags: string[]; // e.g. ['Vegetarian', 'Quick', 'Gluten-Free']
  searchKeywords?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isLowCarb?: boolean;
  isHighProtein?: boolean;
  isBudgetFriendly?: boolean;
  nutrition?: NutritionInfo;
  pantryMatch?: number;
  imageQuery?: string;
  availableIngredients?: string[];
  additionalIngredients?: string[];
}

export interface MatchedRecipe {
  recipe: Recipe;
  matchPercentage: number;
  availableIngredients: RecipeIngredient[];
  missingIngredients: RecipeIngredient[];
  availableCount: number;
  totalCount: number;
  usesExpiringIngredients?: boolean;
}

export interface ScanHistoryItem {
  id: string;
  timestamp: string; // Formatted e.g. "13 AUG, 8:21"
  rawDate: number;
  ideasCount: number;
  ingredients: string[];
  imageUrl?: string;
}

export interface SavedRecipeItem {
  id: string;
  recipeId: string;
  savedAt: number;
  recipe: Recipe;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount?: string;
  recipeId?: string;
  recipeTitle?: string;
  checked: boolean;
  addedAt: number;
}

export type TabDestination = 'home' | 'scan' | 'saved' | 'history' | 'search' | 'shopping';

export type CookTimeFilter = 'all' | 'under15' | '15to30' | '30to60';

export interface DietaryFilters {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  lowCarb: boolean;
  highProtein: boolean;
  quickOnly: boolean; // <= 20 mins
  cookTime: CookTimeFilter;
  difficulty: DifficultyLevel | 'All';
  cuisine: CuisineType | 'All';
}

export type AppTheme = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: number;
  theme?: AppTheme;
  allergies?: string[];
  googlePhotoURL?: string | null;
  customPhotoURL?: string | null;
  photoSource?: 'google' | 'custom' | 'fallback';
  onboardingCompleted?: boolean;
  cookingPreference?: string;
  recipeIntent?: string;
}

export type AuthState = 'loading' | 'unauthenticated' | 'authenticated';

export type AuthScreen = 'welcome' | 'login' | 'signup' | 'forgot_password';


