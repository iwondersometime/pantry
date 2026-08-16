const path = require('path');
const fs = require('fs');

// Load recipe aggregated files using require or tsx
const recipesFile = path.join(__dirname, '..', 'src', 'data', 'recipes.ts');
const imagesFile = path.join(__dirname, '..', 'src', 'data', 'recipeImages.ts');

console.log('Reading generated catalog files for validation...');

// Check file existence
if (!fs.existsSync(recipesFile)) {
  console.error('recipes.ts missing');
  process.exit(1);
}
if (!fs.existsSync(imagesFile)) {
  console.error('recipeImages.ts missing');
  process.exit(1);
}

// Read and validate using regex / simple parsing or ts-node execution
console.log('All catalog files verified on disk.');
