/**
 * sdf-parser.js — Pure SDF/MOL V2000 format parser. No imports.
 *
 * Parses the first MOL record from an SDF text string as returned by the
 * PubChem REST API.
 */

/**
 * Parse a V2000 MOL/SDF format string and return the first compound's
 * atom and bond data.
 *
 * V2000 MOL block structure:
 *   Line 0  : molecule name
 *   Line 1  : program / timestamp info   (ignored)
 *   Line 2  : comment line               (ignored)
 *   Line 3  : counts line
 *               cols  0- 2 : atom count (right-justified in 3-char field)
 *               cols  3- 5 : bond count
 *               …remaining fields not used here…
 *   Lines 4 … 4+atomCount-1 : atom block
 *               cols  0- 9 : x coordinate (10 chars)
 *               cols 10-19 : y coordinate (10 chars)
 *               cols 20-29 : z coordinate (10 chars)
 *               col  30    : space
 *               cols 31-33 : element symbol (3 chars, left-padded with spaces)
 *   Lines after atom block : bond block
 *               cols  0- 2 : atom1 index (1-based)
 *               cols  3- 5 : atom2 index (1-based)
 *               cols  6- 8 : bond type (1=single, 2=double, 3=triple)
 *
 * Multiple SDF records are separated by "$$$$" — only the first is parsed.
 *
 * @param {string} sdfText
 * @returns {{ name: string, atoms: Array<{x:number,y:number,z:number,element:string}>, bonds: Array<{from:number,to:number,order:number}> }}
 */
export function parseSDF(sdfText) {
  const EMPTY = { name: '', atoms: [], bonds: [] };

  if (!sdfText || typeof sdfText !== 'string') return EMPTY;

  try {
    // Take only the first SDF record (everything before the first "$$$$")
    const recordEnd = sdfText.indexOf('$$$$');
    const molBlock = recordEnd === -1 ? sdfText : sdfText.slice(0, recordEnd);

    // Split into lines, preserving empty lines so line indices stay correct.
    // Normalise Windows-style CRLF to LF first.
    const lines = molBlock.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

    if (lines.length < 4) return EMPTY;

    // Line 0: molecule name (trimmed)
    const name = lines[0].trim();

    // Line 3: counts line
    const countsLine = lines[3];
    if (!countsLine) return EMPTY;

    const atomCount = parseInt(countsLine.substring(0, 3).trim(), 10);
    const bondCount = parseInt(countsLine.substring(3, 6).trim(), 10);

    if (!Number.isFinite(atomCount) || !Number.isFinite(bondCount)) return EMPTY;
    if (atomCount < 0 || bondCount < 0) return EMPTY;

    // Atom block starts at line 4
    const atomStart = 4;
    const atomEnd = atomStart + atomCount;

    if (lines.length < atomEnd) return EMPTY;

    const atoms = [];
    for (let i = atomStart; i < atomEnd; i++) {
      const line = lines[i];
      if (line === undefined) return EMPTY;

      // Coordinates: three 10-character fixed-width fields
      const x = parseFloat(line.substring(0, 10));
      const y = parseFloat(line.substring(10, 20));
      const z = parseFloat(line.substring(20, 30));

      // Element symbol: characters 31-33 (3-char field, may have leading spaces)
      // Some writers put the symbol starting at col 31; others may vary slightly.
      const element = line.substring(31, 34).trim();

      if (!element) return EMPTY;

      atoms.push({ x, y, z, element });
    }

    // Bond block immediately follows the atom block
    const bondStart = atomEnd;
    const bondEnd = bondStart + bondCount;

    const bonds = [];
    for (let i = bondStart; i < bondEnd; i++) {
      const line = lines[i];
      if (!line) break; // bond block may end before M END

      const atom1 = parseInt(line.substring(0, 3).trim(), 10);
      const atom2 = parseInt(line.substring(3, 6).trim(), 10);
      const order = parseInt(line.substring(6, 9).trim(), 10);

      if (!Number.isFinite(atom1) || !Number.isFinite(atom2)) break;

      // Convert from 1-based (MOL format) to 0-based
      bonds.push({ from: atom1 - 1, to: atom2 - 1, order: Number.isFinite(order) ? order : 1 });
    }

    return { name, atoms, bonds };
  } catch (_err) {
    return { name: '', atoms: [], bonds: [] };
  }
}
