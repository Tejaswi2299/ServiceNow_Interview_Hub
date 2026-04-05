# ServiceNow Interview Hub

Static GitHub Pages package for ServiceNow interview preparation.

## Included
- roles, modules, and topics navigation
- coding questions
- use case scenarios
- quiz
- bookmarks
- Google Analytics 4 support CTA integration
- Wave 6 data-fix pass for missing topics, thin modules, and empty content files

## Deploy to GitHub Pages
1. Download and unzip this package.
2. Open your GitHub repository: `ServiceNow_Interview_Hub`.
3. Upload **the contents of the project folder** to the repository root so `index.html` sits at the top level of the repo.
4. Commit the upload to your main branch.
5. In GitHub, open **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select your branch (for example `main`) and choose **/(root)**.
8. Click **Save** and wait for GitHub Pages to publish.
9. After the site is live, hard refresh the browser once so the latest JSON and JavaScript files load.

## Updating content later
- Add or edit JSON under `data/content/` for theory, coding, or use cases.
- Keep IDs and slugs unique.
- If you add brand-new JSON files, also add them to `assets/js/constants.js`.
- Rebuild `data/indexes/search-index.json` and `data/indexes/coverage-index.json` if you expand content significantly.

## Notes
- This package is static HTML, CSS, JavaScript, and JSON.
- No local install is required.
- Bookmarks and progress stay in the browser through localStorage.
