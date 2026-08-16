export interface UnifiedAllergyItem {
  id: string;
  label: string;
  canonical: string;
  type: 'preset' | 'custom';
  isActive: boolean;
}

export interface AllergyNormalizationResult {
  label: string;
  canonical: string;
  isPreset: boolean;
}

export const PRESET_ALLERGY_OPTIONS = [
  { label: 'Peanuts', canonical: 'peanuts' },
  { label: 'Tree Nuts', canonical: 'tree nuts' },
  { label: 'Dairy', canonical: 'dairy' },
  { label: 'Eggs', canonical: 'eggs' },
  { label: 'Gluten / Wheat', canonical: 'gluten / wheat' },
  { label: 'Soy', canonical: 'soy' },
  { label: 'Fish', canonical: 'fish' },
  { label: 'Shellfish', canonical: 'shellfish' },
  { label: 'Sesame', canonical: 'sesame' },
];

/**
 * Normalizes any text string to clean title case (e.g. " chicken breast " -> "Chicken Breast")
 */
export function toTitleCase(str: string): string {
  const clean = str.trim().replace(/\s+/g, ' ');
  if (!clean) return '';
  return clean
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Preset mapping dictionary to convert common aliases to canonical preset labels.
 */
const PRESET_ALIASES: Record<string, { label: string; canonical: string }> = {
  peanuts: { label: 'Peanuts', canonical: 'peanuts' },
  peanut: { label: 'Peanuts', canonical: 'peanuts' },
  groundnut: { label: 'Peanuts', canonical: 'peanuts' },
  groundnuts: { label: 'Peanuts', canonical: 'peanuts' },

  'tree nuts': { label: 'Tree Nuts', canonical: 'tree nuts' },
  'tree nut': { label: 'Tree Nuts', canonical: 'tree nuts' },
  treenuts: { label: 'Tree Nuts', canonical: 'tree nuts' },
  nuts: { label: 'Tree Nuts', canonical: 'tree nuts' },

  dairy: { label: 'Dairy', canonical: 'dairy' },
  milk: { label: 'Dairy', canonical: 'dairy' },
  lactose: { label: 'Dairy', canonical: 'dairy' },

  eggs: { label: 'Eggs', canonical: 'eggs' },
  egg: { label: 'Eggs', canonical: 'eggs' },
  anda: { label: 'Eggs', canonical: 'eggs' },

  'gluten / wheat': { label: 'Gluten / Wheat', canonical: 'gluten / wheat' },
  'wheat / gluten': { label: 'Gluten / Wheat', canonical: 'gluten / wheat' },
  gluten: { label: 'Gluten / Wheat', canonical: 'gluten / wheat' },
  wheat: { label: 'Gluten / Wheat', canonical: 'gluten / wheat' },

  soy: { label: 'Soy', canonical: 'soy' },
  soya: { label: 'Soy', canonical: 'soy' },

  fish: { label: 'Fish', canonical: 'fish' },

  shellfish: { label: 'Shellfish', canonical: 'shellfish' },

  sesame: { label: 'Sesame', canonical: 'sesame' },
};

/**
 * Takes any raw input string (e.g. "  chicken ", " CHICKEN ", "egg", "Gluten / Wheat")
 * and normalizes it to a canonical representation and display label.
 */
export function normalizeSingleAllergy(rawInput: string): AllergyNormalizationResult | null {
  if (!rawInput) return null;
  const clean = rawInput.trim().replace(/\s+/g, ' ');
  if (!clean) return null;

  const lower = clean.toLowerCase();

  // Check preset alias dictionary
  if (PRESET_ALIASES[lower]) {
    return {
      label: PRESET_ALIASES[lower].label,
      canonical: PRESET_ALIASES[lower].canonical,
      isPreset: true,
    };
  }

  // Check if it matches any preset option canonical directly
  const presetMatch = PRESET_ALLERGY_OPTIONS.find(
    (p) => p.canonical === lower || p.label.toLowerCase() === lower
  );
  if (presetMatch) {
    return {
      label: presetMatch.label,
      canonical: presetMatch.canonical,
      isPreset: true,
    };
  }

  // Otherwise, it's a custom allergy
  return {
    label: toTitleCase(clean),
    canonical: lower,
    isPreset: false,
  };
}

/**
 * Normalizes an array of raw allergy strings into a clean array of display labels with unique canonicals.
 */
export function normalizeAllergyList(rawAllergies: string[]): string[] {
  if (!Array.isArray(rawAllergies)) return [];

  const seenCanonicals = new Set<string>();
  const normalizedLabels: string[] = [];

  for (const raw of rawAllergies) {
    const norm = normalizeSingleAllergy(raw);
    if (norm && !seenCanonicals.has(norm.canonical)) {
      seenCanonicals.add(norm.canonical);
      normalizedLabels.push(norm.label);
    }
  }

  return normalizedLabels;
}

/**
 * Combines preset options and current user active allergies into a unified list of chips for UI rendering.
 */
export function getUnifiedAllergyList(activeAllergies: string[]): {
  items: UnifiedAllergyItem[];
  activeCount: number;
} {
  const normalizedActive = normalizeAllergyList(activeAllergies || []);
  const activeCanonicalSet = new Set<string>();

  for (const itemStr of normalizedActive) {
    const norm = normalizeSingleAllergy(itemStr);
    if (norm) {
      activeCanonicalSet.add(norm.canonical);
    }
  }

  // Build predefined chips
  const presetItems: UnifiedAllergyItem[] = PRESET_ALLERGY_OPTIONS.map((p) => ({
    id: `preset-${p.canonical}`,
    label: p.label,
    canonical: p.canonical,
    type: 'preset',
    isActive: activeCanonicalSet.has(p.canonical),
  }));

  // Build custom chips (for any active allergy that is not a preset)
  const customItems: UnifiedAllergyItem[] = [];
  for (const itemStr of normalizedActive) {
    const norm = normalizeSingleAllergy(itemStr);
    if (norm && !norm.isPreset) {
      customItems.push({
        id: `custom-${norm.canonical}`,
        label: norm.label,
        canonical: norm.canonical,
        type: 'custom',
        isActive: true,
      });
    }
  }

  const items = [...presetItems, ...customItems];
  const activeCount = activeCanonicalSet.size;

  return { items, activeCount };
}
