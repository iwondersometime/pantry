import fs from 'fs';
import { INITIAL_RECIPES } from './src/data/recipes';

console.log(`Processing ${INITIAL_RECIPES.length} recipes...`);

const registry: Record<string, string> = {};

INITIAL_RECIPES.forEach(recipe => {
  const prompt = `Professional food photography of authentic ${recipe.title}, delicious, high resolution, appetizing, plated beautifully`;
  
  // Create a simple deterministic seed based on the ID
  let seed = 0;
  for (let i = 0; i < recipe.id.length; i++) {
    seed = (seed << 5) - seed + recipe.id.charCodeAt(i);
    seed |= 0;
  }
  seed = Math.abs(seed) % 10000;

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${seed}`;
  
  registry[recipe.id] = url;
});

const outputCode = `// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
// Generated during build process to statically map every recipe to its exact matching generated image.

export const RECIPE_IMAGE_REGISTRY: Record<string, string> = ${JSON.stringify(registry, null, 2)};
`;

fs.writeFileSync('./src/data/recipeImageRegistry.ts', outputCode);
console.log('Successfully generated static image registry for all recipes.');
