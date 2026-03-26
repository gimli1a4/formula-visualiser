---
description: Tests the deployed Formula Visualiser site for correctness
tools: WebFetch, WebSearch
---

# Site Tester Agent

This agent performs end-to-end testing of the deployed Formula Visualiser site at https://gimli1a4.github.io/formula-visualiser/. Use it to verify that a deployment is healthy after pushing to `main`, or to diagnose reports of the site being broken.

This agent does not run JavaScript — it checks the static HTML shell that GitHub Pages serves. Client-side behaviour (Three.js rendering, PubChem API calls) cannot be verified via HTTP fetch alone, but the presence of the correct HTML structure and assets is a strong signal that the deployment is intact.

## Checks to Perform

### 1. Root page availability
Fetch `https://gimli1a4.github.io/formula-visualiser/`
- Confirm HTTP 200 status
- Confirm response body contains `<canvas` — the Three.js rendering surface
- Confirm response body contains `importmap` — the Three.js CDN import map
- Confirm response body contains a `<script type="module"` tag pointing to `js/main.js`
- Confirm response body does not contain "There isn't a GitHub Pages site here" (GitHub's 404 page text)

### 2. Query parameter page load
Fetch `https://gimli1a4.github.io/formula-visualiser/?q=caffeine`
- Confirm HTTP 200 status
- Confirm the response is identical in structure to the root page (this is a SPA; the server ignores query params)
- Confirm the same `<canvas` and `importmap` markers are present

### 3. Static asset availability
Fetch the following URLs and confirm each returns HTTP 200:
- `https://gimli1a4.github.io/formula-visualiser/js/main.js`
- `https://gimli1a4.github.io/formula-visualiser/js/elements.js`
- `https://gimli1a4.github.io/formula-visualiser/js/pubchem.js`
- `https://gimli1a4.github.io/formula-visualiser/style.css`

### 4. Deployment workflow status (if any check fails)
Search or fetch `https://github.com/gimli1a4/formula-visualiser/actions` to find the status of the most recent "Deploy to GitHub Pages" workflow run.

## How to Interpret Results

### Healthy site
- All HTTP responses are 200
- Root page body contains `<canvas`, `importmap`, and `type="module"`
- All static assets return 200
- No GitHub 404 page content detected
- Response sizes are reasonable (HTML shell: 2–20 KB, JS files: 1–50 KB each)

### Broken deployment
- Root page returns 404 — GitHub Pages is not configured, or the repository/branch is wrong
- Root page returns 200 but contains "There isn't a GitHub Pages site here" — Pages is enabled but pointing at the wrong branch or directory
- Root page returns 200 but is missing `<canvas` or `importmap` — the HTML has been accidentally broken or replaced
- Static assets return 404 — JS files were not committed or the path is wrong

### Deployment in progress
- The GitHub Actions workflow shows a recent successful run but the site still returns old content or 404 — GitHub Pages CDN propagation can take up to 10 minutes. Advise waiting and retrying.
- The workflow run is still in progress — advise waiting for it to complete before testing.

### Workflow failure
- If the most recent Actions run failed, report the failing step and any visible error message. Common causes: incorrect `path` in the upload-pages-artifact step, permissions misconfiguration, or a syntax error in the workflow YAML.
