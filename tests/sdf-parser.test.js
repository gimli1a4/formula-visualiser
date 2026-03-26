import { parseSDF } from '../js/sdf-parser.js';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/**
 * Minimal V2000 MOL block for water (H₂O).
 * Matches the exact column layout specified by the V2000 standard.
 *
 * Line 0  : name
 * Line 1  : program/date info
 * Line 2  : comment
 * Line 3  : counts line  (3 atoms, 2 bonds)
 * Lines 4-6: atom block
 * Lines 7-8: bond block
 * Line 9  : M  END
 */
const WATER_SDF = `water
  -OEChem-

  3  2  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.9572    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.2396    0.9267    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
M  END
`;

/**
 * Water SDF embedded in a larger SDF record (with $$$$ separator).
 * Only the first record should be parsed.
 */
const WATER_SDF_WITH_SEPARATOR = WATER_SDF + `$$$$
methane
  -OEChem-

  5  4  0  0  0  0  0  0  0  0999 V2000
    0.0000    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.6300    0.6300    0.6300 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6300   -0.6300    0.6300 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6300    0.6300   -0.6300 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.6300   -0.6300   -0.6300 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  3  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
M  END
$$$$
`;

/**
 * Ethanol (C2H5OH) — slightly more complex, tests multi-element parsing.
 */
const ETHANOL_SDF = `ethanol
  -OEChem-

  9  8  0  0  0  0  0  0  0  0999 V2000
    1.2124   -0.0224    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.7424   -0.0224    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.1724    1.3976    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.7824    1.3976    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.7824   -1.4424    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.7824   -0.0224    1.4200 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.1724   -1.4424    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.1724   -0.0224    1.4200 H   0  0  0  0  0  0  0  0  0  0  0  0
    4.1324    1.3976    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  1  0  0  0  0
  1  4  1  0  0  0  0
  1  5  1  0  0  0  0
  1  6  1  0  0  0  0
  2  7  1  0  0  0  0
  2  8  1  0  0  0  0
  3  9  1  0  0  0  0
M  END
`;

// ---------------------------------------------------------------------------
// Tests: water molecule (core functionality)
// ---------------------------------------------------------------------------

describe('parseSDF — water molecule', () => {
  let result;

  beforeEach(() => {
    result = parseSDF(WATER_SDF);
  });

  test('parses the molecule name correctly', () => {
    expect(result.name).toBe('water');
  });

  test('parses atom count correctly (3 atoms)', () => {
    expect(result.atoms).toHaveLength(3);
  });

  test('parses element symbols correctly (O, H, H in order)', () => {
    expect(result.atoms[0].element).toBe('O');
    expect(result.atoms[1].element).toBe('H');
    expect(result.atoms[2].element).toBe('H');
  });

  test('parses first atom x coordinate to ~0', () => {
    expect(result.atoms[0].x).toBeCloseTo(0.0, 4);
  });

  test('parses first atom y coordinate to ~0', () => {
    expect(result.atoms[0].y).toBeCloseTo(0.0, 4);
  });

  test('parses first atom z coordinate to ~0', () => {
    expect(result.atoms[0].z).toBeCloseTo(0.0, 4);
  });

  test('parses second atom x coordinate to ~0.9572', () => {
    expect(result.atoms[1].x).toBeCloseTo(0.9572, 4);
  });

  test('parses third atom x coordinate to ~-0.2396', () => {
    expect(result.atoms[2].x).toBeCloseTo(-0.2396, 4);
  });

  test('parses third atom y coordinate to ~0.9267', () => {
    expect(result.atoms[2].y).toBeCloseTo(0.9267, 4);
  });

  test('parses bond count correctly (2 bonds)', () => {
    expect(result.bonds).toHaveLength(2);
  });

  test('bond indices are 0-based', () => {
    // In the SDF the first bond is "1 2 1" (1-based) → from:0, to:1 (0-based)
    expect(result.bonds[0].from).toBe(0);
    expect(result.bonds[0].to).toBe(1);
  });

  test('second bond indices are 0-based', () => {
    // "1 3 1" → from:0, to:2
    expect(result.bonds[1].from).toBe(0);
    expect(result.bonds[1].to).toBe(2);
  });

  test('bond order is parsed correctly (single bond = 1)', () => {
    expect(result.bonds[0].order).toBe(1);
    expect(result.bonds[1].order).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Tests: SDF with $$$$ record separator
// ---------------------------------------------------------------------------

describe('parseSDF — multiple SDF records', () => {
  test('only parses the first record when $$$$ separator is present', () => {
    const result = parseSDF(WATER_SDF_WITH_SEPARATOR);
    expect(result.name).toBe('water');
    expect(result.atoms).toHaveLength(3);
    expect(result.bonds).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// Tests: ethanol (more atoms and bonds)
// ---------------------------------------------------------------------------

describe('parseSDF — ethanol molecule', () => {
  let result;

  beforeEach(() => {
    result = parseSDF(ETHANOL_SDF);
  });

  test('parses ethanol name', () => {
    expect(result.name).toBe('ethanol');
  });

  test('parses 9 atoms', () => {
    expect(result.atoms).toHaveLength(9);
  });

  test('first atom is carbon', () => {
    expect(result.atoms[0].element).toBe('C');
  });

  test('third atom is oxygen', () => {
    expect(result.atoms[2].element).toBe('O');
  });

  test('parses 8 bonds', () => {
    expect(result.bonds).toHaveLength(8);
  });

  test('all bond indices are within valid range (0-based, 0 to 8)', () => {
    for (const bond of result.bonds) {
      expect(bond.from).toBeGreaterThanOrEqual(0);
      expect(bond.from).toBeLessThan(9);
      expect(bond.to).toBeGreaterThanOrEqual(0);
      expect(bond.to).toBeLessThan(9);
    }
  });
});

// ---------------------------------------------------------------------------
// Tests: error handling / edge cases
// ---------------------------------------------------------------------------

describe('parseSDF — invalid input', () => {
  test('returns empty result for null input', () => {
    const result = parseSDF(null);
    expect(result).toEqual({ name: '', atoms: [], bonds: [] });
  });

  test('returns empty result for undefined input', () => {
    const result = parseSDF(undefined);
    expect(result).toEqual({ name: '', atoms: [], bonds: [] });
  });

  test('returns empty result for empty string', () => {
    const result = parseSDF('');
    expect(result).toEqual({ name: '', atoms: [], bonds: [] });
  });

  test('returns empty result for a string with fewer than 4 lines', () => {
    const result = parseSDF('water\n  -OEChem-\n');
    expect(result).toEqual({ name: '', atoms: [], bonds: [] });
  });

  test('returns empty result for garbled counts line', () => {
    const garbled = `water
  -OEChem-

not a valid counts line
`;
    const result = parseSDF(garbled);
    expect(result).toEqual({ name: '', atoms: [], bonds: [] });
  });

  test('returns empty result for non-string input (number)', () => {
    const result = parseSDF(42);
    expect(result).toEqual({ name: '', atoms: [], bonds: [] });
  });

  test('returns empty result for non-string input (object)', () => {
    const result = parseSDF({});
    expect(result).toEqual({ name: '', atoms: [], bonds: [] });
  });
});

// ---------------------------------------------------------------------------
// Tests: CRLF line endings
// ---------------------------------------------------------------------------

describe('parseSDF — CRLF line endings', () => {
  test('correctly parses SDF with Windows-style CRLF line endings', () => {
    const crlfSdf = WATER_SDF.replace(/\n/g, '\r\n');
    const result = parseSDF(crlfSdf);
    expect(result.name).toBe('water');
    expect(result.atoms).toHaveLength(3);
    expect(result.bonds).toHaveLength(2);
    expect(result.atoms[0].element).toBe('O');
  });
});
