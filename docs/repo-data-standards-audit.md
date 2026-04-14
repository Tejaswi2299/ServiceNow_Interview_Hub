# Repository Data Standards Audit (2026-04-14)

## Scope

Reviewed repository structure, data manifests, and JSON content quality with focus on data standards enforced by `scripts/validate-data.mjs`.

## Checks run

1. `node scripts/validate-data.mjs`
2. JSON parse sweep across all `*.json` files
3. Manifest path existence check for `data/content/manifest.json`

## Findings

### 1) Validation script had a hard failure due to duplicate declarations (fixed)

The validator declared `theory`, `coding`, and `useCases` twice, causing an immediate `SyntaxError` and preventing any standards checks from running.

- Status: **Fixed** in `scripts/validate-data.mjs` by keeping the manifest-driven loaders and removing duplicate redeclarations.

### 2) Core topic overview data contains malformed JSON (open issue)

`data/content/topic-overviews/verified-core.json` has invalid JSON syntax near the first ACL entry (duplicate `"verified"` key missing a separator after `verificationLevel`).

- Impact: blocks loading `topicOverviews` and prevents full cross-file standards validation.
- Status: **Open** (data issue in source file).

### 3) Manifest integrity check passed

All file paths listed in `data/content/manifest.json` exist on disk.

- Status: **Passed**.

## Recommended remediation order

1. Fix malformed JSON in `data/content/topic-overviews/verified-core.json`.
2. Re-run `node scripts/validate-data.mjs` to surface semantic/data-model errors.
3. Address any reported taxonomy/map/content reference errors.
4. Add CI gate to run `node scripts/validate-data.mjs` on pull requests.
