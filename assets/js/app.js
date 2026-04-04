
import { loadAllData } from './loaders.js';
import { appState } from './state.js';
import { parseHash, navigate } from './router.js';
import { filterStudyItems } from './filters.js';
import { searchIndex } from './search.js';
import { toggleBookmark } from './bookmarks.js';
import { buildQuiz, gradeQuiz } from './quiz.js';
import { trackEvent, trackPageView } from './analytics.js';
import {
  renderBookmarksPage,
  renderCodingDetail,
  renderCodingPage,
  renderHome,
  renderModuleDetail,
  renderModulesPage,
  renderNotFound,
  renderQuizResults,
  renderQuizRunner,
  renderQuizSetup,
  renderRoleDetail,
  renderRolesPage,
  renderSearchResults,
  renderStudyDetail,
  renderTopicDetail,
  renderTopicsPage,
  renderUseCaseDetail,
  renderUseCasesPage
} from './renderers.js';

const appMain = document.getElementById('app-main');
const pageTitleNode = document.getElementById('page-title');
const globalSearchForm = document.getElementById('global-search-form');
const globalSearchInput = document.getElementById('global-search-input');
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const sidebar = document.querySelector('.sidebar');

function setPageHeading(title, routePath = '') {
  document.title = `${title} | ServiceNow Interview Hub`;
  pageTitleNode.textContent = title;
  updateActiveNav(routePath);
  trackPageView(title, routePath);
}

function updateActiveNav(path) {
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const active = href === '#/home'
      ? path === '/home' || path === '/'
      : path.startsWith(href.replace(/^#/, ''));
    link.classList.toggle('active', active);
  });
}

function buildLookups() {
  appState.lookups.rolesById = Object.fromEntries(appState.data.roles.map((item) => [item.id, item]));
  appState.lookups.modulesById = Object.fromEntries(appState.data.modules.map((item) => [item.id, item]));
  appState.lookups.topicsById = Object.fromEntries(appState.data.topics.map((item) => [item.id, item]));
  const content = [...appState.data.theory, ...appState.data.coding, ...appState.data.useCases];
  appState.lookups.contentById = Object.fromEntries(content.map((item) => [item.id, item]));
}

function updateSidebarStats() {
  const counts = appState.data.coverage.currentCounts;
  const roles = document.getElementById('stat-roles');
  const modules = document.getElementById('stat-modules');
  const topics = document.getElementById('stat-topics');
  const items = document.getElementById('stat-items');
  if (roles) roles.textContent = counts.roles;
  if (modules) modules.textContent = counts.modules;
  if (topics) topics.textContent = counts.topics;
  if (items) items.textContent = counts.totalSeededStudyItems;
}

function findEntity(collection, slug) {
  return collection.find((item) => item.slug === slug || item.id === slug);
}

function relatedItemsFor(item, limit = 4) {
  const all = [...appState.data.theory, ...appState.data.coding, ...appState.data.useCases];
  return all
    .filter((candidate) => candidate.id !== item.id)
    .map((candidate) => {
      let score = 0;
      if ((candidate.moduleIds || []).some((id) => (item.moduleIds || []).includes(id))) score += 2;
      if ((candidate.topicIds || []).some((id) => (item.topicIds || []).includes(id))) score += 3;
      if ((candidate.roleIds || []).some((id) => (item.roleIds || []).includes(id))) score += 1;
      return { candidate, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.title.localeCompare(b.candidate.title))
    .slice(0, limit)
    .map((row) => row.candidate);
}


function intersects(listA = [], listB = []) {
  if (!listA.length || !listB.length) return false;
  const setB = new Set(listB);
  return listA.some((item) => setB.has(item));
}

function getRoleRelatedItems(role, allItems) {
  const roleTopicIds = [...new Set([...(role.topicIds || []), ...((appState.data.maps.roleTopic[role.id] || appState.data.maps.roleTopic[role.slug] || []))])];
  const roleModuleIds = [...new Set(role.moduleIds || [])];
  return allItems.filter((item) =>
    (item.roleIds || []).includes(role.id) ||
    intersects(item.moduleIds || [], roleModuleIds) ||
    intersects(item.topicIds || [], roleTopicIds)
  );
}

function getModuleRelatedItems(module, allItems) {
  const moduleTopicIds = [...new Set([...(module.topicIds || []), ...((appState.data.maps.moduleTopic[module.id] || appState.data.maps.moduleTopic[module.slug] || []))])];
  const mappedCodingIds = new Set(appState.data.maps.moduleCoding[module.id] || appState.data.maps.moduleCoding[module.slug] || []);
  const mappedUseCaseIds = new Set(appState.data.maps.moduleUseCase[module.id] || appState.data.maps.moduleUseCase[module.slug] || []);
  return allItems.filter((item) =>
    (item.moduleIds || []).includes(module.id) ||
    intersects(item.topicIds || [], moduleTopicIds) ||
    mappedCodingIds.has(item.id) ||
    mappedUseCaseIds.has(item.id)
  );
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

function setAppHtml(html) {
  appMain.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function renderRoute() {
  const route = parseHash();
  appState.route = route;
  if (globalSearchInput) {
    globalSearchInput.value = route.query.q || '';
  }
  if (sidebar && window.innerWidth <= 980) {
    sidebar.classList.remove('open');
  }

  const segments = route.segments;
  const content = [...appState.data.theory, ...appState.data.coding, ...appState.data.useCases];

  if (!segments.length || segments[0] === 'home') {
    setPageHeading('ServiceNow Interview Hub', '/home');
    setAppHtml(renderHome(appState));
    return;
  }

  if (segments[0] === 'roles' && segments.length === 1) {
    setPageHeading('Roles', '/roles');
    setAppHtml(renderRolesPage(appState));
    return;
  }

  if (segments[0] === 'roles' && segments[1]) {
    const role = findEntity(appState.data.roles, segments[1]);
    if (!role) {
      setPageHeading('Not found', route.path);
      setAppHtml(renderNotFound());
      return;
    }
    const related = getRoleRelatedItems(role, content);
    setPageHeading(role.name, `/roles/${role.slug}`);
    setAppHtml(renderRoleDetail(appState, role, related));
    trackEvent('role_open', { role_id: role.id, role_name: role.name });
    return;
  }

  if (segments[0] === 'modules' && segments.length === 1) {
    setPageHeading('Modules', '/modules');
    setAppHtml(renderModulesPage(appState));
    return;
  }

  if (segments[0] === 'modules' && segments[1]) {
    const module = findEntity(appState.data.modules, segments[1]);
    if (!module) {
      setPageHeading('Not found', route.path);
      setAppHtml(renderNotFound());
      return;
    }
    const related = getModuleRelatedItems(module, content);
    setPageHeading(module.name, `/modules/${module.slug}`);
    setAppHtml(renderModuleDetail(appState, module, related));
    trackEvent('module_open', { module_id: module.id, module_name: module.name });
    return;
  }

  if (segments[0] === 'topics' && segments.length === 1) {
    const filters = routeQueryFilters(route);
    setPageHeading('Topics', '/topics');
    setAppHtml(renderTopicsPage(appState, filters));
    return;
  }

  if (segments[0] === 'topics' && segments[1]) {
    const topic = findEntity(appState.data.topics, segments[1]);
    if (!topic) {
      setPageHeading('Not found', route.path);
      setAppHtml(renderNotFound());
      return;
    }
    const related = content.filter((item) => (item.topicIds || []).includes(topic.id));
    setPageHeading(topic.name, `/topics/${topic.slug}`);
    setAppHtml(renderTopicDetail(appState, topic, related));
    trackEvent('topic_open', { topic_id: topic.id, topic_name: topic.name });
    return;
  }

  if (segments[0] === 'coding' && segments.length === 1) {
    const filters = routeQueryFilters(route);
    const items = filterStudyItems(appState.data.coding, filters);
    setPageHeading('Coding Questions', '/coding');
    setAppHtml(renderCodingPage(appState, items, filters));
    return;
  }

  if (segments[0] === 'coding' && segments[1]) {
    const item = findEntity(appState.data.coding, segments[1]);
    if (!item) {
      setPageHeading('Not found', route.path);
      setAppHtml(renderNotFound());
      return;
    }
    setPageHeading(item.title, `/coding/${item.slug}`);
    setAppHtml(renderCodingDetail(appState, item, relatedItemsFor(item)));
    trackEvent('coding_open', { item_id: item.id, title: item.title });
    return;
  }

  if (segments[0] === 'use-cases' && segments.length === 1) {
    const filters = routeQueryFilters(route);
    const items = filterStudyItems(appState.data.useCases, filters);
    setPageHeading('Use Cases', '/use-cases');
    setAppHtml(renderUseCasesPage(appState, items, filters));
    return;
  }

  if (segments[0] === 'use-cases' && segments[1]) {
    const item = findEntity(appState.data.useCases, segments[1]);
    if (!item) {
      setPageHeading('Not found', route.path);
      setAppHtml(renderNotFound());
      return;
    }
    setPageHeading(item.title, `/use-cases/${item.slug}`);
    setAppHtml(renderUseCaseDetail(appState, item, relatedItemsFor(item)));
    trackEvent('usecase_open', { item_id: item.id, title: item.title });
    return;
  }

  if (segments[0] === 'study' && segments[1]) {
    const item = findEntity(appState.data.theory, segments[1]);
    if (!item) {
      setPageHeading('Not found', route.path);
      setAppHtml(renderNotFound());
      return;
    }
    setPageHeading(item.title, `/study/${item.slug}`);
    setAppHtml(renderStudyDetail(appState, item, relatedItemsFor(item)));
    trackEvent('topic_open', { item_id: item.id, title: item.title, type: item.contentType });
    return;
  }

  if (segments[0] === 'search') {
    const query = route.query.q || '';
    const results = searchIndex(appState.data.searchIndex, query);
    setPageHeading('Search', '/search');
    setAppHtml(renderSearchResults(query, results, appState));
    if (query) trackEvent('search_used', { query, results: results.length });
    return;
  }

  if (segments[0] === 'bookmarks') {
    setPageHeading('Bookmarks', '/bookmarks');
    setAppHtml(renderBookmarksPage(appState));
    return;
  }

  if (segments[0] === 'quiz') {
    setPageHeading('Quiz', '/quiz');
    if (!appState.quizSession) {
      setAppHtml(renderQuizSetup(appState));
      return;
    }

    if (appState.quizSession.result) {
      setAppHtml(renderQuizResults(appState.quizSession.result, appState));
      return;
    }

    setAppHtml(renderQuizRunner(appState.quizSession));
    return;
  }

  setPageHeading('Not found', route.path);
  setAppHtml(renderNotFound());
}

function currentContentItem(id) {
  return appState.lookups.contentById[id];
}

function handleGlobalSearchSubmit(event) {
  event.preventDefault();
  const query = globalSearchInput.value.trim();
  navigate('/search', { q: query });
}

function handleBackButtonClick(button) {
  const fallback = button.dataset.fallback || '#/home';

  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.location.hash = fallback;
}

function handleBookmarkClick(button) {
  const item = currentContentItem(button.dataset.bookmarkId);
  if (!item) return;

  const result = toggleBookmark({
    id: item.id,
    type: item.contentType,
    title: item.title,
    slug: item.slug
  });

  button.classList.toggle('active', result.active);
  button.title = result.active ? 'Remove bookmark' : 'Save bookmark';

  trackEvent(result.active ? 'bookmark_add' : 'bookmark_remove', {
    item_id: item.id,
    item_type: item.contentType
  });
}

function handleFilterForm(form) {
  const data = new FormData(form);
  const route = form.dataset.filterForm || '/coding';
  navigate(route, {
    role: data.get('role') || '',
    module: data.get('module') || '',
    topic: data.get('topic') || '',
    difficulty: data.get('difficulty') || '',
    q: data.get('q') || '',
    category: data.get('category') || ''
  });
  trackEvent('filter_used', { route });
}

function handleQuizSetup(form) {
  const data = new FormData(form);
  const scope = data.get('scope') || 'mixed';

  let value = '';
  if (scope === 'role') value = data.get('roleValue') || '';
  if (scope === 'module') value = data.get('moduleValue') || '';
  if (scope === 'topic') value = data.get('topicValue') || '';

  const options = {
    scope,
    value,
    difficulty: data.get('difficulty') || '',
    count: Number(data.get('count') || 10)
  };

  const questions = buildQuiz(appState.data.quizzes, options);

  if (!questions.length) {
    window.alert('No quiz questions match this selection yet. Try mixed scope or broader filters.');
    return;
  }

  appState.quizSession = {
    options: { ...options, requestedCount: options.count },
    questions,
    currentIndex: 0,
    answers: {}
  };

  trackEvent('quiz_start', { scope, value, count: options.count, questions_loaded: questions.length });
  renderRoute();
}

function handleQuizChoice(choiceIndex) {
  if (!appState.quizSession) return;
  appState.quizSession.answers[appState.quizSession.currentIndex] = Number(choiceIndex);
  renderRoute();
}

function handleQuizNext() {
  const session = appState.quizSession;
  if (!session) return;

  if (session.answers[session.currentIndex] === undefined) {
    window.alert('Select an answer before moving on.');
    return;
  }

  if (session.currentIndex === session.questions.length - 1) {
    session.result = gradeQuiz(session, session.answers);
    trackEvent('quiz_complete', {
      correct: session.result.correct,
      total: session.result.total,
      percentage: session.result.percentage
    });
  } else {
    session.currentIndex += 1;
    trackEvent('quiz_submit', { question_number: session.currentIndex });
  }
  renderRoute();
}

function resetQuiz() {
  appState.quizSession = null;
  renderRoute();
}

function bindGlobalEvents() {
  window.addEventListener('hashchange', renderRoute);

  globalSearchForm.addEventListener('submit', handleGlobalSearchSubmit);

  mobileNavToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.addEventListener('click', (event) => {
    const target = event.target;

    if (target.closest('[data-back-button]')) {
      handleBackButtonClick(target.closest('[data-back-button]'));
      return;
    }

    if (target.closest('[data-bookmark-id]')) {
      handleBookmarkClick(target.closest('[data-bookmark-id]'));
      return;
    }

    if (target.matches('[data-quiz-choice]')) {
      handleQuizChoice(target.dataset.quizChoice);
      return;
    }

    if (target.matches('[data-quiz-next]')) {
      handleQuizNext();
      return;
    }

    if (target.matches('[data-quiz-reset]')) {
      resetQuiz();
      return;
    }

    if (target.closest('[data-support-link]')) {
      const link = target.closest('[data-support-link]');
      trackEvent('support_click', {
        provider: link.dataset.supportLink || 'cashapp',
        location: link.classList.contains('support-button') ? 'home-hero' : 'sidebar'
      });
      return;
    }

    if (target.closest('.sidebar-nav a') && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }
  });

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (target.matches('[data-filter-control]')) {
      const form = target.closest('[data-filter-form]');
      if (form) handleFilterForm(form);
    }
  });

  document.addEventListener('submit', (event) => {
    const target = event.target;

    if (target.matches('[data-filter-form]')) {
      event.preventDefault();
      handleFilterForm(target);
      return;
    }

    if (target.matches('[data-quiz-form]')) {
      event.preventDefault();
      handleQuizSetup(target);
    }
  });
}

async function init() {
  bindGlobalEvents();

  try {
    appState.data = await loadAllData();
    buildLookups();
    updateSidebarStats();
    appState.loaded = true;
    renderRoute();
  } catch (error) {
    console.error(error);
    setAppHtml(`
      <section class="card empty-state">
        <h2>Failed to load interview hub data</h2>
        <p>${error.message}</p>
      </section>
    `);
  }
}

init();
