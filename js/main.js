/**
 * main.js — Entry point for Formula Visualiser.
 *
 * Wires together the renderer, UI, and PubChem data layer.
 * Handles URL query parameters (?q=) for bookmarkable molecule states,
 * popstate navigation, and all user interaction events.
 */

import { fetchCompound } from './pubchem.js';
import { MoleculeRenderer } from './renderer.js';
import {
  initSidebar,
  setActiveMolecule,
  showInspector,
  hideInspector,
  initThemeToggle,
  showLoading,
  showError,
  hideStatus,
  updateFormulaDisplay,
} from './ui.js';

// ---------------------------------------------------------------------------
// Bootstrap on DOM ready
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  // --- Create renderer ---
  const canvas = document.getElementById('canvas');
  const renderer = new MoleculeRenderer(canvas);

  // --- Theme toggle ---
  // Set background colour immediately when theme is applied so the canvas
  // matches the page before any molecule loads.
  initThemeToggle((theme) => {
    const bgColor = theme === 'dark' ? '#080a0f' : '#eef0f4';
    renderer.setBackground(bgColor);
  });

  // --- Sidebar ---
  initSidebar((query) => loadMolecule(query));

  // --- Inspector close button ---
  const inspectorClose = document.getElementById('inspector-close');
  if (inspectorClose) {
    inspectorClose.addEventListener('click', () => hideInspector());
  }

  // --- Atom click → show inspector ---
  renderer.onAtomClick((atomData) => {
    showInspector(atomData, (sym, hex) => {
      renderer.setElementColor(sym, hex);
    });
  });

  // --- Search input: Enter key ---
  const formulaInput = document.getElementById('formula-input');
  if (formulaInput) {
    formulaInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = formulaInput.value.trim();
        if (query) loadMolecule(query);
      }
    });
  }

  // --- Visualise button ---
  const loadBtn = document.getElementById('load-btn');
  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      const query = formulaInput ? formulaInput.value.trim() : '';
      if (query) loadMolecule(query);
    });
  }

  // --- Popstate (browser back/forward) ---
  window.addEventListener('popstate', () => {
    const q = getQueryParam('q');
    if (q) loadMolecule(q, /* pushState= */ false);
  });

  // --- Initial load from URL or default ---
  const initialQuery = getQueryParam('q') || 'caffeine';
  loadMolecule(initialQuery, /* pushState= */ false);

  // ---------------------------------------------------------------------------
  // loadMolecule
  // ---------------------------------------------------------------------------

  /**
   * Fetch and render a compound by name or formula string.
   *
   * @param {string} query        - compound name or formula
   * @param {boolean} [push=true] - whether to push a new history state
   */
  async function loadMolecule(query, push = true) {
    if (!query || !query.trim()) return;
    query = query.trim();

    // Update input field to reflect the active query
    if (formulaInput) formulaInput.value = query;

    hideInspector();
    showLoading();

    try {
      const data = await fetchCompound(query);

      renderer.load(data.parsed);
      updateFormulaDisplay(data);
      setActiveMolecule(query);
      hideStatus();

      // Update URL (avoid double-pushing the same query)
      if (push) {
        const currentQ = getQueryParam('q');
        if (currentQ !== query) {
          history.pushState({ q: query }, '', `?q=${encodeURIComponent(query)}`);
        }
      } else {
        // Replace state so popstate always reflects current URL
        history.replaceState({ q: query }, '', `?q=${encodeURIComponent(query)}`);
      }
    } catch (err) {
      console.error('[loadMolecule]', err);
      showError(
        `Could not find "${query}". Try a compound name (e.g. "caffeine") or formula (e.g. "C8H10N4O2").`,
      );
    }
  }
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Read a single URL query parameter by name.
 *
 * @param {string} name
 * @returns {string|null}
 */
function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(name);
  return value && value.trim() ? value.trim() : null;
}
