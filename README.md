# Formula Visualiser

An interactive 3D chemical formula visualiser that fetches real molecular structure data from PubChem and renders it in your browser using Three.js.

**Live demo**: https://gimli1a4.github.io/formula-visualiser/

![Formula Visualiser screenshot](screenshot.png)

---

## Features

- **3D molecular visualisation** — atoms and bonds rendered in an interactive Three.js scene with orbit controls
- **Dark / light mode** — toggle between themes, preference stored in localStorage
- **Click-to-inspect atoms** — click any atom to open the inspector panel showing element, symbol, CPK color, and position
- **Preset molecules sidebar** — one-click loading of common molecules (water, caffeine, ethanol, and more)
- **URL sharing** — load any molecule by sharing a link with `?q=` (e.g. `?q=caffeine` or `?q=C8H10N4O2`)
- **Custom CPK colors** — override any element's color via the atom inspector; changes persist in localStorage
- **Noble gases as cubes** — He, Ne, Ar, Kr, Xe, and Rn are rendered as cubes to distinguish them visually; all other elements use spheres

---

## Formula Convention

This app uses **Hill notation** — the universal machine-readable standard used by chemical databases including PubChem.

**Rules:**
- Carbon atoms are listed first, hydrogen second, then all other elements alphabetically.
- Numbers following an element symbol are the subscript count for that element. `H2O` means two hydrogen atoms and one oxygen atom.
- In URLs and input fields, plain ASCII is used: `H2O`, `C8H10N4O2` (caffeine).
- In the UI, numbers are rendered as Unicode subscripts for readability: `H₂O`, `C₈H₁₀N₄O₂`.

**Important distinction:**
- `H2O` — Hill notation (machine-readable, used in `?q=` URL param and PubChem API calls)
- `H₂O` — Display form (Unicode subscripts, display-only, never used in API calls)

These are NOT interchangeable. The app always stores and transmits the ASCII form internally, and converts to Unicode subscripts only for display.

---

## Usage

**Load a molecule by name or formula:**
1. Type a molecule name (e.g. `caffeine`, `aspirin`) or Hill notation formula (e.g. `C8H10N4O2`) into the search box.
2. Press **Enter** or click the search button.
3. The 3D structure is fetched from PubChem and rendered in the scene.

**Load via URL:**
Append `?q=` to the URL with a name or formula:
```
https://gimli1a4.github.io/formula-visualiser/?q=caffeine
https://gimli1a4.github.io/formula-visualiser/?q=H2O
```

**Interact with the scene:**
- **Orbit** — click and drag to rotate
- **Zoom** — scroll wheel
- **Pan** — right-click drag
- **Inspect atom** — left-click an atom to open the inspector panel

---

## Local Development

ES module imports require an HTTP server — opening `index.html` directly via the `file://` protocol will not work due to browser CORS restrictions.

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

Any static file server works: `npx serve .`, `npx http-server`, VS Code Live Server, etc.

---

## Testing

```bash
npm install
npm test
```

To run in watch mode during development:

```bash
npm run test:watch
```

Tests are located in `tests/` and cover the pure logic modules (`elements.js`, `formula.js`, `sdf-parser.js`, `pubchem.js`). No DOM or Three.js involvement — PubChem tests use mocked fetch.

---

## Implementation Plan

### Architecture

Three parallel subagents were used to build this project simultaneously:

**Agent 1 — Logic layer** (`js/elements.js`, `js/formula.js`, `js/sdf-parser.js`, `js/pubchem.js`, tests):
Pure data and logic. No Three.js, no DOM. 57 unit tests.

**Agent 2 — Frontend layer** (`js/renderer.js`, `js/ui.js`, `js/main.js`, `index.html`, `style.css`):
Three.js scene, DOM interaction, CSS theming.

**Agent 3 — Infra layer** (`package.json`, `.github/workflows/pages.yml`, `CLAUDE.md`, `.claude/`, `README.md`):
Config, CI/CD, documentation.

### File dependency tree

```
index.html
└── js/main.js
    ├── js/pubchem.js → js/sdf-parser.js
    ├── js/renderer.js → js/elements.js
    ├── js/ui.js → js/elements.js, js/formula.js
    └── js/formula.js
```

### Key design decisions

- **Formula convention**: Hill notation. Numbers after element symbols = subscript counts. URL-safe ASCII in `?q=` param, displayed as Unicode subscripts (H₂O) in the UI.
- **3D structure source**: PubChem REST API. No backend required — the API supports CORS for browser requests. Covers ~100 million compounds.
- **Noble gas shapes**: Cubes (BoxGeometry) for He, Ne, Ar, Kr, Xe, Rn. Spheres for all other elements. Custom visual convention for this app.
- **No bundler**: Three.js loaded via importmap from unpkg CDN. Pure ES modules, static files, zero build step.
- **CPK colors**: Jmol color scheme. Overridable per-element via the atom inspector (stored in localStorage).

---

## Tech Stack

| Technology | Role |
|---|---|
| [Three.js](https://threejs.org/) | 3D rendering (loaded via importmap from CDN, no build step) |
| [PubChem REST API](https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest) | Molecular structure data source |
| Vanilla ES modules | All JavaScript — no framework, no bundler |
| [Jest](https://jestjs.io/) | Unit testing for logic modules |
| [GitHub Pages](https://pages.github.com/) | Static site hosting, deployed via GitHub Actions |

---

## Contributing

Contributions are welcome. Before making changes, read **`CLAUDE.md`** — it contains the full developer and AI-agent guide for this project, including architecture details, formula conventions, element shape conventions, and how to extend the app.

For AI-assisted development in [Claude Code](https://claude.ai/code), `CLAUDE.md` is automatically loaded as project context. The `.claude/commands/test-site.md` slash command can be used to verify the live deployment after any changes.
