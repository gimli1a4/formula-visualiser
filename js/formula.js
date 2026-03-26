/**
 * formula.js — Pure formula parsing module. No imports.
 *
 * Implements Hill notation parsing for chemical formulas.
 * Hill notation: uppercase letter optionally followed by 1-2 lowercase letters,
 * then an optional integer count. Numbers directly following a symbol are the
 * subscript count for that element.
 */

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const SUBSCRIPT_MAP = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
};

/**
 * Tokenise a formula string (no outer parentheses handling) into
 * `{ symbol, count }` pairs and accumulate into `counts` map.
 *
 * @param {string} str       - flat formula string (no parentheses)
 * @param {number} multiplier - multiply all counts by this value
 * @param {Map<string,number>} counts - accumulator map symbol → total count
 */
function tokeniseFlat(str, multiplier, counts) {
  // Regex: element symbol = [A-Z][a-z]{0,2}, followed by optional integer
  const TOKEN_RE = /([A-Z][a-z]{0,2})(\d*)/g;
  let match;
  while ((match = TOKEN_RE.exec(str)) !== null) {
    const symbol = match[1];
    const count = match[2] === '' ? 1 : parseInt(match[2], 10);
    counts.set(symbol, (counts.get(symbol) ?? 0) + count * multiplier);
  }
}

/**
 * Parse a formula string into a Map<symbol, count>.
 * Handles single level of parentheses (e.g. `Ca(OH)2`).
 *
 * @param {string} formulaStr
 * @returns {Map<string,number>}
 */
function parseToMap(formulaStr) {
  const counts = new Map();

  // Walk the string character by character to handle parenthesised groups.
  // We support one level of nesting as required; deeply nested groups fall
  // through gracefully because we iterate left-to-right.
  const GROUP_RE = /\(([^()]*)\)(\d*)/g;
  let remaining = formulaStr;

  // Iteratively replace parenthesised groups until none remain.
  // This naturally handles multiple non-nested groups and simple nesting
  // via repeated reduction (each pass reduces one level).
  let safety = 0;
  while (GROUP_RE.test(remaining) && safety < 20) {
    safety++;
    remaining = remaining.replace(/\(([^()]*)\)(\d*)/g, (_match, inner, num) => {
      const factor = num === '' ? 1 : parseInt(num, 10);
      tokeniseFlat(inner, factor, counts);
      // Replace the group with empty string so outer tokenisation skips it
      return '';
    });
    GROUP_RE.lastIndex = 0;
  }

  // Parse whatever is left (atoms outside parentheses)
  tokeniseFlat(remaining, 1, counts);

  return counts;
}

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

/**
 * Parse a Hill-notation formula string and return the constituent elements
 * with their total counts, in the order they first appear in the string.
 *
 * @param {string|null|undefined} formulaStr
 * @returns {{ symbol: string, count: number }[]}
 *
 * @example
 * parseFormula('H2O')       // [{ symbol: 'H', count: 2 }, { symbol: 'O', count: 1 }]
 * parseFormula('Ca(OH)2')   // [{ symbol: 'Ca', count: 1 }, { symbol: 'O', count: 2 }, { symbol: 'H', count: 2 }]
 */
export function parseFormula(formulaStr) {
  if (!formulaStr || typeof formulaStr !== 'string') return [];
  const trimmed = formulaStr.trim();
  if (!trimmed) return [];

  // Build ordered symbol list by scanning left-to-right before expanding groups
  const orderMap = new Map(); // symbol → first-seen index
  const SYMBOL_RE = /[A-Z][a-z]{0,2}/g;
  // Strip group markers so we discover symbols in document order including
  // those inside parentheses.
  const stripped = trimmed.replace(/[()]/g, '');
  let m;
  let idx = 0;
  while ((m = SYMBOL_RE.exec(stripped)) !== null) {
    if (!orderMap.has(m[0])) {
      orderMap.set(m[0], idx++);
    }
  }

  const counts = parseToMap(trimmed);

  // Build result in first-seen order
  const result = [];
  // Sort entries by their first-seen position
  const sortedSymbols = [...counts.keys()].sort(
    (a, b) => (orderMap.get(a) ?? 999) - (orderMap.get(b) ?? 999),
  );
  for (const symbol of sortedSymbols) {
    result.push({ symbol, count: counts.get(symbol) });
  }

  return result;
}

/**
 * Convert a Hill-notation formula string to a Unicode subscript display string.
 *
 * @param {string} formulaStr
 * @returns {string}
 *
 * @example
 * formulaToUnicode('H2O')        // 'H₂O'
 * formulaToUnicode('Ca(OH)2')    // 'Ca(OH)₂'
 * formulaToUnicode('C8H10N4O2')  // 'C₈H₁₀N₄O₂'
 */
export function formulaToUnicode(formulaStr) {
  if (!formulaStr || typeof formulaStr !== 'string') return '';
  return formulaStr.replace(/\d+/g, (digits) =>
    digits.split('').map((d) => SUBSCRIPT_MAP[d] ?? d).join(''),
  );
}

/**
 * Convert a Hill-notation formula string to an HTML string with numbers
 * wrapped in `<sub>` tags.
 *
 * @param {string} formulaStr
 * @returns {string}
 *
 * @example
 * formulaToHTML('H2O')   // 'H<sub>2</sub>O'
 */
export function formulaToHTML(formulaStr) {
  if (!formulaStr || typeof formulaStr !== 'string') return '';
  return formulaStr.replace(/\d+/g, (digits) => `<sub>${digits}</sub>`);
}
