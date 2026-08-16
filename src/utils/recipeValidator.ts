import { Recipe, RecipeIngredient } from '../types';

const FORBIDDEN_VAGUE_TERMS = [
  'spices',
  'mixed spices',
  'indian spices',
  'mexican spices',
  'italian spices',
  'seasoning',
  'mixed seasoning',
  'italian seasoning',
  'mexican seasoning',
  'seasonings',
  'herbs and spices',
  'herbs & spices',
  'main ingredient',
  'generic placeholders',
  'vegetables',
  'mixed vegetables',
  'assorted vegetables',
  'fresh vegetables',
  'herbs',
  'mixed herbs',
  'fresh herbs',
  'dried herbs',
  'garden herbs',
  'sauce',
  'mixed sauce',
  'masala',
];

const VALID_MASALA_EXCEPTIONS = [
  'garam masala',
  'chana masala',
  'chaat masala',
  'tikka masala',
  'biryani masala',
  'sambar masala',
  'tandoori masala',
  'pav bhaji masala',
  'kitchen king',
];

const VALID_SAUCE_EXCEPTIONS = [
  'soy sauce',
  'worcestershire',
  'marinara',
  'pasta sauce',
  'tomato sauce',
  'chili sauce',
  'hot sauce',
  'fish sauce',
  'bbq sauce',
  'barbecue sauce',
  'oyster sauce',
  'sriracha',
  'teriyaki',
  'pesto',
];

const VALID_HERB_EXCEPTIONS = [
  'cilantro',
  'coriander leaves',
  'mint',
  'basil',
  'oregano',
  'thyme',
  'rosemary',
  'parsley',
  'chives',
  'dill',
  'sage',
  'bay leaf',
  'bay leaves',
  'curry leaves',
];

const CULINARY_KEYWORDS_TO_CHECK = [
  'cumin',
  'coriander',
  'turmeric',
  'chili',
  'chilli',
  'cayenne',
  'paprika',
  'garam masala',
  'cardamom',
  'cinnamon',
  'cloves',
  'ginger',
  'garlic',
  'onion',
  'paneer',
  'chicken',
  'shrimp',
  'prawn',
  'tofu',
  'potato',
  'aloo',
  'tomato',
  'basil',
  'oregano',
  'thyme',
  'rosemary',
  'parsley',
  'soy sauce',
  'mirin',
  'mustard',
  'fenugreek',
  'kasuri methi',
  'amchur',
  'asafoetida',
  'hing',
  'saffron',
];

/**
 * Checks if a given ingredient name is considered vague or generic.
 */
export function isVagueIngredientName(name: string): boolean {
  if (!name) return true;
  const lower = name.trim().toLowerCase();

  // Check direct matches or general vague terms
  for (const term of FORBIDDEN_VAGUE_TERMS) {
    if (lower === term) {
      // Check exceptions
      if (term === 'masala') {
        const isExcepted = VALID_MASALA_EXCEPTIONS.some(ex => lower.includes(ex));
        if (isExcepted) continue;
      }
      if (term === 'sauce') {
        const isExcepted = VALID_SAUCE_EXCEPTIONS.some(ex => lower.includes(ex));
        if (isExcepted) continue;
      }
      if (term === 'herbs') {
        const isExcepted = VALID_HERB_EXCEPTIONS.some(ex => lower.includes(ex));
        if (isExcepted) continue;
      }
      return true;
    }
  }

  // Also catch direct subsets like "1 tbsp Spices" or "Mixed Spices"
  if (lower === 'spices' || lower === 'mixed spices' || lower === 'indian spices' || lower === 'seasoning' || lower === 'seasonings' || lower === 'main ingredient') {
    return true;
  }

  return false;
}

/**
 * Validates a recipe's ingredients and step consistency.
 * Returns isValid and an array of error messages.
 */
export function validateRecipe(recipe: Partial<Recipe>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!recipe.title || !recipe.title.trim()) {
    errors.push('Recipe is missing a title.');
  }

  const ingredients = recipe.ingredients || [];
  if (ingredients.length === 0) {
    errors.push('Recipe contains no ingredients.');
  }

  // 1. Validate ingredient names and quantities
  ingredients.forEach((ing, idx) => {
    const name = ing.name ? ing.name.trim() : '';
    if (!name) {
      errors.push(`Ingredient at index ${idx} is missing a name.`);
      return;
    }

    // Check if name is vague
    if (isVagueIngredientName(name)) {
      errors.push(`Ingredient "${name}" is too vague or generic.`);
    }

    // Check if amount/quantity is missing when it should be present
    const amount = ing.amount ? ing.amount.trim() : '';
    if (!amount) {
      errors.push(`Ingredient "${name}" is missing an amount.`);
    } else {
      const lowerAmount = amount.toLowerCase();
      if (lowerAmount === '?' || lowerAmount === 'none' || lowerAmount === 'n/a') {
        errors.push(`Ingredient "${name}" has an invalid amount: "${amount}".`);
      }
    }
  });

  // 2. Validate consistency between cooking steps and ingredients
  const instructions = recipe.instructions || [];
  const fullIngredientsCorpus = ingredients.map(ing => ing.name.toLowerCase()).join(' ');

  instructions.forEach((step) => {
    const text = step.instruction ? step.instruction.toLowerCase() : '';
    if (!text) return;

    // Check if the step mentions culinary keywords that are completely missing from ingredients
    for (const kw of CULINARY_KEYWORDS_TO_CHECK) {
      // Find whole-word boundary or direct substring match for specific spice
      const wordRegex = new RegExp(`\\b${kw}\\b`, 'i');
      if (wordRegex.test(text)) {
        // Step mentions the keyword, does it exist in the ingredients?
        const isMatched = ingredients.some(ing => {
          const ingName = ing.name.toLowerCase();
          if (ingName.includes(kw)) return true;
          // Exception map checks
          if (kw === 'chili' || kw === 'chilli') {
            return ingName.includes('chili') || ingName.includes('chilli') || ingName.includes('cayenne') || ingName.includes('paprika') || ingName.includes('pepper');
          }
          if (kw === 'coriander') {
            return ingName.includes('coriander') || ingName.includes('cilantro');
          }
          return false;
        });

        if (!isMatched) {
          errors.push(
            `Instruction step ${step.stepNumber} mentions "${kw}", but it is missing from the ingredients list.`
          );
        }
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Normalizes recipe titles for highly precise duplicate checking.
 * Removes common regional prefixes, marketing adjectives, dish types, and punctuation.
 */
export function normalizeRecipeTitle(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/\b(indian|italian|japanese|mexican|chinese|korean|american|mediterranean|thai|french|greek|spanish|turkish|vietnamese|bestselling|bestseller|classic|authentic|traditional|homemade|easy|quick|simple|delicious|bespoke|gourmet|style|recipe|dish|sandwiches|sandwich|soups|soup|curries|curry|stews|stew|salads|salad|bowls|bowl|skillet|skillets|pan|pans|pot|pots)\b/gi, '')
    .replace(/[^a-z0-9]/gi, '')
    .trim();
}

/**
 * Strips out excessive length, prompt leakage, and validation-bypass garbage from titles.
 * Returns a clean, concise dish title.
 */
export function cleanRecipeTitle(title: string): string {
  if (!title) return '';
  let cleaned = title.trim();

  const injectionKeywords = [
    'step by step', 'instruction', 'json', 'schema', 'specification', 'output', 'requirement', 'formatted',
    'strictly', 'adhering', 'validated', 'thoroughly', 'accurate', 'complete', 'data template', 'system parsing',
    'chef quality', 'guaranteed', 'fine dining', 'culinary execution', 'metadata', 'compliant', 'fully',
    'consumption', 'backend', 'process flow', 'standard', 'deviation', 'payload', 'block', 'document', 'standards'
  ];

  const containsInjection = injectionKeywords.some(keyword => cleaned.toLowerCase().includes(keyword));

  if (cleaned.length > 80 || containsInjection) {
    // Look for standard separators
    const separators = [' - ', ' – ', ' : ', ' | ', '\n'];
    for (const sep of separators) {
      if (cleaned.includes(sep)) {
        const parts = cleaned.split(sep);
        const candidate = parts[0].trim();
        if (candidate.length > 0 && candidate.length <= 60) {
          return candidate;
        }
      }
    }

    // Try parenthesized block extraction
    const parenthesized = cleaned.match(/^([^(]+(?:\([^)]+\))?)/);
    if (parenthesized && parenthesized[1]) {
      const candidate = parenthesized[1].trim();
      if (candidate.length > 0 && candidate.length <= 70) {
        return candidate;
      }
    }

    // Fallback: take the first 4-5 words
    const words = cleaned.split(/\s+/);
    if (words.length > 5) {
      const truncated = words.slice(0, 5).join(' ');
      return truncated.replace(/[,.:;\-_]+$/, '').trim();
    }
  }

  return cleaned;
}

