import { makeHash } from './router.js';
import { filterStudyItems } from './filters.js';
import { appState } from './state.js';

function normalizeText(value) {
  return `${value || ''}`.toLowerCase();
}

function parseHashHref(href = '') {
  const raw = href.replace(/^#/, '');
  const [pathPart, queryString = ''] = raw.split('?');
  return {
    path: pathPart.startsWith('/') ? pathPart : `/${pathPart}`,
    query: Object.fromEntries(new URLSearchParams(queryString).entries())
  };
}

function mergeHashQuery(href, extraQuery = {}) {
  const parsed = parseHashHref(href);
  return makeHash(parsed.path, { ...parsed.query, ...extraQuery });
}

function ensureOption(select, value, label) {
  if (!select || select.querySelector(`option[value="${value}"]`)) return;
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  select.prepend(option);
}

function clearSelectValue(select) {
  if (select) select.value = '';
}

export function syncProgressiveQuizForm(form) {
  if (!form) return;

  form.classList.add('quiz-progressive-form');

  const scopeSelect = form.querySelector('[data-quiz-scope]');
  const scopeWrapper = scopeSelect?.closest('label');
  const roleWrapper = form.querySelector('[data-quiz-field="role"]');
  const moduleWrapper = form.querySelector('[data-quiz-field="module"]');
  const topicWrapper = form.querySelector('[data-quiz-field="topic"]');
  const difficultyWrapper = [...form.querySelectorAll('label')].find((label) => label.querySelector('[name="difficulty"]'));
  const countWrapper = [...form.querySelectorAll('label')].find((label) => label.querySelector('[name="count"]'));
  const submitWrapper = form.querySelector('.hero-actions');
  const difficultySelect = difficultyWrapper?.querySelector('select');
  const countSelect = countWrapper?.querySelector('select');
  const roleSelect = roleWrapper?.querySelector('select');
  const moduleSelect = moduleWrapper?.querySelector('select');
  const topicSelect = topicWrapper?.querySelector('select');

  scopeWrapper?.classList.add('quiz-step-scope');
  roleWrapper?.classList.add('quiz-step-entity');
  moduleWrapper?.classList.add('quiz-step-entity');
  topicWrapper?.classList.add('quiz-step-entity');
  difficultyWrapper?.classList.add('quiz-step-half');
  countWrapper?.classList.add('quiz-step-half');
  submitWrapper?.classList.add('quiz-step-actions');

  if (!form.dataset.progressiveQuizInit) {
    ensureOption(scopeSelect, '', 'Select scope');
    ensureOption(difficultySelect, '', 'Select difficulty');
    ensureOption(countSelect, '', 'Select count');
    clearSelectValue(scopeSelect);
    clearSelectValue(roleSelect);
    clearSelectValue(moduleSelect);
    clearSelectValue(topicSelect);
    clearSelectValue(difficultySelect);
    clearSelectValue(countSelect);
    form.dataset.progressiveQuizInit = 'true';
  }

  const scope = scopeSelect?.value || '';

  [['role', roleWrapper, roleSelect], ['module', moduleWrapper, moduleSelect], ['topic', topicWrapper, topicSelect]].forEach(([field, wrapper, select]) => {
    const active = scope === field;
    if (wrapper) wrapper.hidden = !active;
    if (select) {
      select.disabled = !active;
      if (!active) clearSelectValue(select);
    }
  });

  const selectedScopeValue = scope === 'role'
    ? roleSelect?.value
    : scope === 'module'
      ? moduleSelect?.value
      : scope === 'topic'
        ? topicSelect?.value
        : '';

  const canShowDifficulty = Boolean(scope) && (scope === 'mixed' || Boolean(selectedScopeValue));
  if (difficultyWrapper) difficultyWrapper.hidden = !canShowDifficulty;
  if (difficultySelect) {
    difficultySelect.disabled = !canShowDifficulty;
    if (!canShowDifficulty) clearSelectValue(difficultySelect);
  }

  const canShowCount = canShowDifficulty && Boolean(difficultySelect?.value);
  if (countWrapper) countWrapper.hidden = !canShowCount;
  if (countSelect) {
    countSelect.disabled = !canShowCount;
    if (!canShowCount) clearSelectValue(countSelect);
  }

  const canShowSubmit = canShowCount && Boolean(countSelect?.value);
  if (submitWrapper) submitWrapper.hidden = !canShowSubmit;
}

export function ensurePageEnhancementStyles() {
  if (document.getElementById('page-enhancement-styles')) return;
  const styleNode = document.createElement('style');
  styleNode.id = 'page-enhancement-styles';
  styleNode.textContent = `
    .page-back-wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
    .detail-pager{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-left:auto;}
    .detail-nav-button{min-height:40px;border-radius:999px;border:1px solid var(--border);background:rgba(255,255,255,.03);color:var(--text);display:inline-flex;align-items:center;justify-content:center;padding:0 14px;font-size:.95rem;font-weight:600;cursor:pointer;text-decoration:none;}
    .detail-nav-button:hover{border-color:rgba(56,189,248,.35);background:rgba(56,189,248,.08);}
    .detail-nav-button.is-disabled{opacity:.35;pointer-events:none;}
    .clickable-card{cursor:pointer;}
    .tricky-page-banner ~ .grid .badge.green{display:none;}
    .quiz-progressive-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:end;max-width:820px;}
    .quiz-progressive-form label{display:flex;flex-direction:column;gap:8px;min-width:0;}
    .quiz-progressive-form .quiz-step-scope,
    .quiz-progressive-form .quiz-step-entity,
    .quiz-progressive-form .quiz-step-actions{grid-column:1 / -1;}
    .quiz-progressive-form .quiz-step-actions{display:flex;justify-content:flex-start;}
    .quiz-progressive-form select,
    .quiz-progressive-form input{width:100%;}
    @media (max-width:720px){
      .quiz-progressive-form{grid-template-columns:1fr;}
      .quiz-progressive-form .quiz-step-half{grid-column:1 / -1;}
    }
  `;
  document.head.appendChild(styleNode);
}

function filterRolesForNavigation(appStateArg, query = {}) {
  const q = normalizeText(query.q);
  return [...appStateArg.data.roles]
    .filter((role) => !q || normalizeText(`${role.name} ${role.summary || ''} ${role.category || ''}`).includes(q))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function filterModulesForNavigation(appStateArg, query = {}) {
  const q = normalizeText(query.q);
  return [...appStateArg.data.modules]
    .filter((module) => !q || normalizeText(`${module.name} ${module.summary || ''} ${module.category || ''}`).includes(q))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function filterTopicsForNavigation(appStateArg, query = {}) {
  const q = normalizeText(query.q);
  return [...appStateArg.data.topics]
    .filter((topic) => (!query.category || topic.category === query.category) && (!q || normalizeText(`${topic.name} ${topic.category || ''}`).includes(q)))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getRoleTopicList(appStateArg, role, allItems, getRoleRelatedItems) {
  if (!role) return [];
  const related = getRoleRelatedItems(role, allItems);
  const topicIds = [...new Set([...(role.topicIds || []), ...((appStateArg.data.maps.roleTopic[role.id] || appStateArg.data.maps.roleTopic[role.slug] || [])), ...related.flatMap((item) => item.topicIds || [])])];
  return topicIds.map((id) => appStateArg.lookups.topicsById[id]).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
}

function getModuleTopicList(appStateArg, module, allItems, getModuleRelatedItems) {
  if (!module) return [];
  const related = getModuleRelatedItems(module, allItems);
  const topicIds = [...new Set([...(module.topicIds || []), ...((appStateArg.data.maps.moduleTopic[module.id] || appStateArg.data.maps.moduleTopic[module.slug] || [])), ...related.flatMap((item) => item.topicIds || [])])];
  return topicIds.map((id) => appStateArg.lookups.topicsById[id]).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
}

function enhanceScopedLinks({ appState: appStateArg, route, findEntity }) {
  if (route.segments[0] === 'coding' && route.segments.length === 1) {
    const extra = { ...route.query, from: '/coding' };
    document.querySelectorAll('.item-card .link-arrow').forEach((link) => {
      link.setAttribute('href', mergeHashQuery(link.getAttribute('href') || '', extra));
    });
  }

  if (route.segments[0] === 'use-cases' && route.segments.length === 1) {
    const extra = { ...route.query, from: '/use-cases' };
    document.querySelectorAll('.item-card .link-arrow').forEach((link) => {
      link.setAttribute('href', mergeHashQuery(link.getAttribute('href') || '', extra));
    });
  }

  if (route.segments[0] === 'tricky' && route.segments.length === 1) {
    const extra = { ...route.query, from: '/tricky' };
    document.querySelectorAll('.item-card .link-arrow').forEach((link) => {
      link.setAttribute('href', mergeHashQuery(link.getAttribute('href') || '', extra));
    });
  }

  if (route.segments[0] === 'roles' && route.segments.length === 1) {
    const extra = { ...route.query, from: '/roles' };
    document.querySelectorAll('.entity-card-link[href^="#/roles/"]').forEach((link) => {
      link.setAttribute('href', mergeHashQuery(link.getAttribute('href') || '', extra));
    });
  }

  if (route.segments[0] === 'modules' && route.segments.length === 1) {
    const extra = { ...route.query, from: '/modules' };
    document.querySelectorAll('.entity-card-link[href^="#/modules/"]').forEach((link) => {
      link.setAttribute('href', mergeHashQuery(link.getAttribute('href') || '', extra));
    });
  }

  if (route.segments[0] === 'topics' && route.segments.length === 1) {
    const extra = { ...route.query, from: '/topics' };
    document.querySelectorAll('.entity-card-link[href^="#/topics/"]').forEach((link) => {
      link.setAttribute('href', mergeHashQuery(link.getAttribute('href') || '', extra));
    });
  }

  if (route.segments[0] === 'roles' && route.segments[1]) {
    const role = findEntity(appStateArg.data.roles, route.segments[1]);
    if (!role) return;
    const extra = { scopeType: 'role', scopeId: role.id, backPath: `/roles/${role.slug}` };
    document.querySelectorAll('.topic-nav-grid .entity-card-link[href^="#/topics/"]').forEach((link) => {
      link.setAttribute('href', mergeHashQuery(link.getAttribute('href') || '', extra));
    });
  }

  if (route.segments[0] === 'modules' && route.segments[1]) {
    const module = findEntity(appStateArg.data.modules, route.segments[1]);
    if (!module) return;
    const extra = { scopeType: 'module', scopeId: module.id, backPath: `/modules/${module.slug}` };
    document.querySelectorAll('.topic-nav-grid .entity-card-link[href^="#/topics/"]').forEach((link) => {
      link.setAttribute('href', mergeHashQuery(link.getAttribute('href') || '', extra));
    });
  }
}

function enhanceClickableCards() {
  document.querySelectorAll('.item-card').forEach((card) => {
    const link = card.querySelector('.link-arrow');
    if (!link) return;
    card.classList.add('clickable-card');
    card.setAttribute('tabindex', '0');
    card.dataset.openRoute = link.getAttribute('href') || '';
  });
}

function enhanceQuizRunnerPage() {
  const actions = document.querySelector('.quiz-question .hero-actions');
  if (!actions) return;
  if (!actions.querySelector('[data-quiz-exit]')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button secondary';
    button.dataset.quizExit = 'true';
    button.textContent = 'Exit quiz';
    button.addEventListener('click', () => {
      appState.quizSession = null;
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    actions.appendChild(button);
  }
}

function buildDetailPager({ appState: appStateArg, route, getRoleRelatedItems, getModuleRelatedItems, routeQueryFilters }) {
  const content = [...appStateArg.data.theory, ...appStateArg.data.coding, ...appStateArg.data.useCases];
  let items = [];
  let pathPrefix = '';
  const currentSlug = route.segments[1] || '';

  if (route.segments[0] === 'roles' && route.segments[1]) {
    items = filterRolesForNavigation(appStateArg, route.query);
    pathPrefix = '/roles';
  } else if (route.segments[0] === 'coding' && route.segments[1]) {
    items = filterStudyItems(appStateArg.data.coding, routeQueryFilters(route), appStateArg).sort((a, b) => a.title.localeCompare(b.title));
    pathPrefix = '/coding';
  } else if (route.segments[0] === 'use-cases' && route.segments[1]) {
    items = filterStudyItems(appStateArg.data.useCases, routeQueryFilters(route), appStateArg).sort((a, b) => a.title.localeCompare(b.title));
    pathPrefix = '/use-cases';
  } else if (route.segments[0] === 'modules' && route.segments[1]) {
    items = filterModulesForNavigation(appStateArg, route.query);
    pathPrefix = '/modules';
  } else if (route.segments[0] === 'topics' && route.segments[1]) {
    if (route.query.scopeType === 'role') {
      items = getRoleTopicList(appStateArg, appStateArg.lookups.rolesById[route.query.scopeId], content, getRoleRelatedItems);
    } else if (route.query.scopeType === 'module') {
      items = getModuleTopicList(appStateArg, appStateArg.lookups.modulesById[route.query.scopeId], content, getModuleRelatedItems);
    } else {
      items = filterTopicsForNavigation(appStateArg, route.query);
    }
    pathPrefix = '/topics';
  } else {
    return '';
  }

  const index = items.findIndex((item) => item.slug === currentSlug || item.id === currentSlug);
  if (index < 0) return '';

  const previousItem = items[index - 1] || null;
  const nextItem = items[index + 1] || null;
  const previousHash = previousItem ? makeHash(`${pathPrefix}/${previousItem.slug}`, route.query) : '';
  const nextHash = nextItem ? makeHash(`${pathPrefix}/${nextItem.slug}`, route.query) : '';

  return `
    <div class="detail-pager">
      ${previousHash ? `<a class="detail-nav-button" href="${previousHash}" aria-label="Open previous item">← Previous</a>` : `<span class="detail-nav-button is-disabled" aria-hidden="true">← Previous</span>`}
      ${nextHash ? `<a class="detail-nav-button" href="${nextHash}" aria-label="Open next item">Next →</a>` : `<span class="detail-nav-button is-disabled" aria-hidden="true">Next →</span>`}
    </div>
  `;
}

function enhanceDetailNavigation(args) {
  const pagerHtml = buildDetailPager(args);
  if (!pagerHtml) return;
  const backWrap = document.querySelector('.page-back-wrap');
  if (backWrap && !backWrap.querySelector('.detail-pager')) {
    backWrap.insertAdjacentHTML('beforeend', pagerHtml);
  }
}

function enhanceBackButtonFallback({ route }) {
  const backButton = document.querySelector('[data-back-button]');
  if (!backButton || route.segments.length < 2) return;

  if (route.segments[0] === 'topics' && route.query.backPath) {
    backButton.dataset.fallback = makeHash(route.query.backPath);
    backButton.dataset.forceFallback = 'true';
    return;
  }

  if (route.segments[0] === 'roles') {
    backButton.dataset.fallback = makeHash(route.query.from || '/roles', { q: route.query.q || '' });
    backButton.dataset.forceFallback = 'true';
    return;
  }

  if (route.segments[0] === 'coding') {
    backButton.dataset.fallback = makeHash(route.query.from || '/coding', {
      role: route.query.role || '',
      module: route.query.module || '',
      topic: route.query.topic || '',
      difficulty: route.query.difficulty || '',
      q: route.query.q || ''
    });
    backButton.dataset.forceFallback = 'true';
    return;
  }

  if (route.segments[0] === 'use-cases') {
    backButton.dataset.fallback = makeHash(route.query.from || '/use-cases', {
      role: route.query.role || '',
      module: route.query.module || '',
      topic: route.query.topic || '',
      difficulty: route.query.difficulty || '',
      q: route.query.q || ''
    });
    backButton.dataset.forceFallback = 'true';
    return;
  }

  if (route.segments[0] === 'modules') {
    backButton.dataset.fallback = makeHash(route.query.from || '/modules', { q: route.query.q || '' });
    backButton.dataset.forceFallback = 'true';
  }
}

export function enhancePageUi(args) {
  ensurePageEnhancementStyles();
  enhanceScopedLinks(args);
  enhanceClickableCards();
  enhanceBackButtonFallback(args);
  enhanceDetailNavigation(args);
  enhanceQuizRunnerPage();
}
