import { Recipe } from '../types';
import { INDIAN_RECIPES } from './recipes/indian';
import { ITALIAN_RECIPES } from './recipes/italian';
import { JAPANESE_RECIPES } from './recipes/japanese';
import { CHINESE_RECIPES } from './recipes/chinese';
import { MEXICAN_RECIPES } from './recipes/mexican';
import { THAI_RECIPES } from './recipes/thai';
import { KOREAN_RECIPES } from './recipes/korean';
import { AMERICAN_RECIPES } from './recipes/american';
import { MEDITERRANEAN_RECIPES } from './recipes/mediterranean';
import { MIDDLEEASTERN_RECIPES } from './recipes/middleeastern';
import { FRENCH_RECIPES } from './recipes/french';
import { TURKISH_RECIPES } from './recipes/turkish';
import { VIETNAMESE_RECIPES } from './recipes/vietnamese';
import { SPANISH_RECIPES } from './recipes/spanish';
import { GLOBAL_RECIPES } from './recipes/global';
import { SANDWICH_RECIPES } from './recipes/sandwiches';
import { DESSERT_RECIPES } from './recipes/desserts';
import { RECIPE_IMAGES, ERROR_IMAGE_FALLBACK, validateRecipeImages } from './recipeImages';

const ALL_UNFILTERED: Recipe[] = [
  ...INDIAN_RECIPES,
  ...ITALIAN_RECIPES,
  ...JAPANESE_RECIPES,
  ...CHINESE_RECIPES,
  ...MEXICAN_RECIPES,
  ...THAI_RECIPES,
  ...KOREAN_RECIPES,
  ...AMERICAN_RECIPES,
  ...MEDITERRANEAN_RECIPES,
  ...MIDDLEEASTERN_RECIPES,
  ...FRENCH_RECIPES,
  ...TURKISH_RECIPES,
  ...VIETNAMESE_RECIPES,
  ...SPANISH_RECIPES,
  ...GLOBAL_RECIPES,
  ...SANDWICH_RECIPES,
  ...DESSERT_RECIPES,
];

// Ensure unique IDs and bind to the centralized recipe image registry
const seen = new Set<string>();
export const INITIAL_RECIPES: Recipe[] = ALL_UNFILTERED.filter((recipe) => {
  if (!recipe.id || seen.has(recipe.id)) return false;
  seen.add(recipe.id);
  return true;
}).map((recipe) => {
  // Bind directly and strictly from the centralized RECIPE_IMAGES registry
  const boundImage = RECIPE_IMAGES[recipe.id] || ERROR_IMAGE_FALLBACK;
  return {
    ...recipe,
    imageUrl: boundImage,
  };
});

// Run development-time recipe image validation
validateRecipeImages(INITIAL_RECIPES);

export function getRecipeById(id: string): Recipe | undefined {
  return INITIAL_RECIPES.find((r) => r.id === id);
}

export function searchCatalogRecipes(query: string, cuisineFilter?: string): Recipe[] {
  const q = query.trim().toLowerCase();
  return INITIAL_RECIPES.filter((r) => {
    const matchesCuisine = !cuisineFilter || cuisineFilter === 'All' || r.cuisine.toLowerCase() === cuisineFilter.toLowerCase();
    if (!matchesCuisine) return false;
    if (!q) return true;
    
    const titleMatch = r.title.toLowerCase().includes(q);
    const descMatch = r.description.toLowerCase().includes(q);
    const ingMatch = r.ingredients.some((ing) => ing.name.toLowerCase().includes(q));
    const kwMatch = r.searchKeywords.some((kw) => kw.toLowerCase().includes(q));
    const tagMatch = r.tags.some((t) => t.toLowerCase().includes(q));
    
    return titleMatch || descMatch || ingMatch || kwMatch || tagMatch;
  });
}
