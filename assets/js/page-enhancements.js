import { makeHash } from './router.js';

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

export function syncProgressiveQuizForm(form) {
  if (!form) return;

  const scopeSelect = form.querySelector('[data-quiz-scope]');
  const roleWrapper = form.querySelector('[data-quiz-field="role"]');
  const moduleWrapper = form.querySelector('[data-quiz-field="module"]');
  const topicWrapper = form.querySelector('[data-quiz-field="topic"]');
  const difficultyWrapper = [...form.querySelectorAll('label')].find((label) => label.querySelector('[name="difficulty"]'));
  const countWrapper = [...form.querySelectorAll('label')].find((label) => label.querySelector('[name="count"]'));
  const submitWrapper = form.querySelector('.hero-actions');
  const difficultySelect = difficultyWrapper?.querySelector('select');
  const countSelect = countWrapper?.querySelector('select');

  if (!form.dataset.progressiveQuizInit) {
    ensureOption(scopeSelect, '', 'Select scope');
    ensureOption(difficultySelect, '', 'Select difficulty');
    ensureOption(difficultySelect, 'all', 'All levels');
    ensureOption(countSelect, '', 'Select count');
    if (scopeSelect) scopeSelect.value = '';
    if (difficultySelect) difficultySelect.value = '';
    if (countSelect) countSelect.value = '';
    form.dataset.progressiveQuizInit = 'true';
  }

  const scope = scopeSelect?.value || '';
  const roleSelect = roleWrapper?.querySelector('select');
  const moduleSelect = moduleWrapper?.querySelector('select');
  const topicSelect = topicWrapper?.querySelector('select');

  ['role', 'module', 'topic'].forEach((field) => {
    const wrapper = form.querySelector(`[data-quiz-field="${field}"]`);
    const select = wrapper?.querySelector('select');
    const active = scope === field;
    if (wrapper) wrapper.hidden = !active;
    if (select) select.disabled = !active;
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
  if (difficultySelect) difficultySelect.disabled = !canShowDifficulty;

  const canShowCount = canShowDifficulty && Boolean(difficultySelect?.value);
  if (countWrapper) countWrapper.hidden = !canShowCount;
  if (countSelect) countSelect.disabled = !canShowCount;

  const canShowSubmit = canShowCount && Boolean(countSelect?.value);
  if (submitWrapper) submitWrapper.hidden = !canShowSubmit;
}

export function ensurePageEnhancementStyles() {
  if (document.getElementById('page-enhancement-styles')) return;
  const styleNode = document.createElement('style');
  styleNode.id = 'page-enhancement-styles';
  styleNode.textContent = `
    .page-back-wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
    .detail-pager{display:flex;align-items:center;gap:8px;}
    .detail-nav-button{width:40px;height:40px;border-radius:999px;border:1px solid var(--border);background:rgba(255,255,255,.03);color:var(--text);display:inline-flex;align-items:center;justify-content:center;font-size:1.1rem;cursor:pointer;}
    .detail-nav-button:hover:not(:disabled){border-color:rgba(56,189,248,.35);background:rgba(56,189,248,.08);}
    .detail-nav-button:disabled{opacity:.35;cursor:not-allowed;}
    .clickable-card{cursor:pointer;}
    .tricky-page-banner ~ .grid .badge.green{display:none;}
  `;
  document.head.appendChild(styleNode);
}

function filterModulesForNavigation(appState, query = {}) {
  const q = normalizeText(query.q);
  return [...appState.data.modules]
    .filter((module) => !q || normalizeText(`${module.name} ${module.summary || ''} ${module.category || ''}`).includes(q))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function filterTopicsForNavigation(appState, query = {}) {
  const q = normalizeText(query.q);
  return [...appState.data.topics]
    .filter((topic) => (!query.category || topic.category === query.category) && (!q || normalizeText(`${topic.name} ${topic.category || ''}`).includes(q)))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getRoleTopicList(appState, role, allItems, getRoleRelatedItems) {
  if (!role) return [];
  const related = getRoleRelatedItems(role, allItems);
  const topicIds = [...new Set([...(role.topicIds || []), ...((appState.data.maps.roleTopic[role.id] || appState.data.maps.roleTopic[role.slug] || [])), ...related.flatMap((item) => item.topicIds || [])])];
  return topicIds.map((id) => appState.lookups.topicsById[id]).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
}

function getModuleTopicList(appState, module, allItems, getModuleRelatedItems) {
  if (!module) return [];
  const related = getModuleRelatedItems(module, allItems);
  const topicIds = [...new Set([...(module.topicIds || []), ...((appState.data.maps.moduleTopic[module.id] || appState.data.maps.moduleTopic[module.slug] || [])), ...related.flatMap((item) => item.topicIds || [])])];
  return topicIds.map((id) => appState.lookups.topicsById[id]).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
}

function enhanceScopedLinks({ appState, route, findEntity, getRoleRelatedItems, getModuleRelatedItems }) {
  const content = [...appState.data.theory, ...appState.data.coding, ...appState.data.useCases];

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
    const role = findEntity(appState.data.roles, route.segments[1]);
    if (!role) return;
    const extra = { scopeType: 'role', scopeId: role.id, backPath: `/roles/${role.slug}` };
    document.querySelectorAll('.topic-nav-grid .entity-card-link[href^="#/topics/"]').forEach((link) => {
      link.setAttribute('href', mergeHashQuery(link.getAttribute('href') || '', extra));
    });
  }

  if (route.segments[0] === 'modules' && route.segments[1]) {
    const module = findEntity(appState.data.modules, route.segments[1]);
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

function buildDetailPager({ appState, route, findEntity, getRoleRelatedItems, getModuleRelatedItems, routeQueryFilters }) {
  const content = [...appState.data.theory, ...appState.data.coding, ...appState.data.useCases];
  let items = [];
  let pathPrefix = '';
  const currentSlug = route.segments[1] || '';

  if (route.segments[0] === 'coding' && route.segments[1]) {
    items = appState.data.coding.filter((item) => {
      const filters = routeQueryFilters(route);
      return (!filters.role || (item.roleIds || []).includes(filters.role))
        && (!filters.module || (item.moduleIds || []).includes(filters.module))
        && (!filters.topic || (item.topicIds || []).includes(filters.topic))
        && (!filters.difficulty || item.difficulty === filters.difficulty)
        && (!filters.q || normalizeText(`${item.title} ${item.question} ${item.summary || ''}`).includes(normalizeText(filters.q)));
    });
    pathPrefix = '/coding';
  } else if (route.segments[0] === 'use-cases' && route.segments[1]) {
    items = appState.data.useCases.filter((item) => {
      const filters = routeQueryFilters(route);
      return (!filters.role || (item.roleIds || []).includes(filters.role))
        && (!filters.module || (item.moduleIds || []).includes(filters.module))
        && (!filters.topic || (item.topicIds || []).includes(filters.topic))
        && (!filters.difficulty || item.difficulty === filters.difficulty)
        && (!filters.q || normalizeText(`${item.title} ${item.question} ${item.summary || ''}`).includes(normalizeText(filters.q)));
    });
    pathPrefix = '/use-cases';
  } else if (route.segments[0] === 'modules' && route.segments[1]) {
    items = filterModulesForNavigation(appState, route.query);
    pathPrefix = '/modules';
  } else if (route.segments[0] === 'topics' && route.segments[1]) {
    if (route.query.scopeType === 'role') {
      items = getRoleTopicList(appState, appState.lookups.rolesById[route.query.scopeId], content, getRoleRelatedItems);
    } else if (route.query.scopeType === 'module') {
      items = getModuleTopicList(appState, appState.lookups.modulesById[route.query.scopeId], content, getModuleRelatedItems);
    } else {
      items = filterTopicsForNavigation(appState, route.query);
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
      <button type="button" class="detail-nav-button" ${previousHash ? `data-open-route="${previousHash}" title="Previous"` : 'disabled title="Previous"'} aria-label="Previous">←</button>
      <button type="button" class="detail-nav-button" ${nextHash ? `data-open-route="${nextHash}" title="Next"` : 'disabled title="Next"'} aria-label="Next">→</button>
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
}
