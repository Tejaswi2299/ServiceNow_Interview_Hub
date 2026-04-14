# Repository Data Standards Audit (2026-04-14)

## Scope

Reviewed repository structure, data manifests, and JSON content quality with focus on data standards enforced by `scripts/validate-data.mjs`.

## Checks run

1. `node scripts/validate-data.mjs`
2. JSON parse sweep across all `data/**/*.json` files
3. Manifest path existence check for `data/content/manifest.json`

## Findings and resolution

### 1) Validation script startup bug (resolved)

The validator previously redeclared `theory`, `coding`, and `useCases`, which caused a startup `SyntaxError` before any checks could run.

- Resolution: kept manifest-driven loaders and removed duplicate redeclarations in `scripts/validate-data.mjs`.

### 2) Topic overview JSON corruption causing UI load failure (resolved)

The UI error (`Failed to load interview hub data`) was caused by malformed JSON and duplicated topic entries in `data/content/topic-overviews/verified-core.json`.

- Resolution:
  - fixed malformed JSON syntax in the topic overview file,
  - removed duplicate `topicId` entries while preserving the first valid record for each topic.

### 3) Data standards status (current)

- `node scripts/validate-data.mjs` now passes.
- JSON parse sweep reports zero invalid files.
- Manifest path integrity check reports zero missing files.

## Recommended next step

Add CI gating for `node scripts/validate-data.mjs` to prevent broken JSON or duplicate topic entries from reaching the default branch.
