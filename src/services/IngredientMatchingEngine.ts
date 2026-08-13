import { Recipe, RecipeIngredient, MatchedRecipe, DietaryFilters } from '../types';

/**
 * Helper to normalize ingredient names for comparison
 * e.g., "Eggs" -> "egg", "Tomatoes" -> "tomato", "Chicken Breast" -> "chicken"
 */
export function normalizeIngredientName(name: string): string {
  if (!name) return '';
  let clean = name.trim().toLowerCase();

  // Strip common descriptors
  clean = clean
    .replace(/\b(fresh|diced|sliced|chopped|minced|cubed|boneless|skinless|cooked|raw|cooked|frozen|dried|ground)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Common Aliases & Plural Normalizations
  if (clean === 'egg' || clean === 'eggs') return 'egg';
  if (clean === 'tomato' || clean === 'tomatoes') return 'tomato';
  if (clean === 'onion' || clean === 'onions' || clean === 'shallot' || clean === 'shallots') return 'onion';
  if (clean === 'garlic' || clean === 'garlic cloves' || clean === 'garlic clove') return 'garlic';
  if (clean.includes('chicken')) return 'chicken';
  if (clean.includes('rice')) return 'rice';
  if (clean.includes('pasta') || clean.includes('spaghetti') || clean.includes('penne') || clean.includes('noodle')) return 'pasta';
  if (clean.includes('spinach')) return 'spinach';
  if (clean.includes('paneer')) return 'paneer';
  if (clean.includes('butter')) return 'butter';
  if (clean.includes('soy sauce')) return 'soy sauce';
  if (clean.includes('oyster sauce')) return 'oyster sauce';
  if (clean.includes('sesame oil')) return 'sesame oil';
  if (clean.includes('parmesan') || clean.includes('cheese')) return 'cheese';

  // Basic trailing 's' plural handling
  if (clean.length > 3 && clean.endsWith('s') && !clean.endsWith('ss')) {
    clean = clean.slice(0, -1);
  }

  return clean;
}

/**
 * Check if a recipe ingredient matches any of the available user ingredients
 */
export function isIngredientMatch(recipeIng: RecipeIngredient, userIngredients: string[]): boolean {
  const normRecipeIng = normalizeIngredientName(recipeIng.name);
  if (!normRecipeIng) return false;

  return userIngredients.some((userIng) => {
    const normUserIng = normalizeIngredientName(userIng);
    if (!normUserIng) return false;

    // Direct match or substring match
    return normRecipeIng === normUserIng || normRecipeIng.includes(normUserIng) || normUserIng.includes(normRecipeIng);
  });
}

/**
 * Calculate dynamic match for a single recipe
 */
export function calculateRecipeMatch(recipe: Recipe, userIngredients: string[]): MatchedRecipe {
  const availableIngredients: RecipeIngredient[] = [];
  const missingIngredients: RecipeIngredient[] = [];

  recipe.ingredients.forEach((ing) => {
    if (isIngredientMatch(ing, userIngredients)) {
      availableIngredients.push(ing);
    } else {
      missingIngredients.push(ing);
    }
  });

  const availableCount = availableIngredients.length;
  const totalCount = recipe.ingredients.length;

  // Calculate percentage integer (0 to 100)
  const matchPercentage = totalCount > 0 ? Math.round((availableCount / totalCount) * 100) : 0;

  return {
    recipe,
    matchPercentage,
    availableIngredients,
    missingIngredients,
    availableCount,
    totalCount,
  };
}

/**
 * Match & rank all recipes based on user ingredients and optional dietary/cuisine filters
 */
export function matchAndRankRecipes(
  recipes: Recipe[],
  userIngredients: string[],
  filters?: DietaryFilters,
  searchQuery?: string,
  selectedCuisine?: string
): MatchedRecipe[] {
  let matchedList = recipes.map((r) => calculateRecipeMatch(r, userIngredients));

  // Apply Search Query filter if present
  if (searchQuery && searchQuery.trim().length > 0) {
    const query = searchQuery.toLowerCase().trim();
    matchedList = matchedList.filter(
      (m) =>
        m.recipe.title.toLowerCase().includes(query) ||
        m.recipe.cuisine.toLowerCase().includes(query) ||
        m.recipe.ingredients.some((i) => i.name.toLowerCase().includes(query))
    );
  }

  // Apply Cuisine Filter
  if (selectedCuisine && selectedCuisine !== 'All') {
    matchedList = matchedList.filter((m) => m.recipe.cuisine.toLowerCase() === selectedCuisine.toLowerCase());
  }

  // Apply Dietary Filters
  if (filters) {
    if (filters.vegetarian) {
      matchedList = matchedList.filter((m) => m.recipe.isVegetarian);
    }
    if (filters.vegan) {
      matchedList = matchedList.filter((m) => m.recipe.isVegan);
    }
    if (filters.glutenFree) {
      matchedList = matchedList.filter((m) => m.recipe.isGlutenFree);
    }
    if (filters.lowCarb) {
      matchedList = matchedList.filter((m) => m.recipe.isLowCarb);
    }
    if (filters.quickOnly) {
      matchedList = matchedList.filter((m) => m.recipe.cookTimeMinutes <= 20);
    }
  }

  // Rank primarily by match percentage (descending), then by number of available ingredients
  matchedList.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return b.availableCount - a.availableCount;
  });

  return matchedList;
}
