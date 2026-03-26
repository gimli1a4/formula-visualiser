/**
 * ui.js — DOM manipulation module for Formula Visualiser.
 *
 * Handles sidebar population, atom inspector panel, theme toggling,
 * loading/error states, and formula display updates.
 */

import { getElement, NOBLE_GAS_SYMBOLS } from './elements.js';
import { formulaToUnicode } from './formula.js';

// ---------------------------------------------------------------------------
// Preset molecules
// ---------------------------------------------------------------------------

export const PRESET_MOLECULES = [
  { name: 'Water',                query: 'water',               formula: 'H₂O' },
  { name: 'Caffeine',             query: 'caffeine',            formula: 'C₈H₁₀N₄O₂' },
  { name: 'Ethanol',              query: 'ethanol',             formula: 'C₂H₆O' },
  { name: 'Aspirin',              query: 'aspirin',             formula: 'C₉H₈O₄' },
  { name: 'Glucose',              query: 'glucose',             formula: 'C₆H₁₂O₆' },
  { name: 'THC',                  query: 'THC',                 formula: 'C₂₁H₃₀O₂' },
  { name: 'Cholesterol',          query: 'cholesterol',         formula: 'C₂₇H₄₆O' },
  { name: 'Jet Fuel (dodecane)',  query: 'dodecane',            formula: 'C₁₂H₂₆' },
  { name: 'Penicillin G',        query: 'penicillin G',        formula: 'C₁₆H₁₈N₂O₄S' },
  { name: 'Capsaicin',           query: 'capsaicin',           formula: 'C₁₈H₂₇NO₃' },
  { name: 'Serotonin',           query: 'serotonin',           formula: 'C₁₀H₁₂N₂O' },
  { name: 'Buckminsterfullerene', query: 'buckminsterfullerene',formula: 'C₆₀' },
  { name: 'Adenine (DNA base)',  query: 'adenine',             formula: 'C₅H₅N₅' },
  { name: 'Vanillin',            query: 'vanillin',            formula: 'C₈H₈O₃' },
];

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

/**
 * Populate the #molecule-list sidebar with preset molecule buttons and wire
 * up the sidebar collapse toggle.
 *
 * @param {function} onLoadFn - called with (query: string) when a molecule is selected
 */
export function initSidebar(onLoadFn) {
  const list = document.getElementById('molecule-list');
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');

  if (list) {
    for (const mol of PRESET_MOLECULES) {
      const btn = document.createElement('button');
      btn.className = 'mol-item';
      btn.dataset.query = mol.query;
      btn.type = 'button';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'mol-name';
      nameSpan.textContent = mol.name;

      const formulaSpan = document.createElement('span');
      formulaSpan.className = 'mol-formula';
      formulaSpan.textContent = mol.formula;

      btn.appendChild(nameSpan);
      btn.appendChild(formulaSpan);

      btn.addEventListener('click', () => onLoadFn(mol.query));
      list.appendChild(btn);
    }
  }

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      // Update aria-label and toggle icon direction
      const isCollapsed = sidebar.classList.contains('collapsed');
      toggle.setAttribute('aria-label', isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
      toggle.textContent = isCollapsed ? '›' : '‹';
    });
  }
}

/**
 * Set the .active class on the sidebar item whose data-query matches.
 *
 * @param {string} query
 */
export function setActiveMolecule(query) {
  const buttons = document.querySelectorAll('#molecule-list .mol-item');
  for (const btn of buttons) {
    btn.classList.toggle('active', btn.dataset.query === query);
  }
}

// ---------------------------------------------------------------------------
// Atom inspector
// ---------------------------------------------------------------------------

/**
 * Show the atom inspector panel populated with data for a clicked atom.
 *
 * @param {{ symbol: string, element: object, position: {x,y,z} }} atomData
 * @param {function} onColorChange - called with (symbol, hexColor) on color input change
 */
export function showInspector(atomData, onColorChange) {
  const inspector = document.getElementById('inspector');
  const content = document.getElementById('inspector-content');
  if (!inspector || !content) return;

  const { symbol, element, position } = atomData;

  // Resolve current color (localStorage override or CPK default)
  const storedColor = localStorage.getItem(`cpk_${symbol}`);
  const currentColor = storedColor ?? element.cpk ?? '#ff69b4';

  const isNobleGas = NOBLE_GAS_SYMBOLS.has(symbol);

  // Format group display
  const groupDisplay = element.group != null ? element.group : '—';
  const massDisplay = element.mass != null
    ? `${Number(element.mass).toFixed(3)} u`
    : '—';

  // Noble gas badge HTML
  const nobleBadgeHTML = isNobleGas
    ? `<div class="noble-badge">Noble Gas — displayed as cube</div>`
    : '';

  content.innerHTML = `
    <div class="element-hero">
      <div class="element-symbol-large" style="color: ${currentColor};">${symbol}</div>
      <div>
        <div class="element-name">${element.name ?? symbol}</div>
        <div class="element-subtitle">Z = ${element.atomicNumber ?? '—'}</div>
      </div>
    </div>
    <hr class="inspector-divider">
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">Atomic Number</span>
        <span class="stat-value">${element.atomicNumber ?? '—'}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Atomic Mass</span>
        <span class="stat-value">${massDisplay}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Period</span>
        <span class="stat-value">${element.period ?? '—'}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Group</span>
        <span class="stat-value">${groupDisplay}</span>
      </div>
    </div>
    ${nobleBadgeHTML}
    <div class="color-row">
      <label for="atom-color-input">CPK Color</label>
      <input
        type="color"
        id="atom-color-input"
        value="${_toInputHex(currentColor)}"
        title="Override CPK color for ${symbol}"
      >
      <span class="color-symbol-label">(${symbol})</span>
    </div>
    <div class="position-row">
      <span class="pos-label">Position:</span>
      x&thinsp;${position.x.toFixed(2)}&ensp;
      y&thinsp;${position.y.toFixed(2)}&ensp;
      z&thinsp;${position.z.toFixed(2)}&ensp;Å
    </div>
  `;

  // Wire up color input
  const colorInput = content.querySelector('#atom-color-input');
  if (colorInput) {
    colorInput.addEventListener('input', (e) => {
      const hex = e.target.value;
      // Update the symbol display color live
      const symbolEl = content.querySelector('.element-symbol-large');
      if (symbolEl) symbolEl.style.color = hex;
      if (typeof onColorChange === 'function') {
        onColorChange(symbol, hex);
      }
    });
  }

  inspector.classList.remove('hidden');
}

/**
 * Ensure a color string is a valid 7-char hex for <input type="color">.
 * Falls back to #808080 if parsing fails.
 *
 * @param {string} colorStr
 * @returns {string}
 */
function _toInputHex(colorStr) {
  if (!colorStr) return '#808080';
  // Already a 7-char hex
  if (/^#[0-9a-fA-F]{6}$/.test(colorStr)) return colorStr.toLowerCase();
  // 3-char shorthand → expand
  if (/^#[0-9a-fA-F]{3}$/.test(colorStr)) {
    const r = colorStr[1], g = colorStr[2], b = colorStr[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  // Try parsing via canvas context (handles named colors etc.)
  try {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = colorStr;
    const computed = ctx.fillStyle;
    if (/^#[0-9a-fA-F]{6}$/.test(computed)) return computed;
  } catch (_) { /* ignore */ }
  return '#808080';
}

/**
 * Hide the atom inspector panel.
 */
export function hideInspector() {
  const inspector = document.getElementById('inspector');
  if (inspector) inspector.classList.add('hidden');
}

// ---------------------------------------------------------------------------
// Theme toggle
// ---------------------------------------------------------------------------

/**
 * Initialise the theme toggle button, applying the persisted (or system
 * default) theme immediately.
 *
 * @param {function} onThemeChange - called with ('dark' | 'light') on change and at init
 */
export function initThemeToggle(onThemeChange) {
  const root = document.documentElement;
  const btn = document.getElementById('theme-toggle');

  // Determine initial theme
  const stored = localStorage.getItem('theme');
  let theme;
  if (stored === 'dark' || stored === 'light') {
    theme = stored;
  } else {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Apply immediately
  root.dataset.theme = theme;
  if (typeof onThemeChange === 'function') onThemeChange(theme);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.dataset.theme;
      const next = current === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem('theme', next);
      if (typeof onThemeChange === 'function') onThemeChange(next);
    });
  }
}

// ---------------------------------------------------------------------------
// Loading / error status
// ---------------------------------------------------------------------------

/**
 * Show the loading spinner overlay and hide any error overlay.
 */
export function showLoading() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  if (loading) loading.classList.remove('hidden');
  if (error) error.classList.add('hidden');
}

/**
 * Show an error message overlay and hide the loading overlay.
 *
 * @param {string} message
 */
export function showError(message) {
  const error = document.getElementById('error');
  const loading = document.getElementById('loading');
  if (error) {
    error.textContent = message;
    error.classList.remove('hidden');
  }
  if (loading) loading.classList.add('hidden');
}

/**
 * Hide both loading and error overlays.
 */
export function hideStatus() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error');
  if (loading) loading.classList.add('hidden');
  if (error) error.classList.add('hidden');
}

// ---------------------------------------------------------------------------
// Formula display
// ---------------------------------------------------------------------------

/**
 * Update the formula display bar and page title with compound data.
 *
 * @param {{ iupacName: string, formula: string, molecularWeight: number, cid: number }} compoundData
 */
export function updateFormulaDisplay(compoundData) {
  const { iupacName, formula, molecularWeight, cid } = compoundData;
  const display = document.getElementById('formula-display');

  if (display) {
    const unicodeFormula = formulaToUnicode(formula) || formula || '—';
    const mwText = molecularWeight
      ? `${Number(molecularWeight).toFixed(3)} g/mol`
      : null;
    const iupacText = iupacName || null;
    const cidText = cid ? `CID ${cid}` : null;

    // Build display HTML
    let html = `<span class="fd-formula">${unicodeFormula}</span>`;

    if (iupacText) {
      html += `<span class="fd-sep">·</span><span class="fd-iupac">${iupacText}</span>`;
    }

    if (mwText) {
      html += `<span class="fd-sep">·</span><span class="fd-mw">${mwText}</span>`;
    }

    if (cidText) {
      html += `<span class="fd-sep">·</span><a
        class="fd-cid"
        href="https://pubchem.ncbi.nlm.nih.gov/compound/${cid}"
        target="_blank"
        rel="noopener noreferrer"
        title="View on PubChem"
      >${cidText}</a>`;
    }

    display.innerHTML = html;
  }

  // Update page title
  const unicodeForTitle = formulaToUnicode(formula) || formula || 'Unknown';
  document.title = `${unicodeForTitle} — Formula Visualiser`;
}
