import { Recipe } from '../types';
import { normalizeSingleAllergy } from './allergyNormalization';

export interface AllergenDefinition {
  id: string;
  displayName: string;
  aliases: string[];
  keywords: string[];
}

export const ALLERGEN_DEFINITIONS: AllergenDefinition[] = [
  {
    id: 'egg',
    displayName: 'Egg',
    aliases: ['egg', 'eggs', 'anda', 'ande', 'anday', 'egg / eggs', 'eggs / egg'],
    keywords: [
      'egg', 'eggs', 'egg-white', 'egg-whites', 'egg-yolk', 'egg-yolks',
      'anda', 'ande', 'anday', 'ando', 'andey', 'muttai', 'guddu',
      'egg curry', 'anda curry', 'egg bhurji', 'anda bhurji', 'egg bhurjee',
      'boiled egg', 'boiled eggs', 'fried egg', 'scrambled egg', 'scrambled eggs', 'poached egg',
      'omelette', 'omelet', 'omlet', 'omlette',
      'mayonnaise', 'mayo', 'eggnog', 'hollandaise', 'aioli', 'meringue', 'custard', 'tamagoyaki', 'tamago'
    ],
  },
  {
    id: 'dairy',
    displayName: 'Dairy',
    aliases: ['dairy', 'milk', 'dairy / milk', 'milk / dairy', 'lactose'],
    keywords: [
      'milk', 'dairy', 'cream', 'heavy cream', 'whipping cream', 'sour cream', 'butter', 'buttermilk', 'condensed milk', 'evaporated milk',
      'cheese', 'parmesan', 'mozzarella', 'cheddar', 'ricotta', 'paneer', 'feta', 'gouda', 'brie', 'cream cheese', 'mascarpone', 'swiss cheese',
      'yogurt', 'yoghurt', 'curd', 'dahi', 'greek yogurt', 'tzatziki', 'lassi',
      'ghee', 'mawa', 'khoya', 'malai', 'rabri', 'makhani', 'makhan', 'chhena', 'clarified butter', 'half and half',
      'whey', 'casein', 'lactose', 'milk powder'
    ],
  },
  {
    id: 'peanuts',
    displayName: 'Peanuts',
    aliases: ['peanuts', 'peanut', 'groundnut', 'groundnuts'],
    keywords: [
      'peanut', 'peanuts', 'peanut butter', 'peanut oil', 'groundnut', 'groundnuts', 'ground nut', 'ground nuts',
      'moongphali', 'mungfali', 'palli', 'kadale kayi'
    ],
  },
  {
    id: 'treenuts',
    displayName: 'Tree Nuts',
    aliases: ['tree nuts', 'tree nut', 'nuts', 'nut', 'tree-nuts'],
    keywords: [
      'almond', 'almonds', 'walnut', 'walnuts', 'cashew', 'cashews', 'pecan', 'pecans', 'pistachio', 'pistachios',
      'macadamia', 'hazelnut', 'hazelnuts', 'pine nut', 'pine nuts', 'chestnut', 'praline', 'nutella', 'marzipan',
      'kaju', 'badam', 'pista', 'akrot', 'akhrot', 'cashew paste', 'almond milk'
    ],
  },
  {
    id: 'gluten',
    displayName: 'Gluten / Wheat',
    aliases: ['gluten', 'wheat', 'gluten / wheat', 'wheat / gluten', 'gluten-free'],
    keywords: [
      'wheat', 'gluten', 'flour', 'all purpose flour', 'all-purpose flour', 'whole wheat', 'bread', 'pasta', 'seitan', 'barley', 'rye', 'couscous', 'semolina', 'bulgur',
      'atta', 'maida', 'suji', 'sooji', 'rava', 'ravva', 'dalia', 'naan', 'roti', 'paratha', 'poori', 'puri', 'bhatura', 'bhature',
      'breadcrumbs', 'panko', 'noodles', 'spaghetti', 'macaroni', 'soy sauce'
    ],
  },
  {
    id: 'soy',
    displayName: 'Soy',
    aliases: ['soy', 'soya', 'soy / soya', 'soya / soy'],
    keywords: [
      'soy', 'soya', 'tofu', 'edamame', 'tempeh', 'miso', 'soy sauce', 'soya sauce', 'tamari', 'soya chunks', 'soya bean', 'soybean', 'soybeans', 'tvp'
    ],
  },
  {
    id: 'fish',
    displayName: 'Fish',
    aliases: ['fish'],
    keywords: [
      'fish', 'salmon', 'tuna', 'cod', 'anchovy', 'anchovies', 'sardine', 'sardines', 'trout', 'halibut', 'sea bass', 'tilapia', 'catfish', 'snapper', 'mahi mahi', 'haddock',
      'machhi', 'machli', 'macchi', 'surmai', 'pomfret', 'rohu', 'katla', 'fish sauce', 'dashi', 'bonito'
    ],
  },
  {
    id: 'shellfish',
    displayName: 'Shellfish',
    aliases: ['shellfish', 'crustaceans'],
    keywords: [
      'shrimp', 'shrimps', 'prawn', 'prawns', 'crab', 'crabs', 'lobster', 'lobsters', 'clam', 'clams', 'mussel', 'mussels', 'oyster', 'oysters', 'squid', 'scallop', 'scallops', 'octopus', 'crawfish', 'crayfish',
      'jhinga', 'chingri', 'kakda'
    ],
  },
  {
    id: 'sesame',
    displayName: 'Sesame',
    aliases: ['sesame'],
    keywords: [
      'sesame', 'sesame seed', 'sesame seeds', 'sesame oil', 'tahini', 'halvah', 'goma', 'til', 'teel'
    ],
  },
];

export const COMMON_ALLERGENS = ALLERGEN_DEFINITIONS.map((def) => ({
  name: def.displayName,
  keywords: def.keywords,
}));

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
  * Safely matches a term against text considering word boundaries or sub-phrases.
  */
function matchesTerm(text: string, term: string): boolean {
  const cleanTerm = term.trim().toLowerCase();
  if (!cleanTerm) return false;

  // Multi-word phrase or compound term
  if (cleanTerm.includes(' ') || cleanTerm.includes('-') || cleanTerm.includes('/')) {
    return text.toLowerCase().includes(cleanTerm);
  }

  // Single word boundary match
  const regex = new RegExp(`\\b${escapeRegExp(cleanTerm)}\\b`, 'i');
  return regex.test(text);
}

/**
 * Normalizes user allergy string to a matching AllergenDefinition if found.
 */
function findMatchingAllergenDefinition(allergyString: string): AllergenDefinition | null {
  const clean = allergyString.trim().toLowerCase();
  if (!clean) return null;

  for (const def of ALLERGEN_DEFINITIONS) {
    if (
      def.id === clean ||
      def.displayName.toLowerCase() === clean ||
      def.aliases.some((alias) => alias.toLowerCase() === clean) ||
      def.keywords.some((kw) => kw.toLowerCase() === clean)
    ) {
      return def;
    }
  }

  return null;
}

/**
 * Centralized Allergy Inspection Engine.
 * Checks a recipe comprehensively against the user's saved allergies.
 * Returns an array of detected allergen names (e.g. ['Egg', 'Dairy']).
 */
export function checkRecipeAllergies(recipe: Recipe, userAllergies: string[] = []): string[] {
  if (!userAllergies || userAllergies.length === 0 || !recipe) {
    return [];
  }

  // Extract all text content from recipe
  const titleText = recipe.title || '';
  const descText = recipe.description || '';

  const ingredientsTextList: string[] = [];
  if (Array.isArray(recipe.ingredients)) {
    recipe.ingredients.forEach((ing) => {
      if (typeof ing === 'string') {
        ingredientsTextList.push(ing);
      } else if (ing && typeof ing === 'object') {
        if (ing.name) ingredientsTextList.push(ing.name);
        if (ing.amount) ingredientsTextList.push(ing.amount);
        if (ing.unit) ingredientsTextList.push(ing.unit);
      }
    });
  }

  const instructionsTextList: string[] = [];
  if (Array.isArray(recipe.instructions)) {
    recipe.instructions.forEach((step) => {
      if (typeof step === 'string') {
        instructionsTextList.push(step);
      } else if (step && typeof step === 'object' && step.instruction) {
        instructionsTextList.push(step.instruction);
      }
    });
  }

  const tagsText = Array.isArray(recipe.tags) ? recipe.tags.join(' ') : '';
  const keywordsText = Array.isArray(recipe.searchKeywords) ? recipe.searchKeywords.join(' ') : '';

  // Combine full recipe text corpus
  const fullTextCorpus = [
    titleText,
    descText,
    ingredientsTextList.join(' '),
    instructionsTextList.join(' '),
    tagsText,
    keywordsText,
  ]
    .join(' ')
    .toLowerCase();

  const detectedAllergensSet: Set<string> = new Set();

  for (const rawAllergy of userAllergies) {
    const norm = normalizeSingleAllergy(rawAllergy);
    if (!norm) continue;

    const matchedDef = findMatchingAllergenDefinition(norm.canonical);

    if (matchedDef) {
      // Check all keywords of the matched allergen definition
      const isPresent = matchedDef.keywords.some((kw) => matchesTerm(fullTextCorpus, kw));
      if (isPresent) {
        detectedAllergensSet.add(matchedDef.displayName);
      }
    } else {
      // Custom user allergy string (e.g., 'Chicken' or 'Mushrooms')
      const customKw = norm.canonical;
      
      // Generate variations (singular and plural)
      const variations = [customKw];
      if (customKw.endsWith('s') && customKw.length > 3) {
        variations.push(customKw.slice(0, -1));
      } else if (!customKw.endsWith('s')) {
        variations.push(customKw + 's');
      }

      const isMatch = variations.some((varTerm) => matchesTerm(fullTextCorpus, varTerm));
      if (isMatch) {
        detectedAllergensSet.add(norm.label);
      }
    }
  }

  return Array.from(detectedAllergensSet);
}
