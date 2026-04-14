import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function readJsonArray(relativePaths = []) {
  return relativePaths.flatMap((relativePath) => readJson(relativePath));
}

function assertUnique(items, key, label, errors) {
  const seen = new Set();
  for (const item of items) {
    const value = item?.[key];
    if (!value) {
      errors.push(`${label} missing '${key}'.`);
      continue;
    }
    if (seen.has(value)) {
      errors.push(`${label} duplicate ${key}: '${value}'.`);
      continue;
    }
    seen.add(value);
  }
}}

function normalizeTopicId(topicId = '', aliases = {}) {
  return aliases?.[topicId] || topicId;
}

function validateTopicAliases(topicAliases = {}, topicIdSet, errors) {
  Object.entries(topicAliases).forEach(([legacyId, canonicalId]) => {
    if (!legacyId || !canonicalId) {
      errors.push('topic-aliases contains empty key/value.');
      return;
    }
    if (legacyId === canonicalId) {
      errors.push(`topic alias '${legacyId}' points to itself.`);
    }
    if (!topicIdSet.has(canonicalId)) {
      errors.push(`topic alias '${legacyId}' points to missing canonical topic '${canonicalId}'.`);
    }
  });
}

function validateTopicMap(mapName, mapObject, parentSet, topicIdSet, topicAliases, errors) {
  Object.entries(mapObject || {}).forEach(([parentId, topicIds]) => {
    if (!parentSet.has(parentId)) {
      errors.push(`${mapName} parent '${parentId}' does not match a known id/slug.`);
    }
    const seen = new Set();
    (topicIds || []).forEach((topicId) => {
      const canonicalTopicId = normalizeTopicId(topicId, topicAliases);
      if (!topicIdSet.has(canonicalTopicId)) {
        errors.push(`${mapName} parent '${parentId}' points to missing topic '${topicId}'.`);
      }
      if (seen.has(canonicalTopicId)) {
        errors.push(`${mapName} parent '${parentId}' contains duplicate/alias topic '${topicId}'.`);
      }
      seen.add(canonicalTopicId);
    });
  });
}

function validateOverviews(entries = [], topicIdSet, errors) {
  const requiredText = ['definition', 'whatItDoes'];
  const requiredArrays = ['tablesInvolved', 'keyComponents', 'realTimeExamples', 'interviewPitfalls'];
  const seenTopicIds = new Set();

  entries.forEach((entry) => {
    if (!entry.topicId || !topicIdSet.has(entry.topicId)) {
      errors.push(`topic overview has unknown topicId '${entry.topicId || ''}'.`);
      return;
    }
    if (seenTopicIds.has(entry.topicId)) {
      errors.push(`topic overview duplicate topicId '${entry.topicId}'.`);
    }
    seenTopicIds.add(entry.topicId);

    requiredText.forEach((field) => {
      if (!`${entry[field] || ''}`.trim()) {
        errors.push(`topic overview '${entry.topicId}' missing '${field}'.`);
      }
    });
    requiredArrays.forEach((field) => {
      if (!Array.isArray(entry[field]) || !entry[field].length || entry[field].some((value) => !`${value || ''}`.trim())) {
        errors.push(`topic overview '${entry.topicId}' invalid '${field}'.`);
      }
    });
    if (typeof entry.verified !== 'boolean') {
      errors.push(`topic overview '${entry.topicId}' missing boolean 'verified'.`);
    }
    if (!['official', 'derived', 'draft'].includes(entry.verificationLevel)) {
      errors.push(`topic overview '${entry.topicId}' has invalid 'verificationLevel'.`);
    }
    if (typeof entry.trickyComparisonSupport !== 'boolean') {
      errors.push(`topic overview '${entry.topicId}' missing boolean 'trickyComparisonSupport'.`);
    }
    if (!Array.isArray(entry.officialSources) || !entry.officialSources.length || entry.officialSources.some((value) => !`${value || ''}`.trim())) {
      errors.push(`topic overview '${entry.topicId}' invalid 'officialSources'.`);
    }
  });
}

function validateContentTopicIds(items = [], topicIdSet, topicAliases, label, errors) {
  items.forEach((item) => {
    const topicIds = item.topicIds || [];
    const seen = new Set();
    topicIds.forEach((topicId) => {
      const canonicalTopicId = normalizeTopicId(topicId, topicAliases);
      if (!topicIdSet.has(canonicalTopicId)) {
        errors.push(`${label} '${item.id || item.slug || 'unknown'}' references missing topic '${topicId}'.`);
      }
      if (seen.has(canonicalTopicId)) {
        errors.push(`${label} '${item.id || item.slug || 'unknown'}' has duplicate/alias topic '${topicId}'.`);
      }
      seen.add(canonicalTopicId);
    });
  });
}

function validateTrickyItemCompleteness(theoryItems = [], errors) {
  const STOP_WORDS = new Set([
    'how', 'what', 'when', 'why', 'is', 'are', 'the', 'a', 'an', 'in', 'on', 'for', 'to', 'and', 'or', 'of', 'do', 'does', 'you', 'your', 'vs', 'between', 'difference'
  ]);
  const tokenize = (value = '') => `${value}`
    .toLowerCase()
    .match(/[a-z0-9]+/g)?.filter((token) => token.length > 2 && !STOP_WORDS.has(token)) || [];

  theoryItems
    .filter((item) => ['tricky', 'comparison', 'troubleshooting'].includes(item.contentType))
    .forEach((item) => {
      if (!`${item.exactAnswer || ''}`.trim()) errors.push(`tricky item '${item.id}' missing exactAnswer.`);
      if (!Array.isArray(item.keyPoints) || !item.keyPoints.length) errors.push(`tricky item '${item.id}' missing keyPoints.`);
      if (!Array.isArray(item.examples) || !item.examples.length) errors.push(`tricky item '${item.id}' missing examples.`);
      if (!Array.isArray(item.officialSources) || !item.officialSources.length) errors.push(`tricky item '${item.id}' missing officialSources.`);
      if (!Array.isArray(item.topicIds) || !item.topicIds.length) errors.push(`tricky item '${item.id}' missing topicIds.`);
      if (!Array.isArray(item.moduleIds) || !item.moduleIds.length) errors.push(`tricky item '${item.id}' missing moduleIds.`);
      if (!Array.isArray(item.roleIds) || !item.roleIds.length) errors.push(`tricky item '${item.id}' missing roleIds.`);

      const questionTokens = new Set(tokenize(`${item.title || ''} ${item.question || ''}`));
      const answerTokens = new Set(tokenize(item.exactAnswer || ''));
      if (questionTokens.size) {
        const overlap = [...questionTokens].filter((token) => answerTokens.has(token)).length / questionTokens.size;
        if (overlap < 0.12) {
          errors.push(`tricky item '${item.id}' exactAnswer appears weakly aligned to its question (token-overlap check).`);
        }
      }
    });
}

function validateScenarioItems(items = [], label, errors) {
  const STOP_WORDS = new Set([
    'how', 'what', 'when', 'why', 'is', 'are', 'the', 'a', 'an', 'in', 'on', 'for', 'to', 'and', 'or', 'of', 'do', 'does', 'you', 'your', 'write', 'create', 'implement', 'design'
  ]);
  const tokenize = (value = '') => `${value}`
    .toLowerCase()
    .match(/[a-z0-9]+/g)?.filter((token) => token.length > 2 && !STOP_WORDS.has(token)) || [];

  items.forEach((item) => {
    if (!`${item.exactAnswer || ''}`.trim()) errors.push(`${label} '${item.id}' missing exactAnswer.`);
    if (!Array.isArray(item.keyPoints) || !item.keyPoints.length) errors.push(`${label} '${item.id}' missing keyPoints.`);
    if (!Array.isArray(item.examples) || !item.examples.length) errors.push(`${label} '${item.id}' missing examples.`);
    if (!Array.isArray(item.officialSources) || !item.officialSources.length) errors.push(`${label} '${item.id}' missing officialSources.`);
    if (!Array.isArray(item.topicIds) || !item.topicIds.length) errors.push(`${label} '${item.id}' missing topicIds.`);
    if (!Array.isArray(item.moduleIds) || !item.moduleIds.length) errors.push(`${label} '${item.id}' missing moduleIds.`);
    if (!Array.isArray(item.roleIds) || !item.roleIds.length) errors.push(`${label} '${item.id}' missing roleIds.`);

    const questionTokens = new Set(tokenize(`${item.title || ''} ${item.question || ''}`));
    const answerTokens = new Set(tokenize(item.exactAnswer || ''));
    if (questionTokens.size) {
      const overlap = [...questionTokens].filter((token) => answerTokens.has(token)).length / questionTokens.size;
      if (overlap < 0.08) {
        errors.push(`${label} '${item.id}' exactAnswer appears weakly aligned to its question (token-overlap check).`);
      }
    }
  });
}

const errors = [];

const roles = readJson('data/taxonomy/roles.json');
const modules = readJson('data/taxonomy/modules.json');
const topics = readJson('data/taxonomy/topics.json');
const roleModule = readJson('data/maps/role-module-map.json');
const moduleTopic = readJson('data/maps/module-topic-map.json');
const roleTopic = readJson('data/maps/role-topic-map.json');
const topicAliases = readJson('data/maps/topic-aliases.json');
const topicOverviews = readJson('data/content/topic-overviews/verified-core.json');
const contentManifest = readJson('data/content/manifest.json');

const theory = readJsonArray(contentManifest.theory || []);
const coding = readJsonArray(contentManifest.coding || []);
const useCases = readJsonArray(contentManifest.useCases || []);
const quizzes = readJson('data/content/quizzes/quiz-bank.json');

assertUnique(roles, 'id', 'roles', errors);
assertUnique(roles, 'slug', 'roles', errors);
assertUnique(modules, 'id', 'modules', errors);
assertUnique(modules, 'slug', 'modules', errors);
assertUnique(topics, 'id', 'topics', errors);
assertUnique(topics, 'slug', 'topics', errors);

const roleSet = new Set([...roles.map((item) => item.id), ...roles.map((item) => item.slug)]);
const moduleSet = new Set([...modules.map((item) => item.id), ...modules.map((item) => item.slug)]);
const topicIdSet = new Set(topics.map((item) => item.id));

validateTopicAliases(topicAliases, topicIdSet, errors);
validateTopicMap('module-topic-map', moduleTopic, moduleSet, topicIdSet, topicAliases, errors);
validateTopicMap('role-topic-map', roleTopic, roleSet, topicIdSet, topicAliases, errors);
validateOverviews(topicOverviews, topicIdSet, errors);
validateContentTopicIds(theory, topicIdSet, topicAliases, 'theory item', errors);
validateContentTopicIds(coding, topicIdSet, topicAliases, 'coding item', errors);
validateContentTopicIds(useCases, topicIdSet, topicAliases, 'use-case item', errors);
validateContentTopicIds(quizzes, topicIdSet, topicAliases, 'quiz item', errors);
validateTrickyItemCompleteness(theory, errors);
validateScenarioItems(coding, 'coding item', errors);
validateScenarioItems(useCases, 'use-case item', errors);

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR: ${error}`));
  process.exit(1);
}

console.log(`Validation passed: ${roles.length} roles, ${modules.length} modules, ${topics.length} topics.`);
