# Test Site

Test the deployed Formula Visualiser site at https://gimli1a4.github.io/formula-visualiser/

## Steps

1. Fetch the root URL https://gimli1a4.github.io/formula-visualiser/ and check:
   - HTTP response status is 200
   - Response body contains `<canvas` (confirms the Three.js rendering surface is present in the HTML)
   - Response body contains `importmap` (confirms the Three.js CDN import map is present)
   - Response body contains `formula-visualiser` or a recognisable page title

2. Fetch https://gimli1a4.github.io/formula-visualiser/?q=caffeine and check:
   - HTTP response status is 200
   - Response body is the same shell HTML (this is a SPA — the `?q=` param is handled client-side by JavaScript, so the server always returns the same HTML regardless of query string)
   - No server-side error page is returned

3. Report all findings clearly:
   - List each check with pass/fail
   - If anything is unexpected, quote the relevant part of the response
   - Note the HTTP status codes received
   - Note the approximate response size (bytes) as a sanity check that content is being served (not an empty or stub page)

## Expected — healthy site

- Both URLs return HTTP 200
- Both responses contain `<canvas`
- Both responses contain `importmap`
- Response body is 2 KB–20 KB (typical for a hand-authored HTML shell)
- No `404`, `500`, or GitHub Pages "There isn't a GitHub Pages site here" error content

## Fallback if the site appears down or returns unexpected content

Check the GitHub Actions deployment workflow status:
- Visit https://github.com/gimli1a4/formula-visualiser/actions
- Look for the most recent "Deploy to GitHub Pages" workflow run
- Check whether it completed successfully or failed, and report the status
- If the workflow succeeded but the site is still down, GitHub Pages propagation may still be in progress (can take up to 10 minutes after a new deployment)
