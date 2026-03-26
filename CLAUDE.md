# Formula Visualiser — Developer & Agent Guide

## Project Overview

Formula Visualiser is an interactive 3D chemical formula visualiser built as a static single-page application. It lets users type a molecule name or formula, fetches 3D structure data from the PubChem REST API, and renders an interactive 3D model using Three.js.

- **Deployed at**: https://gimli1a4.github.io/formula-visualiser/
- **Repository**: https://github.com/gimli1a4/formula-visualiser
- **Hosting**: GitHub Pages (static, no server-side logic)
- **Build step**: None — pure static files served directly

---

## Formula Convention

This app uses **Hill notation** — the universal machine-readable standard used by chemical databases including PubChem.

**Rules:**
- Carbon atoms are listed first, hydrogen second, then all other elements alphabetically.
- Numbers following an element symbol are the subscript count for that element. `H2O` means two hydrogen atoms and one oxygen atom.
- In URLs and input fields, plain ASCII is used: `H2O`, `C8H10N4O2` (caffeine).
- In the UI, numbers are rendered as Unicode subscripts for readability: `H₂O`, `C₈H₁₀N₄O₂`.

**Important distinction:**
- `H2O` — Hill notation (machine-readable, used in `?q=` URL param and PubChem)
- `H₂O` — Display form (Unicode subscripts, display-only, not used in API calls)

These are NOT interchangeable. The app always stores and transmits the ASCII form internally, and converts to Unicode subscripts only for display.

---

## Element Shape Convention

This is a **custom visual convention for this app**, not a chemistry standard:

- **Noble gases** (He, Ne, Ar, Kr, Xe, Rn) are rendered as **cubes** (Three.js `BoxGeometry`).
- **All other elements** are rendered as **spheres** (Three.js `SphereGeometry`).

This distinction is defined by the `NOBLE_GAS_SYMBOLS` constant in `js/elements.js`. To change which elements use cube geometry, edit that set.

---

## Architecture

### File Dependency Tree

```
index.html
└── js/main.js
    ├── js/pubchem.js → js/sdf-parser.js
    ├── js/renderer.js → js/elements.js
    ├── js/ui.js → js/elements.js, js/formula.js
    └── js/formula.js
```

### Module Responsibilities

| File | Responsibility |
|---|---|
| `js/elements.js` | Element data (CPK colors, radii, noble gas set). No DOM, no Three.js. |
| `js/formula.js` | Parse Hill notation strings into element/count maps. Format for display. No DOM. |
| `js/sdf-parser.js` | Parse SDF/MOL format text into atom/bond arrays. No DOM, no Three.js. |
| `js/pubchem.js` | PubChem REST API calls (name lookup, CID lookup, SDF fetch). No DOM. |
| `js/renderer.js` | Three.js scene setup, atom/bond mesh creation, camera controls, raycasting. |
| `js/ui.js` | DOM event listeners, sidebar, atom inspector panel, dark/light mode toggle, URL param handling. |
| `js/main.js` | Wires pubchem + renderer + ui together. Entry point imported by `index.html`. |
| `index.html` | Shell HTML with importmap for Three.js CDN, `<canvas>`, sidebar, inspector panel. |
| `style.css` | All visual styling. CSS custom properties for dark/light theming. |

---

## Tech Stack

- **Three.js** — loaded via `importmap` from unpkg CDN. No bundler, no npm install needed for runtime.
- **PubChem REST API** — public CORS-enabled API for structure data. Covers ~100 million compounds. No API key required.
- **Vanilla ES modules** — `type="module"` scripts, native browser imports.
- **Jest** — unit tests for pure logic modules (`elements.js`, `formula.js`, `sdf-parser.js`, `pubchem.js`). Tests live in `tests/`.
- **GitHub Pages** — static file hosting, deployed via GitHub Actions on every push to `main`.

---

## Running Locally

ES module imports require an HTTP server — the `file://` protocol will not work due to browser CORS restrictions.

```bash
python3 -m http.server 8000
# Then open: http://localhost:8000
```

Any static file server works (e.g. `npx serve .`, `npx http-server`, VS Code Live Server).

---

## Running Tests

```bash
npm install
npm test
```

To run in watch mode during development:

```bash
npm run test:watch
```

Tests are located in `tests/` and match the pattern `**/*.test.js`. They cover pure logic only — no DOM, no Three.js, no network calls (PubChem tests use mocked fetch).

---

## How to Add a Preset Molecule

Edit the `PRESET_MOLECULES` array in `js/ui.js`. Each entry is an object with `name` (display label) and `formula` (Hill notation string used as the query):

```js
const PRESET_MOLECULES = [
  { name: 'Water', formula: 'H2O' },
  { name: 'Caffeine', formula: 'caffeine' },  // name lookup also works
  // Add your entry here:
  { name: 'Aspirin', formula: 'C9H8O4' },
];
```

The `formula` field is passed directly to the PubChem lookup, so either a molecule name or a Hill notation formula string is accepted.

---

## How to Update Element CPK Colors

Edit the `ELEMENTS` map in `js/elements.js`. Each element entry has a `color` property (hex string):

```js
export const ELEMENTS = {
  H:  { color: '#ffffff', radius: 0.31 },
  C:  { color: '#909090', radius: 0.77 },
  O:  { color: '#ff0d0d', radius: 0.66 },
  // ...
};
```

**Per-session overrides:** When a user clicks an atom in the inspector and changes its color, that override is stored in `localStorage` under the key `cpk_{SYMBOL}` (e.g. `cpk_O` for oxygen). These override the defaults for the duration of that browser session and persist across page reloads in the same browser. They do not affect other users.

---

## PubChem API — Lookup Strategy

The app uses a multi-step fallback strategy to find 3D structure data:

1. **Name → 3D SDF**: `GET /rest/pug/compound/name/{query}/SDF?record_type=3d`
   - Works for common molecule names (e.g. "caffeine", "aspirin").
   - Returns 3D coordinates directly if a 3D conformer exists.

2. **Formula CID → 3D SDF**: If name lookup fails or returns no 3D conformer, query by formula to get a CID, then fetch the 3D SDF for that CID.
   - `GET /rest/pug/compound/formula/{formula}/cids/JSON`
   - `GET /rest/pug/compound/cid/{cid}/SDF?record_type=3d`

3. **2D fallback**: If no 3D conformer is available (common for very large or unusual molecules), fetch the 2D SDF and render it flat.
   - `GET /rest/pug/compound/name/{query}/SDF` (without `record_type=3d`)

All requests are made directly from the browser. PubChem's API supports CORS for browser requests — no proxy or backend is needed.

---

## Subagent Breakdown

This project was built using three parallel subagents:

### Agent 1 — Logic Layer
**Files**: `js/elements.js`, `js/formula.js`, `js/sdf-parser.js`, `js/pubchem.js`, `tests/`

Pure data and logic. No Three.js, no DOM. Responsible for element data, formula parsing, SDF parsing, and PubChem API communication. 57 unit tests covering all modules.

### Agent 2 — Frontend Layer
**Files**: `js/renderer.js`, `js/ui.js`, `js/main.js`, `index.html`, `style.css`

Three.js scene management, DOM interaction, CSS theming. Consumes the logic layer modules. Responsible for the visual presentation and user interaction.

### Agent 3 — Infra Layer
**Files**: `package.json`, `jest.config.js`, `.gitignore`, `.github/workflows/pages.yml`, `CLAUDE.md`, `.claude/`, `README.md`

Configuration, CI/CD pipeline, and documentation. No runtime code.

---

## Testing the Live Site

See `.claude/commands/test-site.md` for the `/test-site` slash command, which automates checking the deployed GitHub Pages site for basic correctness.

To run it in a Claude Code session:

```
/test-site
```

This fetches the live URL, checks for HTTP 200 and a `<canvas>` element, and tests the `?q=caffeine` query parameter.
