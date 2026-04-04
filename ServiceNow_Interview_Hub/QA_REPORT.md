# QA and BA Test Report

## Scope tested
Static GitHub Pages build of the ServiceNow Interview Hub.

## Areas validated
- App shell loads from `index.html`
- CSS, JavaScript, SVG, and JSON assets resolve over HTTP
- JavaScript syntax validation for all modules
- JSON validation for all data files
- Router parsing and hash route generation
- Search utility behavior
- Filter utility behavior
- Quiz generation and scoring logic
- Renderer output for major pages
- Bookmark utility behavior in browser-compatible storage model

## Test summary
- JavaScript files syntax checked successfully
- JSON files parsed successfully
- Static files served successfully over HTTP
- Unit tests passed for:
  - route parsing
  - filter behavior
  - search behavior
  - quiz generation and grading
  - renderer output generation

## Issues found during QA and fixes applied
1. **Topic page filter layout issue**
   - **Issue:** the first version of the shared filter bar rendered empty module/topic dropdowns on the Topics page.
   - **Fix:** refactored the shared filter bar to support optional controls and updated the Topics page to show the correct search + category filter combination.

2. **Search box state sync**
   - **Issue:** the global search field did not reflect the active search query after route changes.
   - **Fix:** synchronized the global search input value with the current route query during rendering.

3. **Scroll behavior compatibility**
   - **Issue:** the first implementation used an invalid scroll behavior value (`instant`).
   - **Fix:** changed it to a browser-safe value (`auto`).

4. **Search result labeling**
   - **Issue:** role/module/topic search results could show less-friendly raw type labels.
   - **Fix:** added explicit labels for role, module, and topic result types.

## Remaining practical limitations
- This is a static GitHub Pages app, so bookmarks persist in browser localStorage but do not sync across devices.
- The current repo is structured to scale toward a very large knowledge base, but the seeded content is still a starting baseline, not the full long-range 5,000+ bank.
- Full browser automation was not run here; QA covered syntax, data integrity, static delivery, and utility/render logic.
