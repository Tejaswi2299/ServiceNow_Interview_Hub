import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function assertUnique(items, key, label, errors) {
  const seen = new Map();
  for (const item of items) {
    const value = item?.[key];
    if (!value) {
      errors.push(`${label} is missing required key '${key}'.`);
      continue;
    }
    if (seen.has(value)) {
      errors.push(`${label} has duplicate ${key}: ${value}`);
      continue;
    }
    seen.set(value, true);
  }
}

function buildValidValueSet(items = []) {
  const values = new Set();
  items.forEach((item) => {
    if (item?.id) values.add(item.id);
    if (item?.slug) values.add(item.slug);
  });
  return values;
}

function validateMap(mapObject, validParents, validChildren, label, warnings, errors) {
  Object.entries(mapObject || {}).forEach(([parent, children]) => {
    if (!validParents.has(parent)) {
      warnings.push(`${label}: parent key '${parent}' is not present in the current taxonomy ids/slugs.`);
    }
    (children || []).forEach((child) => {
      if (!validChildren.has(child)) {
        warnings.push(`${label}: child value '${child}' is not present in the current taxonomy ids/slugs.`);
      }
    });
  });
}

function validateOverviewEntries(entries, topicIds, errors) {
  const requiredArrayFields = ['tablesInvolved', 'keyComponents', 'realTimeExamples', 'interviewPitfalls'];
  for (const entry of entries) {
    if (!entry.topicId || !topicIds.has(entry.topicId)) {
      errors.push(`Topic overview references unknown topicId '${entry.topicId || ''}'.`);
    }
    if (!entry.definition || !entry.whatItDoes) {
      errors.push(`Topic overview '${entry.topicId}' is missing definition or whatItDoes.`);
    }
    requiredArrayFields.forEach((field) => {
      if (!Array.isArray(entry[field]) || !entry[field].length || entry[field].some((value) => !`${value || ''}`.trim())) {
        errors.push(`Topic overview '${entry.topicId}' has invalid '${field}'.`);
      }
    });
  }
}

function fileMustExist(relativePath, errors) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Required file is missing: ${relativePath}`);
  }
}

const errors = [];
const warnings = [];

const roles = readJson('data/taxonomy/roles.json');
const modules = readJson('data/taxonomy/modules.json');
const topics = readJson('data/taxonomy/topics.json');
const roleModule = readJson('data/maps/role-module-map.json');
const moduleTopic = readJson('data/maps/module-topic-map.json');
const roleTopic = readJson('data/maps/role-topic-map.json');
const moduleCoding = readJson('data/maps/module-coding-map.json');
const moduleUseCase = readJson('data/maps/module-usecase-map.json');
const verifiedTopicOverviews = readJson('data/content/topic-overviews/verified-core.json');

assertUnique(roles, 'id', 'roles', errors);
assertUnique(roles, 'slug', 'roles', errors);
assertUnique(modules, 'id', 'modules', errors);
assertUnique(modules, 'slug', 'modules', errors);
assertUnique(topics, 'id', 'topics', errors);
assertUnique(topics, 'slug', 'topics', errors);

const roleValues = buildValidValueSet(roles);
const moduleValues = buildValidValueSet(modules);
const topicValues = buildValidValueSet(topics);

validateMap(roleModule, roleValues, moduleValues, 'role-module-map', warnings, errors);
validateMap(moduleTopic, moduleValues, topicValues, 'module-topic-map', warnings, errors);
validateMap(roleTopic, roleValues, topicValues, 'role-topic-map', warnings, errors);
validateMap(moduleCoding, moduleValues, new Set(), 'module-coding-map', warnings, errors);
validateMap(moduleUseCase, moduleValues, new Set(), 'module-usecase-map', warnings, errors);
validateOverviewEntries(verifiedTopicOverviews, new Set(topics.map((topic) => topic.id)), errors);
fileMustExist('assets/js/topic-overview-defaults.js', errors);
fileMustExist('assets/js/page-enhancements.js', errors);
fileMustExist('assets/js/topic-enhancements.js', errors);

warnings.forEach((warning) => console.warn(`WARNING: ${warning}`));

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}

console.log(`Validation passed. Roles: ${roles.length}, Modules: ${modules.length}, Topics: ${topics.length}, Curated topic overviews: ${verifiedTopicOverviews.length}.`);
if (warnings.length) {
  console.log(`Completed with ${warnings.length} warning(s).`);
}
