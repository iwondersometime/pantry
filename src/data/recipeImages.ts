import { Recipe } from '../types';
import { RECIPE_IMAGE_REGISTRY } from './recipeImageRegistry';

/**
 * Centralized Global Recipe Image Registry & Resolver
 * CLEAN RESET: Every single recipe has a unique, permanently generated 
 * image that perfectly matches its title. No generic photos. No placeholders.
 */

export const ERROR_IMAGE_FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <rect width="100%" height="100%" fill="#F7F3EB"/>
    <rect x="24" y="24" width="752" height="552" rx="20" fill="#ECE5D8" stroke="#D5CABA" stroke-width="2" stroke-dasharray="6 6"/>
    <circle cx="400" cy="260" r="44" fill="#D8CCC0"/>
    <path d="M380 260h40M400 240v40" stroke="#8C7D6B" stroke-width="3.5" stroke-linecap="round"/>
    <text x="50%" y="350" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="22" fill="#5C4D3D" text-anchor="middle" letter-spacing="1.5">IMAGE NOT AVAILABLE</text>
    <text x="50%" y="385" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="14" fill="#8C7C6B" text-anchor="middle">Recipe photo asset missing</text>
  </svg>`
);

export function getRecipeImage(recipeOrId: Recipe | string): string {
  const id = typeof recipeOrId === 'string' ? recipeOrId : recipeOrId?.id;
  
  if (!id) {
    const title = typeof recipeOrId === 'object' ? recipeOrId?.title : 'Unknown';
    console.error(`Recipe: ${title}\nRecipe ID: null\nImage status: MISSING`);
    return ERROR_IMAGE_FALLBACK;
  }
  
  // 1. Authoritative lookup in central registry by ID
  if (RECIPE_IMAGE_REGISTRY[id]) {
    return RECIPE_IMAGE_REGISTRY[id];
  }

  // 2. Dynamic generation ONLY for custom user-created recipes at runtime
  if (typeof recipeOrId === 'object' && recipeOrId.title && recipeOrId.id && recipeOrId.id.startsWith('user-')) {
    const ingredients = recipeOrId.ingredients?.map(i => typeof i === 'string' ? i : i.name).slice(0, 5).join(', ') || '';
    const desc = recipeOrId.description || '';
    const prompt = `Photorealistic professional food photography of authentic ${recipeOrId.title}. ${desc} Visible ingredients: ${ingredients}. Warm natural restaurant lighting, gourmet presentation, close-up food photography, no text, no people, dish centered.`;
    
    let seed = 0;
    for (let i = 0; i < id.length; i++) {
      seed = (seed << 5) - seed + id.charCodeAt(i);
      seed |= 0;
    }
    seed = Math.abs(seed) % 100000 + 1000;
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${seed}`;
  }
  
  // 3. Fallback with mandatory logging
  const title = typeof recipeOrId === 'object' ? recipeOrId.title : id;
  console.warn(`Recipe: ${title}\nRecipe ID: ${id}\nImage status: MISSING`);
  return ERROR_IMAGE_FALLBACK;
}

export const RECIPE_IMAGES: Record<string, string> = new Proxy({}, {
  get(target, prop: string) {
    if (typeof prop === 'string') {
      return getRecipeImage(prop);
    }
    return undefined;
  }
});

export function validateRecipeImages(recipes: Recipe[]): boolean {
  const urlToRecipes = new Map<string, string[]>();
  const invalid: string[] = [];
  const missing: string[] = [];
  const placeholders: string[] = [];
  let validCount = 0;

  for (const recipe of recipes) {
    if (!recipe.id) {
      invalid.push(`Missing recipe ID on: "${recipe.title}"`);
      continue;
    }

    const url = RECIPE_IMAGE_REGISTRY[recipe.id];
    
    if (!url || url === ERROR_IMAGE_FALLBACK) {
      missing.push(`Recipe: ${recipe.title} (ID: ${recipe.id})`);
      continue;
    }
    
    if (url.includes('placeholder') || url.includes('coming-soon') || url.includes('IMAGE NOT READY')) {
      placeholders.push(`Recipe: ${recipe.title} (ID: ${recipe.id})`);
      continue;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image/')) {
      invalid.push(`Recipe: ${recipe.title} (ID: ${recipe.id}) has invalid URL: "${url}"`);
      continue;
    }

    validCount++;

    if (urlToRecipes.has(url)) {
      urlToRecipes.get(url)!.push(recipe.id);
    } else {
      urlToRecipes.set(url, [recipe.id]);
    }
  }

  const duplicates = Array.from(urlToRecipes.entries()).filter(([_, ids]) => ids.length > 1);

  console.log(`\n==================================================`);
  console.log(`IMAGE VALIDATION REPORT`);
  console.log(`==================================================`);
  console.log(`TOTAL RECIPES: ${recipes.length}`);
  console.log(`VALID IMAGES: ${validCount}`);
  console.log(`MISSING IMAGES: ${missing.length}`);
  console.log(`DUPLICATE IMAGE MAPPINGS: ${duplicates.length}`);
  console.log(`INVALID IMAGE REFERENCES: ${invalid.length}`);
  console.log(`PLACEHOLDERS: ${placeholders.length}`);
  console.log(`==================================================\n`);

  if (missing.length > 0 || placeholders.length > 0 || invalid.length > 0 || duplicates.length > 0) {
    console.error(`[VALIDATION FAILED] Please check the logs.`);
    return false;
  } else {
    console.log('[VALIDATION SUCCESS] 0 missing, 0 placeholders, 0 invalid references!');
    return true;
  }
}
