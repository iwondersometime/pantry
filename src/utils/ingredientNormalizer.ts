/**
 * Normalizes ingredient names to title case and handles common singular/plural matching.
 * e.g., "egg", "Egg", and "eggs" all match and normalize cleanly.
 */
export function normalizeIngredient(input: string): string {
  if (!input) return '';
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return '';

  // Capitalize title case
  const words = trimmed.split(/\s+/).map((w) => {
    return w.charAt(0).toUpperCase() + w.slice(1);
  });

  return words.join(' ');
}

/**
 * Checks if two ingredient names represent the same ingredient
 */
export function areIngredientsEqual(ing1: string, ing2: string): boolean {
  if (!ing1 || !ing2) return false;

  const getStem = (str: string) => {
    let clean = str.trim().toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
    // Common plural normalization
    if (clean.length > 3 && clean.endsWith('ies')) {
      clean = clean.slice(0, -3) + 'y';
    } else if (
      clean.length > 3 &&
      clean.endsWith('es') &&
      !clean.endsWith('cheese') &&
      !clean.endsWith('rice')
    ) {
      clean = clean.slice(0, -2);
    } else if (
      clean.length > 3 &&
      clean.endsWith('s') &&
      !clean.endsWith('ss') &&
      !clean.endsWith('rice') &&
      !clean.endsWith('hummus')
    ) {
      clean = clean.slice(0, -1);
    }
    return clean;
  };

  return getStem(ing1) === getStem(ing2);
}
