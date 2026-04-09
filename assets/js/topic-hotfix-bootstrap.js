import { loadAllData } from './loaders.js';
import { filterStudyItems } from './filters.js';
import {
  ensureTopicHotfixAssets,
  enhanceTopicDetailHotfix,
  isTrickyStudyItem,
  renderBetterTrickyPage
} from './topic-hotfixes.js';

const runtime = {
  promise: null,
  data: null,
  lookups: null
};

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/home';
  const [pathPart, queryString = ''] = raw.split('?');
  const cleanPath = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  return {
    path: cleanPath,
    segments: cleanPath.split('/').filter(Boolean),
    query: Object.fromEntries(new URLSearchParams(queryString).entries())
  };
}

function routeQueryFilters(route) {
  return {
    role: route.query.role || '',
    module: route.query.module || '',
    topic: route.query.topic || '',
    difficulty: route.query.difficulty || '',
    q: route.query.q || '',
    category: route.query.category || ''
  };
}

function buildLookups(data) {
  const content = [...data.theory, ...data.coding, ...data.useCases];
  return {
    rolesById: Object.fromEntries(data.roles.map((item) => [item.id, item])),
    modulesById: Object.fromEntries(data.modules.map((item) => [item.id, item])),
    topicsById: Object.fromEntries(data.topics.map((item) => [item.id, item])),
    contentById: Object.fromEntries(content.map((item) => [item.id, item]))
  };
}

async function getState() {
  if (runtime.data && runtime.lookups) return runtime;
  if (!runtime.promise) {
    runtime.promise = loadAllData().then((data) => {
      runtime.data = data;
      runtime.lookups = buildLookups(data);
      return runtime;
    });
  }
  return runtime.promise;
}

function findEntity(collection, slug) {
  return collection.find((item) => item.slug === slug || item.id === slug);
}

function appStateShape(state) {
  return {
    data: state.data,
    lookups: state.lookups
  };
}

function patchTrickyPage(route, state) {
  const appMain = document.getElementById('app-main');
  if (!appMain) return;
  const filters = routeQueryFilters(route);
  const content = [...state.data.theory, ...state.data.coding, ...state.data.useCases];
  const trickyPool = content.filter((item) => isTrickyStudyItem(item));
  const items = filterStudyItems(trickyPool, filters);
  appMain.innerHTML = renderBetterTrickyPage(appStateShape(state), items, filters);
}

function patchTopicPage(route, state) {
  const topic = findEntity(state.data.topics, route.segments[1]);
  if (!topic) return;
  const related = [...state.data.theory, ...state.data.coding, ...state.data.useCases]
    .filter((item) => (item.topicIds || []).includes(topic.id));
  enhanceTopicDetailHotfix(appStateShape(state), topic, related);
}

let scheduled = false;
async function applyHotfixes() {
  scheduled = false;
  ensureTopicHotfixAssets();
  const route = parseHash();
  const state = await getState();
  if (route.segments[0] === 'tricky') {
    patchTrickyPage(route, state);
  }
  if (route.segments[0] === 'topics' && route.segments[1]) {
    patchTopicPage(route, state);
  }
  ensureTopicHotfixAssets();
}

function scheduleHotfixes() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    applyHotfixes().catch((error) => console.error('Topic hotfix bootstrap failed', error));
  });
}

window.addEventListener('hashchange', scheduleHotfixes);
window.addEventListener('load', scheduleHotfixes);

const appMain = document.getElementById('app-main');
if (appMain) {
  const observer = new MutationObserver(() => {
    const route = parseHash();
    if (route.segments[0] === 'tricky' || (route.segments[0] === 'topics' && route.segments[1])) {
      scheduleHotfixes();
    }
  });
  observer.observe(appMain, { childList: true, subtree: true });
}

scheduleHotfixes();
