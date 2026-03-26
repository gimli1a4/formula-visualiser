import { parseFormula, formulaToUnicode, formulaToHTML } from '../js/formula.js';

// ---------------------------------------------------------------------------
// parseFormula
// ---------------------------------------------------------------------------

describe('parseFormula', () => {
  test('parses simple formula H2O', () => {
    expect(parseFormula('H2O')).toEqual([
      { symbol: 'H', count: 2 },
      { symbol: 'O', count: 1 },
    ]);
  });

  test('parses C6H12O6 (glucose)', () => {
    expect(parseFormula('C6H12O6')).toEqual([
      { symbol: 'C', count: 6 },
      { symbol: 'H', count: 12 },
      { symbol: 'O', count: 6 },
    ]);
  });

  test('parses single element C', () => {
    expect(parseFormula('C')).toEqual([{ symbol: 'C', count: 1 }]);
  });

  test('parses two-char element Ca', () => {
    expect(parseFormula('Ca')).toEqual([{ symbol: 'Ca', count: 1 }]);
  });

  test('parses formula with parentheses Ca(OH)2', () => {
    expect(parseFormula('Ca(OH)2')).toEqual([
      { symbol: 'Ca', count: 1 },
      { symbol: 'O', count: 2 },
      { symbol: 'H', count: 2 },
    ]);
  });

  test('handles caffeine C8H10N4O2', () => {
    expect(parseFormula('C8H10N4O2')).toEqual([
      { symbol: 'C', count: 8 },
      { symbol: 'H', count: 10 },
      { symbol: 'N', count: 4 },
      { symbol: 'O', count: 2 },
    ]);
  });

  test('returns empty array for empty string', () => {
    expect(parseFormula('')).toEqual([]);
  });

  test('returns empty array for null', () => {
    expect(parseFormula(null)).toEqual([]);
  });

  test('returns empty array for undefined', () => {
    expect(parseFormula(undefined)).toEqual([]);
  });

  test('handles NaCl', () => {
    expect(parseFormula('NaCl')).toEqual([
      { symbol: 'Na', count: 1 },
      { symbol: 'Cl', count: 1 },
    ]);
  });

  test('handles ethanol C2H5OH', () => {
    // C2H5OH → C:2, H:5+1=6, O:1  — note H appears in two places
    expect(parseFormula('C2H5OH')).toEqual([
      { symbol: 'C', count: 2 },
      { symbol: 'H', count: 6 },
      { symbol: 'O', count: 1 },
    ]);
  });

  test('handles multiple parenthesised groups Al2(SO4)3', () => {
    // Al2(SO4)3 → Al:2, S:3, O:12
    expect(parseFormula('Al2(SO4)3')).toEqual([
      { symbol: 'Al', count: 2 },
      { symbol: 'S', count: 3 },
      { symbol: 'O', count: 12 },
    ]);
  });

  test('handles parentheses with no subscript (NH4)Cl', () => {
    // (NH4)Cl → N:1, H:4, Cl:1
    expect(parseFormula('(NH4)Cl')).toEqual([
      { symbol: 'N', count: 1 },
      { symbol: 'H', count: 4 },
      { symbol: 'Cl', count: 1 },
    ]);
  });

  test('count of 1 for element with no explicit number', () => {
    expect(parseFormula('H2O')).toContainEqual({ symbol: 'O', count: 1 });
  });
});

// ---------------------------------------------------------------------------
// formulaToUnicode
// ---------------------------------------------------------------------------

describe('formulaToUnicode', () => {
  test('converts H2O to H₂O', () => {
    expect(formulaToUnicode('H2O')).toBe('H₂O');
  });

  test('converts C6H12O6 to C₆H₁₂O₆', () => {
    expect(formulaToUnicode('C6H12O6')).toBe('C₆H₁₂O₆');
  });

  test('converts C8H10N4O2 to C₈H₁₀N₄O₂', () => {
    expect(formulaToUnicode('C8H10N4O2')).toBe('C₈H₁₀N₄O₂');
  });

  test('handles formula with no numbers', () => {
    expect(formulaToUnicode('NaCl')).toBe('NaCl');
  });

  test('converts parenthesised subscript Ca(OH)2 to Ca(OH)₂', () => {
    expect(formulaToUnicode('Ca(OH)2')).toBe('Ca(OH)₂');
  });

  test('returns empty string for null input', () => {
    expect(formulaToUnicode(null)).toBe('');
  });

  test('returns empty string for empty string input', () => {
    expect(formulaToUnicode('')).toBe('');
  });

  test('converts all digits 0-9 correctly', () => {
    // Construct "X1234567890" → "X₁₂₃₄₅₆₇₈₉₀"
    expect(formulaToUnicode('X1234567890')).toBe('X₁₂₃₄₅₆₇₈₉₀');
  });
});

// ---------------------------------------------------------------------------
// formulaToHTML
// ---------------------------------------------------------------------------

describe('formulaToHTML', () => {
  test('wraps single-digit number in sub tag for H2O', () => {
    expect(formulaToHTML('H2O')).toBe('H<sub>2</sub>O');
  });

  test('wraps multi-digit number in a single sub tag', () => {
    expect(formulaToHTML('C6H12O6')).toBe('C<sub>6</sub>H<sub>12</sub>O<sub>6</sub>');
  });

  test('handles formula with no numbers (no sub tags added)', () => {
    expect(formulaToHTML('NaCl')).toBe('NaCl');
  });

  test('handles parenthesised subscript Ca(OH)2', () => {
    expect(formulaToHTML('Ca(OH)2')).toBe('Ca(OH)<sub>2</sub>');
  });

  test('handles caffeine C8H10N4O2', () => {
    expect(formulaToHTML('C8H10N4O2')).toBe(
      'C<sub>8</sub>H<sub>10</sub>N<sub>4</sub>O<sub>2</sub>',
    );
  });

  test('returns empty string for null input', () => {
    expect(formulaToHTML(null)).toBe('');
  });

  test('returns empty string for empty string input', () => {
    expect(formulaToHTML('')).toBe('');
  });
});
