# Merge Conflict Review

Date: 2026-04-14

## Result
No unresolved Git conflict markers were found in the working tree (`<<<<<<<`, `=======`, `>>>>>>>`).

## Why PR merge conflicts still happen on GitHub
Even when this branch has no local conflict markers, GitHub can still report merge conflicts if the target branch changed the same files after this branch diverged. The current PR is high-risk because it modifies:

- core runtime files (`app.js`, `renderers.js`, `loaders.js`, `topic-enhancements.js`)
- strict validator + schema (`scripts/validate-data.mjs`, `data/schemas/topic-overviews.schema.json`)
- large content files (especially `data/content/topic-overviews/verified-core.json`)

These are merge hotspots when multiple PRs are open concurrently.

## High-risk files for future merges
These files are currently high-churn and likely to conflict when multiple branches touch quiz flow, content loading, and validation:

1. `assets/js/app.js`
   - Quiz setup replacement and route filter parsing are centralized here.
2. `assets/js/renderers.js`
   - Quiz setup rendering now depends on shared builder wiring.
3. `assets/js/topic-enhancements.js`
   - Tricky page pagination and filter UI state are implemented here.
4. `assets/js/loaders.js`
   - Manifest-driven loading and topic alias normalization.
5. `scripts/validate-data.mjs`
   - Strict validation rules and content manifest usage.
6. `data/content/topic-overviews/verified-core.json`
   - Very large, frequently edited content file.

## Suggested merge order
1. Merge `data/content/manifest.json` and loader/constant updates first.
2. Merge quiz setup refactor (`quiz-setup.js`, `renderers.js`, `app.js`) second.
3. Merge tricky-page pagination changes (`topic-enhancements.js`, `app.js` query filter) third.
4. Merge validator/schema/content bulk changes last, then run validator.

## Validation command after merge
```bash
node scripts/validate-data.mjs
```

## Recommended conflict-resolution sequence (GitHub conflict editor or local rebase)
1. Resolve code files first:
   - `assets/js/constants.js`
   - `assets/js/loaders.js`
   - `assets/js/app.js`
   - `assets/js/renderers.js`
   - `assets/js/topic-enhancements.js`
2. Resolve validation contract second:
   - `data/schemas/topic-overviews.schema.json`
   - `scripts/validate-data.mjs`
3. Resolve bulk content files last:
   - `data/content/topic-overviews/verified-core.json`
   - `data/content/*` wave files
4. Run validator immediately:
   - `node scripts/validate-data.mjs`
5. Smoke test key routes:
   - `#/quiz`
   - `#/tricky`
   - `#/topics/<legacy-alias>`

## If conflicts remain after resolution
- Prefer the branch version for structural code introduced in this PR (manifest loader + quiz-setup builder).
- Prefer target-branch content when both sides edited the same paragraph-level content, then re-run validator and fill any missing required fields.
- For `verified-core.json`, resolve by topic object (not by chunk), then validate.

## Manual smoke checks after merge
1. Open `#/quiz` and ensure Coding / Use Case scopes appear and can start.
2. Open `#/tricky` and verify Previous/Next pagination preserves filters.
3. Open topic links using any legacy alias and verify redirect to canonical topic slug.
