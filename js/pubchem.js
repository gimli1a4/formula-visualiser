/**
 * pubchem.js — PubChem REST API wrapper.
 *
 * Fetches compound 3D (or 2D fallback) structure data from PubChem and returns
 * parsed atom/bond data together with compound metadata.
 */

import { parseSDF } from './sdf-parser.js';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

/**
 * Perform a fetch and return the response, throwing a descriptive error on
 * non-2xx responses other than 404 (which is returned so callers can branch).
 *
 * @param {string} url
 * @returns {Promise<Response>}
 */
async function apiFetch(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (networkErr) {
    throw new Error(`Network error fetching ${url}: ${networkErr.message}`);
  }
  if (!response.ok && response.status !== 404) {
    throw new Error(`PubChem API error ${response.status} for ${url}`);
  }
  return response;
}

/**
 * Extract the PubChem CID from an SDF text block.
 * Looks for the data tag  "> <PUBCHEM_COMPOUND_CID>"  and reads the next line.
 *
 * @param {string} sdfText
 * @returns {number|null}
 */
function extractCidFromSdf(sdfText) {
  if (!sdfText) return null;
  const lines = sdfText.split(/\r?\n/);
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('PUBCHEM_COMPOUND_CID')) {
      const cid = parseInt(lines[i + 1].trim(), 10);
      if (Number.isFinite(cid) && cid > 0) return cid;
    }
  }
  return null;
}

/**
 * Fetch SDF for a known CID, trying 3D first then falling back to 2D.
 *
 * @param {number} cid
 * @returns {Promise<string>} SDF text
 */
async function fetchSdfByCid(cid) {
  const url3d = `${BASE}/compound/cid/${cid}/SDF?record_type=3d`;
  const res3d = await apiFetch(url3d);
  if (res3d.ok) return res3d.text();

  // 3D not available — fall back to 2D
  const url2d = `${BASE}/compound/cid/${cid}/SDF`;
  const res2d = await apiFetch(url2d);
  if (res2d.ok) return res2d.text();

  throw new Error(`No SDF data available for CID ${cid}`);
}

/**
 * Fetch compound properties (formula, IUPAC name, molecular weight) for a CID.
 *
 * @param {number} cid
 * @returns {Promise<{ iupacName: string, formula: string, molecularWeight: number }>}
 */
async function fetchProperties(cid) {
  const url = `${BASE}/compound/cid/${cid}/property/MolecularFormula,IUPACName,MolecularWeight/JSON`;
  const res = await apiFetch(url);
  if (!res.ok) {
    // Non-critical — return empty values rather than failing the whole call
    return { iupacName: '', formula: '', molecularWeight: 0 };
  }
  const json = await res.json();
  const props = json?.PropertyTable?.Properties?.[0] ?? {};
  return {
    iupacName: props.IUPACName ?? '',
    formula: props.MolecularFormula ?? '',
    molecularWeight: props.MolecularWeight ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch a compound from PubChem by name or molecular formula.
 *
 * Strategy:
 *  1. Try name lookup with 3D SDF directly.
 *  2. If 404, try formula lookup to get a CID, then fetch 3D SDF by CID.
 *  3. If 3D SDF is unavailable for the CID, fall back to 2D SDF.
 *  4. Fetch compound properties (formula, IUPAC name, MW) by CID.
 *
 * @param {string} query - Compound name (e.g. "water") or formula (e.g. "H2O")
 * @returns {Promise<{
 *   iupacName: string,
 *   formula: string,
 *   molecularWeight: number,
 *   cid: number,
 *   sdfText: string,
 *   parsed: { name: string, atoms: Array, bonds: Array }
 * }>}
 * @throws {Error} If the compound cannot be found or the network fails.
 */
export async function fetchCompound(query) {
  if (!query || !query.trim()) {
    throw new Error('Query must be a non-empty string.');
  }

  const encoded = encodeURIComponent(query.trim());
  let sdfText = null;
  let cid = null;

  // --- Step 1: name lookup with 3D ---
  const nameUrl3d = `${BASE}/compound/name/${encoded}/SDF?record_type=3d`;
  const nameRes3d = await apiFetch(nameUrl3d);

  if (nameRes3d.ok) {
    sdfText = await nameRes3d.text();
    cid = extractCidFromSdf(sdfText);
  }

  // --- Step 2: formula / CID lookup (if name 3D lookup failed) ---
  if (!sdfText) {
    const formulaUrl = `${BASE}/compound/formula/${encoded}/cids/JSON?MaxRecords=1`;
    const formulaRes = await apiFetch(formulaUrl);

    if (formulaRes.ok) {
      const json = await formulaRes.json();
      const cids = json?.IdentifierList?.CID;
      if (Array.isArray(cids) && cids.length > 0) {
        cid = cids[0];
      }
    }

    if (!cid) {
      // Also try a plain name lookup without 3D (to get any SDF and a CID from it)
      const nameUrl2d = `${BASE}/compound/name/${encoded}/SDF`;
      const nameRes2d = await apiFetch(nameUrl2d);
      if (nameRes2d.ok) {
        sdfText = await nameRes2d.text();
        cid = extractCidFromSdf(sdfText);
      }
    }

    if (!cid) {
      throw new Error(`Compound not found: "${query}". No matching records on PubChem.`);
    }

    // Fetch SDF (3D preferred, 2D fallback) using the resolved CID
    sdfText = await fetchSdfByCid(cid);
  }

  // If we have a CID from the SDF but not yet from formula lookup, it's already set above.
  // If we still don't have a CID, try extracting again from the final SDF.
  if (!cid) {
    cid = extractCidFromSdf(sdfText);
  }

  if (!cid) {
    throw new Error(`Could not determine PubChem CID for "${query}".`);
  }

  // --- Step 3: fetch compound properties ---
  const properties = await fetchProperties(cid);

  // --- Step 4: parse the SDF ---
  const parsed = parseSDF(sdfText);

  return {
    iupacName: properties.iupacName,
    formula: properties.formula,
    molecularWeight: properties.molecularWeight,
    cid,
    sdfText,
    parsed,
  };
}
