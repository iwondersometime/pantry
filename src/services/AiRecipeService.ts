import { Recipe, DietaryFilters } from '../types';
import { RecipeImageService } from './RecipeImageService';
import { LocalStorageService } from './LocalStorageService';

// Session-level set of previously shown recipe titles to prevent repeats
const sessionShownTitles = new Set<string>();

export interface GenerateRecipeOptions {
  cuisine?: string;
  filters?: DietaryFilters;
  count?: number;
  allergies?: string[];
  excludeTitles?: string[];
  signal?: AbortSignal;
}

export class AiRecipeService {
  /**
   * Request Gemini server-side endpoint to generate bespoke recipes tailored to exact pantry ingredients
   */
  static async generateRecipes(
    ingredients: string[],
    filtersOrOptions?: DietaryFilters | GenerateRecipeOptions,
    countOverride?: number
  ): Promise<Recipe[]> {
    try {
      let cuisine: string | undefined;
      let filters: DietaryFilters | undefined;
      let count = countOverride || 6;
      let customExclude: string[] = [];
      let allergies: string[] = LocalStorageService.getUserAllergies();
      let signal: AbortSignal | undefined;

      if (filtersOrOptions) {
        if ('cuisine' in filtersOrOptions || 'excludeTitles' in filtersOrOptions || 'allergies' in filtersOrOptions || 'signal' in filtersOrOptions) {
          const opts = filtersOrOptions as GenerateRecipeOptions;
          cuisine = opts.cuisine;
          filters = opts.filters;
          signal = opts.signal;
          count = opts.count || countOverride || 6;
          if (Array.isArray(opts.allergies)) {
            allergies = opts.allergies;
          }
          if (Array.isArray(opts.excludeTitles)) {
            customExclude = opts.excludeTitles;
          }
        } else {
          filters = filtersOrOptions as DietaryFilters;
        }
      }

      // Combine session shown titles with any custom exclusions
      const allExclusions = Array.from(
        new Set([...Array.from(sessionShownTitles), ...customExclude])
      );

      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          cuisine,
          filters,
          allergies,
          count,
          excludeTitles: allExclusions,
        }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned status ${response.status}`);
      }

      const data = await response.json();
      const rawRecipes: Recipe[] = Array.isArray(data.recipes) ? data.recipes : [];

      // Process and record titles to prevent repeats in subsequent calls
      const verifiedRecipes = rawRecipes.map((recipe) => {
        if (recipe.title) {
          sessionShownTitles.add(recipe.title.trim().toLowerCase());
        }

        // Ensure image URL is accurate
        const accurateImg = recipe.imageUrl || RecipeImageService.getRecipeImageUrl(
          recipe.title,
          recipe.cuisine,
          recipe.imageQuery,
          undefined,
          recipe.ingredients,
          recipe.id
        );

        return {
          ...recipe,
          imageUrl: accurateImg,
        };
      });

      return verifiedRecipes;
    } catch (error: any) {
      console.error('Error in AiRecipeService.generateRecipes:', error);
      throw error;
    }
  }

  /**
   * Reset session shown recipe memory
   */
  static resetSessionHistory() {
    sessionShownTitles.clear();
  }

  /**
   * Add specific titles to session memory
   */
  static rememberTitles(titles: string[]) {
    titles.forEach((t) => sessionShownTitles.add(t.trim().toLowerCase()));
  }
}
