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
  | 'French';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface RecipeIngredient {
  name: string;
  amount: string;
  optional?: boolean;
}

export interface CookingStep {
  stepNumber: number;
  instruction: string;
  timerMinutes?: number; // Optional timer for this step (e.g., 10 minutes)
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  cuisine: CuisineType;
  servings: number;
  cookTimeMinutes: number;
  difficulty: DifficultyLevel;
  ingredients: RecipeIngredient[];
  instructions: CookingStep[];
  imageUrl?: string;
  tags: string[]; // e.g. ['Vegetarian', 'Quick', 'Gluten-Free']
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isLowCarb?: boolean;
  isHighProtein?: boolean;
}

export interface MatchedRecipe {
  recipe: Recipe;
  matchPercentage: number;
  availableIngredients: RecipeIngredient[];
  missingIngredients: RecipeIngredient[];
  availableCount: number;
  totalCount: number;
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

export type TabDestination = 'scan' | 'search' | 'saved' | 'history';

export interface DietaryFilters {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  lowCarb: boolean;
  quickOnly: boolean; // <= 20 mins
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

export type AuthState = 'loading' | 'unauthenticated' | 'authenticated';

export type AuthScreen = 'welcome' | 'login' | 'signup' | 'forgot_password';

