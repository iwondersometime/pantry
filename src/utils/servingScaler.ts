/**
 * Scales ingredient quantity strings accurately when servings count changes.
 * Examples:
 *  "2 cups" (2 servings -> 4 servings) => "4 cups"
 *  "1/2 tsp" (2 servings -> 4 servings) => "1 tsp"
 *  "250g" (2 servings -> 1 serving) => "125g"
 */
export function scaleIngredientAmount(
  originalAmount: string,
  defaultServings: number,
  newServings: number
): string {
  if (!originalAmount || defaultServings <= 0 || newServings <= 0 || defaultServings === newServings) {
    return originalAmount;
  }

  const factor = newServings / defaultServings;

  // Fraction map
  const fractionToDecimal = (str: string): number | null => {
    if (str.includes('/')) {
      const parts = str.trim().split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) {
          return num / den;
        }
      }
    }
    return null;
  };

  // Convert decimal to nice fraction if appropriate
  const decimalToFractionStr = (val: number): string => {
    const whole = Math.floor(val);
    const remainder = val - whole;

    if (Math.abs(remainder) < 0.05) {
      return whole > 0 ? `${whole}` : '0';
    }

    const fractions = [
      { val: 0.25, str: '1/4' },
      { val: 0.33, str: '1/3' },
      { val: 0.5, str: '1/2' },
      { val: 0.66, str: '2/3' },
      { val: 0.75, str: '3/4' },
    ];

    for (const f of fractions) {
      if (Math.abs(remainder - f.val) < 0.08) {
        return whole > 0 ? `${whole} ${f.str}` : f.str;
      }
    }

    // Otherwise round cleanly to 1 decimal place or integer
    return val % 1 === 0 ? `${val}` : `${parseFloat(val.toFixed(1))}`;
  };

  // Match mixed fractions like "1 1/2" or simple fraction "1/2" or number "2"
  return originalAmount.replace(/(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)/g, (match) => {
    let numericValue = 0;

    if (match.includes(' ') && match.includes('/')) {
      const [wholeStr, fracStr] = match.split(/\s+/);
      const w = parseFloat(wholeStr);
      const f = fractionToDecimal(fracStr) || 0;
      numericValue = w + f;
    } else if (match.includes('/')) {
      numericValue = fractionToDecimal(match) || 0;
    } else {
      numericValue = parseFloat(match);
    }

    if (isNaN(numericValue) || numericValue <= 0) return match;

    const scaled = numericValue * factor;
    return decimalToFractionStr(scaled);
  });
}
