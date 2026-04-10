import { loadAllData } from './loaders.js';
import { appState } from './state.js';
import { parseHash, navigate } from './router.js';
import { filterStudyItems } from './filters.js';
import { searchIndex } from './search.js';
import { toggleBookmark } from './bookmarks.js';
import { buildQuiz, gradeQuiz } from './quiz.js';
import { trackEvent, trackPageView } from './analytics.js';
import { escapeHtml } from './utils.js';
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
import { enhanceTopicDetailPage, ensureEnhancementAssets, renderTrickyPage } from './topic-enhancements.js';
import { enhancePageUi, syncProgressiveQuizForm } from './page-enhancements.js';

const appMain = document.getElementById('app-main');
const pageTitleNode = document.getElementById('page-title');
const globalSearchForm = document.getElementById('global-search-form');
const globalSearchInput = document.getElementById('global-search-input');
const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const sidebar = document.querySelector('.sidebar');
const QUIZ_COUNTS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
const TRICKY_CONTENT_TYPES = ['tricky', 'comparison', 'troubleshooting'];

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
  appState.lookups.topicOverviewByTopicId = Object.fromEntries((appState.data.topicOverviews || []).map((item) => [item.topicId, item]));
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

function getTrickyStudyItems(allItems = []) {
  return allItems.filter((item) => TRICKY_CONTENT_TYPES.includes(item.contentType));
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

function buildQuizSetupMarkup() {
  return `
    <div class="section-header">
      <div>
        <h2>Quiz</h2>
        <p>Choose the scope first, then select the matching role, module, or topic, set difficulty, choose the number of questions, and start the round.</p>
      </div>
    </div>
    <form id="quiz-setup-form" class="filters" data-quiz-form>
      <label>
        Scope
        <select name="scope" data-quiz-scope>
          <option value="mixed">Mixed</option>
          <option value="role">Role</option>
          <option value="module">Module</option>
          <option value="topic">Topic</option>
        </select>
      </label>
      <label data-quiz-field="role" hidden>
        Role
        <select name="roleValue" disabled>
          <option value="">Select a role</option>
          ${appState.data.roles.map((role) => `<option value="${escapeHtml(role.id)}">${escapeHtml(role.name)}</option>`).join('')}
        </select>
      </label>
      <label data-quiz-field="module" hidden>
        Module
        <select name="moduleValue" disabled>
          <option value="">Select a module</option>
          ${appState.data.modules.map((module) => `<option value="${escapeHtml(module.id)}">${escapeHtml(module.name)}</option>`).join('')}
        </select>
      </label>
      <label data-quiz-field="topic" hidden>
        Topic
        <select name="topicValue" disabled>
          <option value="">Select a topic</option>
          ${appState.data.topics.map((topic) => `<option value="${escapeHtml(topic.id)}">${escapeHtml(topic.name)}</option>`).join('')}
        </select>
      </label>
      <label>
        Difficulty
        <select name="difficulty">
          <option value="">All levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </label>
      <label>
        Question count
        <select name="count">
          ${QUIZ_COUNTS.map((count) => `<option value="${count}" ${count === 10 ? 'selected' : ''}>${count}</option>`).join('')}
        </select>
      </label>
      <div class="hero-actions">
        <button class="button-link" type="submit">Start quiz</button>
      </div>
    </form>
  `;
}

function syncQuizSetupForm(form) {
  syncProgressiveQuizForm(form);
}

function enhanceQuizSetupPage() {
  const quizBanner = document.querySelector('.quiz-shell .card.page-banner');
  const quizForm = quizBanner?.querySelector('[data-quiz-form]');
  if (!quizBanner || !quizForm) return;
  quizBanner.innerHTML = buildQuizSetupMarkup();
  syncQuizSetupForm(quizBanner.querySelector('[data-quiz-form]'));
}

function enhanceRenderedPage() {
  enhanceQuizSetupPage();
  enhancePageUi({
    appState,
    route: appState.route,
    findEntity,
    getRoleRelatedItems,
    getModuleRelatedItems,
    routeQueryFilters
  });
}

function setAppHtml(html) {
  appMain.innerHTML = html;
  enhanceRenderedPage();
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
    const filters = routeQueryFilters(route);
    setPageHeading('Roles', '/roles');
    setAppHtml(renderRolesPage(appState, filters));
    return;
  }

  if (segments[0] === 'roles' && segments[1]) {
    const role = findEntity(appState.data.roles, segments[1]);
    if (!role) {
      setPageHeading('Not found', route.path);
      setAppHtml(renderNotFound());
      return;
    }
    const filters = routeQueryFilters(route);
    const related = getRoleRelatedItems(role, content);
    setPageHeading(role.name, `/roles/${role.slug}`);
    setAppHtml(renderRoleDetail(appState, role, related, filters));
    trackEvent('role_open', { role_id: role.id, role_name: role.name });
    return;
  }

  if (segments[0] === 'modules' && segments.length === 1) {
    const filters = routeQueryFilters(route);
    setPageHeading('Modules', '/modules');
    setAppHtml(renderModulesPage(appState, filters));
    return;
  }

  if (segments[0] === 'modules' && segments[1]) {
    const module = findEntity(appState.data.modules, segments[1]);
    if (!module) {
      setPageHeading('Not found', route.path);
      setAppHtml(renderNotFound());
      return;
    }
    const filters = routeQueryFilters(route);
    const related = getModuleRelatedItems(module, content);
    setPageHeading(module.name, `/modules/${module.slug}`);
    setAppHtml(renderModuleDetail(appState, module, related, filters));
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
    enhanceTopicDetailPage(appState, topic, related);
    enhanceRenderedPage();
    trackEvent('topic_open', { topic_id: topic.id, topic_name: topic.name });
    return;
  }

  if (segments[0] === 'tricky' && segments.length === 1) {
    const filters = routeQueryFilters(route);
    const items = filterStudyItems(getTrickyStudyItems(content), filters);
    setPageHeading('Tricky Questions', '/tricky');
    setAppHtml(renderTrickyPage(appState, items, filters));
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
  const forceFallback = button.dataset.forceFallback === 'true';

  if (!forceFallback && window.history.length > 1) {
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
  const scope = data.get('scope') || '';
  if (!scope) {
    window.alert('Select a scope before starting the quiz.');
    return;
  }

  let value = '';
  if (scope === 'role') value = data.get('roleValue') || '';
  if (scope === 'module') value = data.get('moduleValue') || '';
  if (scope === 'topic') value = data.get('topicValue') || '';

  if (scope === 'role' && !value) {
    window.alert('Select a role before starting the quiz.');
    return;
  }
  if (scope === 'module' && !value) {
    window.alert('Select a module before starting the quiz.');
    return;
  }
  if (scope === 'topic' && !value) {
    window.alert('Select a topic before starting the quiz.');
    return;
  }

  const selectedDifficulty = data.get('difficulty') || '';
  if (!selectedDifficulty) {
    window.alert('Select a difficulty before starting the quiz.');
    return;
  }

  const selectedCount = Number(data.get('count') || 0);
  if (!selectedCount) {
    window.alert('Select how many questions you want before starting the quiz.');
    return;
  }

  const options = {
    scope,
    value,
    difficulty: selectedDifficulty === 'all' ? '' : selectedDifficulty,
    count: selectedCount
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

    if (target.closest('[data-scroll-target]')) {
      const trigger = target.closest('[data-scroll-target]');
      const sectionId = trigger.dataset.scrollTarget;
      const destination = document.getElementById(sectionId);
      if (destination) {
        destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (target.closest('[data-bookmark-id]')) {
      handleBookmarkClick(target.closest('[data-bookmark-id]'));
      return;
    }

    const openTarget = target.closest('[data-open-route]');
    if (openTarget && !target.closest('a,button,[data-bookmark-id]')) {
      window.location.hash = openTarget.dataset.openRoute;
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

  document.addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-open-route]')) {
      event.preventDefault();
      window.location.hash = event.target.dataset.openRoute;
    }
  });

  document.addEventListener('change', (event) => {
    const target = event.target;

    if (target.matches('[data-quiz-form] select, [data-quiz-scope]')) {
      const form = target.closest('[data-quiz-form]');
      if (form) syncQuizSetupForm(form);
      if (target.matches('[data-quiz-scope]')) return;
    }

    if (target.matches('[data-filter-control]')) {
      const form = target.closest('[data-filter-form]');
      if (form && form.dataset.autoSubmit !== 'false') handleFilterForm(form);
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
  ensureEnhancementAssets();

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