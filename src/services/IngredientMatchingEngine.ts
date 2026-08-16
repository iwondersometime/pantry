import { Recipe, RecipeIngredient, MatchedRecipe, DietaryFilters } from '../types';
import { checkRecipeAllergies } from '../utils/allergyChecker';

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
  let matchPercentage = totalCount > 0 ? Math.round((availableCount / totalCount) * 100) : 0;

  // If recipe came with explicit pantryMatch score from Gemini, blend or prefer it
  if (typeof recipe.pantryMatch === 'number' && recipe.pantryMatch > 0) {
    matchPercentage = recipe.pantryMatch;
  }

  return {
    recipe,
    matchPercentage,
    availableIngredients,
    missingIngredients,
    availableCount,
    totalCount,
  };
}

export function normalizeCuisineName(cuisineStr?: string): string {
  if (!cuisineStr) return 'Other';
  const clean = cuisineStr.trim().toLowerCase();
  if (clean.includes('indian')) return 'Indian';
  if (clean.includes('italian')) return 'Italian';
  if (clean.includes('japanese')) return 'Japanese';
  if (clean.includes('mexican')) return 'Mexican';
  if (clean.includes('chinese')) return 'Chinese';
  if (clean.includes('korean')) return 'Korean';
  if (clean.includes('thai')) return 'Thai';
  if (clean.includes('mediterranean')) return 'Mediterranean';
  if (clean.includes('american')) return 'American';
  if (clean.includes('french')) return 'French';
  if (clean.includes('greek')) return 'Greek';
  if (clean.includes('middle eastern') || clean.includes('lebanese') || clean.includes('turkish') || clean.includes('persian')) return 'Middle Eastern';
  if (clean.includes('vietnamese') || clean.includes('pho')) return 'Vietnamese';
  if (clean.includes('spanish')) return 'Spanish';
  return cuisineStr.trim();
}

/**
 * Match & rank all recipes based on user ingredients and optional dietary/cuisine/time/difficulty/expiring filters
 */
export function matchAndRankRecipes(
  recipes: Recipe[],
  userIngredients: string[],
  filters?: DietaryFilters,
  searchQuery?: string,
  selectedCuisine?: string,
  expiringIngredients: string[] = [],
  quickCookingSession?: { vibe: string; time: string; allergies?: string[]; previouslyCookedIds?: string[] } | null
): MatchedRecipe[] {
  let matchedList = recipes.map((r) => {
    const baseMatch = calculateRecipeMatch(r, userIngredients);
    // Check if recipe uses any ingredient marked as expiring soon
    const usesExpiring = expiringIngredients.length > 0 && r.ingredients.some((ing) => {
      const normIng = normalizeIngredientName(ing.name);
      return expiringIngredients.some((exp) => {
        const normExp = normalizeIngredientName(exp);
        return normIng === normExp || normIng.includes(normExp) || normExp.includes(normIng);
      });
    });

    return {
      ...baseMatch,
      usesExpiringIngredients: usesExpiring,
    };
  });

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

  // Apply Cuisine Filter from explicit arg or filter object
  const activeCuisine = selectedCuisine || filters?.cuisine;
  if (activeCuisine && activeCuisine !== 'All') {
    const targetNorm = normalizeCuisineName(activeCuisine);
    matchedList = matchedList.filter((m) => {
      const recipeNorm = normalizeCuisineName(m.recipe.cuisine);
      return recipeNorm === targetNorm || m.recipe.cuisine.trim().toLowerCase() === activeCuisine.trim().toLowerCase();
    });
  }

  // Apply Detailed Filters
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
    if (filters.highProtein) {
      matchedList = matchedList.filter((m) => m.recipe.isHighProtein);
    }
    if (filters.quickOnly) {
      matchedList = matchedList.filter((m) => m.recipe.cookTimeMinutes <= 20);
    }

    // Cook Time Ranges
    if (filters.cookTime && filters.cookTime !== 'all') {
      if (filters.cookTime === 'under15') {
        matchedList = matchedList.filter((m) => m.recipe.cookTimeMinutes < 15);
      } else if (filters.cookTime === '15to30') {
        matchedList = matchedList.filter((m) => m.recipe.cookTimeMinutes >= 15 && m.recipe.cookTimeMinutes <= 30);
      } else if (filters.cookTime === '30to60') {
        matchedList = matchedList.filter((m) => m.recipe.cookTimeMinutes > 30 && m.recipe.cookTimeMinutes <= 60);
      }
    }

    // Difficulty
    if (filters.difficulty && filters.difficulty !== 'All') {
      matchedList = matchedList.filter((m) => m.recipe.difficulty === filters.difficulty);
    }
  }

  // Rank primarily by match percentage (and boost if uses expiring ingredients!), then by available ingredients
  if (quickCookingSession) {
    const { vibe, time, allergies = [], previouslyCookedIds = [] } = quickCookingSession;
    matchedList.sort((a, b) => {
      const hasAllergyA = checkRecipeAllergies(a.recipe, allergies).length > 0;
      const hasAllergyB = checkRecipeAllergies(b.recipe, allergies).length > 0;
      
      const isPreviouslyCookedA = previouslyCookedIds.includes(a.recipe.id);
      const isPreviouslyCookedB = previouslyCookedIds.includes(b.recipe.id);
      
      const scoreA = calculateQuickScore(a, vibe, time, hasAllergyA, isPreviouslyCookedA);
      const scoreB = calculateQuickScore(b, vibe, time, hasAllergyB, isPreviouslyCookedB);
      
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return b.availableCount - a.availableCount;
    });
  } else {
    matchedList.sort((a, b) => {
      const scoreA = a.matchPercentage + (a.usesExpiringIngredients ? 25 : 0);
      const scoreB = b.matchPercentage + (b.usesExpiringIngredients ? 25 : 0);

      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return b.availableCount - a.availableCount;
    });
  }

  return matchedList;
}

function calculateQuickScore(
  matched: MatchedRecipe,
  vibe: string,
  time: string,
  hasAllergy: boolean,
  isPreviouslyCooked: boolean
): number {
  // Scale base match percentage to 0 - 1000 to allow fine-grained boosts
  let score = matched.matchPercentage * 10;
  
  if (hasAllergy) {
    score -= 100000; // Force allergy-incompatible recipes to the absolute bottom
  }
  
  if (isPreviouslyCooked) {
    score -= 150; // De-prioritize previously cooked recipes (approx -15% match equivalent)
  }
  
  if (matched.usesExpiringIngredients) {
    score += 250; // Boost recipes utilizing expiring ingredients (+25% match equivalent)
  }
  
  const rTime = matched.recipe.totalTimeMinutes || matched.recipe.cookTimeMinutes || 0;
  const rDiff = matched.recipe.difficulty;
  const titleLower = matched.recipe.title.toLowerCase();
  
  // Local hour to adapt suggestions naturally
  const localHour = new Date().getHours();
  const isMorning = localHour >= 5 && localHour < 12;
  const isEvening = localHour >= 17 && localHour < 21;
  const isNight = localHour >= 21 || localHour < 5;
  
  // Comprehensive dessert check matching user's requests
  const isDessert = matched.recipe.tags?.some(t => {
    const lt = t.toLowerCase();
    return lt.includes('dessert') || lt.includes('sweet') || lt.includes('baking') || lt.includes('cake');
  }) || matched.recipe.cuisine === 'Other' && (
    titleLower.includes('kheer') ||
    titleLower.includes('halwa') ||
    titleLower.includes('cake') ||
    titleLower.includes('pudding') ||
    titleLower.includes('sweet') ||
    titleLower.includes('cupcake') ||
    titleLower.includes('muffin') ||
    titleLower.includes('custard') ||
    titleLower.includes('jamun') ||
    titleLower.includes('tukda') ||
    titleLower.includes('brownie')
  ) ||
  titleLower.includes('custard') ||
  titleLower.includes('brownie') ||
  titleLower.includes('cake') ||
  titleLower.includes('pudding') ||
  titleLower.includes('sweet') ||
  titleLower.includes('kheer') ||
  titleLower.includes('jamun') ||
  titleLower.includes('tukda') ||
  titleLower.includes('halwa');

  // Sandwiches & fun foods check matching user's requests
  const isFunFood = titleLower.includes('sandwich') ||
                    titleLower.includes('toast') ||
                    titleLower.includes('toastie') ||
                    titleLower.includes('wrap') ||
                    titleLower.includes('roll') ||
                    titleLower.includes('taco') ||
                    titleLower.includes('pizza') ||
                    titleLower.includes('burger') ||
                    titleLower.includes('snack') ||
                    titleLower.includes('quesadilla') ||
                    titleLower.includes('chaat') ||
                    titleLower.includes('nachos') ||
                    matched.recipe.tags?.some(t => {
                      const lt = t.toLowerCase();
                      return lt.includes('sandwich') || lt.includes('snack') || lt.includes('street food') || lt.includes('fast');
                    });
  
  if (vibe === 'sweet') {
    if (isDessert) {
      score += 450; // Genuinely different feed boost for desserts (+45% match equivalent)
      if (isNight) {
        score += 100; // Late-night sweet craving boost
      }
    } else {
      score -= 300; // De-prioritize non-desserts for Sweet mood
    }
  } else if (vibe === 'fun') {
    if (isFunFood) {
      score += 400; // Genuinely different feed boost for fun foods
    } else {
      score -= 200;
    }
  } else if (vibe === 'quick') {
    if (rTime <= 10) {
      score += 300;
    } else if (rTime <= 15) {
      score += 150;
    } else if (rTime > 25) {
      score -= 300;
    }

    if (rDiff === 'Easy') {
      score += 100;
    }

    // Time-based adaptations for Quick selection
    if (isMorning) {
      const isBreakfast = titleLower.includes('pancake') ||
                          titleLower.includes('poha') ||
                          titleLower.includes('upma') ||
                          titleLower.includes('toast') ||
                          titleLower.includes('egg') ||
                          titleLower.includes('omelette') ||
                          titleLower.includes('smoothie') ||
                          matched.recipe.tags?.some(t => t.toLowerCase().includes('breakfast'));
      if (isBreakfast) {
        score += 150;
      }
    } else if (isEvening) {
      const isFastSnack = titleLower.includes('chaat') ||
                          titleLower.includes('pakora') ||
                          titleLower.includes('fritter') ||
                          titleLower.includes('snack') ||
                          titleLower.includes('bites') ||
                          isFunFood;
      if (isFastSnack) {
        score += 150;
      }
    }
  } else if (vibe === 'moderate') {
    if (rTime > 10 && rTime <= 30) {
      score += 300;
    } else if (rTime <= 10) {
      score += 100;
    } else if (rTime > 45) {
      score -= 300;
    }

    if (rDiff === 'Medium') {
      score += 150;
    }
  } else if (vibe === 'challenge') {
    if (rDiff === 'Hard') {
      score += 300;
    } else if (rDiff === 'Medium') {
      score += 100;
    } else {
      score -= 200;
    }

    if (rTime >= 30) {
      score += 200;
    }
  } else if (vibe === 'surprise') {
    // Deterministic pseudo-random score based on recipe ID hash for stability
    let hash = 0;
    for (let i = 0; i < matched.recipe.id.length; i++) {
      hash += matched.recipe.id.charCodeAt(i);
    }
    score += (hash % 401) - 200; // -200 to +200 variance
  }
  
  return score;
}
