
import { CONTENT_FILES, MAP_FILES, TAXONOMY_FILES } from './constants.js';

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return response.json();
}

async function fetchMany(paths = []) {
  const data = await Promise.all(paths.map((path) => fetchJson(path)));
  return data.flat();
}

function normalizeTopicId(topicId = '', aliases = {}) {
  return aliases?.[topicId] || topicId;
}

function normalizeTopicIds(values = [], aliases = {}) {
  return [...new Set((values || []).map((value) => normalizeTopicId(value, aliases)).filter(Boolean))];
}

function normalizeTopicMap(map = {}, aliases = {}) {
  return Object.fromEntries(
    Object.entries(map || {}).map(([key, topicIds]) => [key, normalizeTopicIds(topicIds, aliases)])
  );
}

function normalizeContentTopicIds(items = [], aliases = {}) {
  return (items || []).map((item) => ({
    ...item,
    topicIds: normalizeTopicIds(item.topicIds || [], aliases)
  }));
}

export async function loadAllData() {
  const [roles, modules, topics, contentTypes, difficultyLevels, roleModule, moduleTopic, roleTopic, moduleCoding, moduleUseCase, topicAliases, theory, topicOverviews, coding, useCases, quizzes, searchIndex, coverage] = await Promise.all([
    fetchJson(TAXONOMY_FILES.roles),
    fetchJson(TAXONOMY_FILES.modules),
    fetchJson(TAXONOMY_FILES.topics),
    fetchJson(TAXONOMY_FILES.contentTypes),
    fetchJson(TAXONOMY_FILES.difficultyLevels),
    fetchJson(MAP_FILES.roleModule),
    fetchJson(MAP_FILES.moduleTopic),
    fetchJson(MAP_FILES.roleTopic),
    fetchJson(MAP_FILES.moduleCoding),
    fetchJson(MAP_FILES.moduleUseCase),
    fetchJson(MAP_FILES.topicAliases),
    fetchMany(CONTENT_FILES.theory),
    fetchMany(CONTENT_FILES.topicOverviews || []),
    fetchMany(CONTENT_FILES.coding),
    fetchMany(CONTENT_FILES.useCases),
    fetchJson(CONTENT_FILES.quizzes),
    fetchJson(CONTENT_FILES.searchIndex),
    fetchJson(CONTENT_FILES.coverage)
  ]);

  return {
    roles,
    modules,
    topics,
    contentTypes,
    difficultyLevels,
    theory: normalizeContentTopicIds(theory, topicAliases),
    topicOverviews,
    coding: normalizeContentTopicIds(coding, topicAliases),
    useCases: normalizeContentTopicIds(useCases, topicAliases),
    quizzes: normalizeContentTopicIds(quizzes, topicAliases),
    searchIndex,
    coverage,
    maps: {
      roleModule,
      moduleTopic: normalizeTopicMap(moduleTopic, topicAliases),
      roleTopic: normalizeTopicMap(roleTopic, topicAliases),
      moduleCoding,
      moduleUseCase,
      topicAliases
    }
  };
}
