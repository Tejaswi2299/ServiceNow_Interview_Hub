
import { buildMetaChips, escapeHtml, formatCount, truncate, unique } from './utils.js';
import { isBookmarked, getBookmarks } from './bookmarks.js';

function linkForItem(item) {
  if (!item) return '#/home';
  if (item.contentType === 'coding') return `#/coding/${item.slug}`;
  if (item.contentType === 'use-case') return `#/use-cases/${item.slug}`;
  if (['theory', 'comparison', 'troubleshooting', 'table-schema', 'best-practice', 'tricky'].includes(item.contentType)) {
    return `#/study/${item.slug}`;
  }
  return '#/home';
}

function linkForSearchResult(item) {
  if (item.contentType === 'role') return `#/roles/${item.slug}`;
  if (item.contentType === 'module') return `#/modules/${item.slug}`;
  if (item.contentType === 'topic') return `#/topics/${item.slug}`;
  if (['coding', 'use-case', 'theory', 'comparison', 'troubleshooting', 'table-schema', 'best-practice', 'tricky'].includes(item.contentType)) {
    return linkForItem(item);
  }
  return '#/home';
}

function labelForContentType(type) {
  const map = {
    'use-case': 'Use Case',
    'table-schema': 'Table / Schema',
    'best-practice': 'Best Practice',
    comparison: 'Comparison',
    troubleshooting: 'Troubleshooting',
    theory: 'Theory',
    coding: 'Coding',
    tricky: 'Tricky',
    role: 'Role',
    module: 'Module',
    topic: 'Topic'
  };
  return map[type] || type;
}

function bookmarkButton(item) {
  const active = isBookmarked(item.id);
  return `<button class="icon-button ${active ? 'active' : ''}" title="${active ? 'Remove bookmark' : 'Save bookmark'}" data-bookmark-id="${escapeHtml(item.id)}">★</button>`;
}


function iconSvg(iconName, className = 'entity-icon') {
  const icons = {
    role: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="3.5"/><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a3.5 3.5 0 0 1 0 6.74"/></svg>`,
    module: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>`,
    topic: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></svg>`,
    coding: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 16-4-4 4-4"/><path d="m16 8 4 4-4 4"/><path d="m14 4-4 16"/></svg>`,
    usecase: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 12l2 2 4-4"/><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8 4v16"/></svg>`,
    quiz: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 4"/><path d="M12 17h.01"/></svg>`
  };
  return icons[iconName] || icons.module;
}


function chevronSvg(className = 'card-chevron-icon') {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>`;
}


function countPill(label, value, tone = '') {
  return `<span class="metric-pill ${tone}"><strong>${escapeHtml(formatCount(value))}</strong><span>${escapeHtml(label)}</span></span>`;
}

function getAllStudyItems(state) {
  return [...state.data.theory, ...state.data.coding, ...state.data.useCases];
}

function getRoleCounts(state, role) {
  const related = getAllStudyItems(state).filter((item) => (item.roleIds || []).includes(role.id));
  const topicIds = unique(related.flatMap((item) => item.topicIds || []));
  return {
    study: related.length,
    modules: (role.moduleIds || []).length,
    topics: topicIds.length
  };
}

function getModuleCounts(state, module) {
  const related = getAllStudyItems(state).filter((item) => (item.moduleIds || []).includes(module.id));
  const topicIds = unique(related.flatMap((item) => item.topicIds || []));
  const roleIds = unique(related.flatMap((item) => item.roleIds || []));
  return {
    study: related.length,
    topics: topicIds.length,
    roles: roleIds.length
  };
}

function getTopicCounts(state, topic) {
  const related = getAllStudyItems(state).filter((item) => (item.topicIds || []).includes(topic.id));
  const moduleIds = unique(related.flatMap((item) => item.moduleIds || []));
  const roleIds = unique(related.flatMap((item) => item.roleIds || []));
  return {
    study: related.length,
    modules: moduleIds.length,
    roles: roleIds.length
  };
}

function iconForEntity(type, entity = {}) {
  if (type === 'roles') return 'role';
  if (type === 'topics') return 'topic';
  if (type === 'coding') return 'coding';
  if (type === 'use-cases') return 'usecase';
  return 'module';
}

function itemCard(item, lookups) {
  const moduleNames = (item.moduleIds || []).slice(0, 3).map((id) => lookups.modulesById[id]?.name).filter(Boolean);
  const topicNames = (item.topicIds || []).slice(0, 3).map((id) => lookups.topicsById[id]?.name).filter(Boolean);
  return `
    <article class="card item-card">
      <div class="title-row">
        <div>
          <div class="badges">
            <span class="badge green">${escapeHtml(labelForContentType(item.contentType))}</span>
            <span class="badge orange">${escapeHtml(item.difficulty)}</span>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(truncate(item.summary || item.question, 165))}</p>
        </div>
        ${bookmarkButton(item)}
      </div>
      <div class="meta-inline">
        ${moduleNames.map((name) => `<span class="badge">${escapeHtml(name)}</span>`).join('')}
        ${topicNames.map((name) => `<span class="badge">${escapeHtml(name)}</span>`).join('')}
      </div>
      <div class="footer-row">
        <span class="small">${escapeHtml(item.question)}</span>
        <a class="link-arrow" href="${linkForItem(item)}">Open →</a>
      </div>
    </article>
  `;
}

function entityCard(entity, type, counts = {}) {
  const route = entity.route || `#/${type}/${entity.slug}`;
  const typeLabel = type === 'roles' ? 'Role' : type === 'modules' ? 'Module' : type === 'topics' ? 'Topic' : type;
  const iconName = iconForEntity(type, entity);

  return `
    <article class="card item-card entity-card entity-card-${escapeHtml(typeLabel.toLowerCase())}" data-entity-type="${escapeHtml(typeLabel.toLowerCase())}" data-entity-id="${escapeHtml(entity.id)}">
      <div class="entity-card-top">
        <div class="entity-icon-wrap ${escapeHtml(typeLabel.toLowerCase())}">${iconSvg(iconName)}</div>
        <div class="entity-copy">
          <div class="badges"><span class="badge">${escapeHtml(typeLabel)}</span></div>
          <h3>${escapeHtml(entity.name)}</h3>
          <p>${escapeHtml(entity.summary || entity.category || '')}</p>
        </div>
      </div>
      <div class="footer-row entity-card-footer">
        <a class="chevron-link" href="${route}" aria-label="Open ${escapeHtml(entity.name)}">${chevronSvg()}</a>
      </div>
    </article>
  `;
}

function filterBar({
  route,
  filters = {},
  roles = [],
  modules = [],
  topics = [],
  categories = [],
  showRole = true,
  showModule = true,
  showTopic = true,
  showDifficulty = true,
  showSearch = true,
  showCategory = false
}) {
  return `
    <form class="filters card" data-filter-form="${escapeHtml(route)}">
      ${showRole ? `
      <label>
        Role
        <select name="role" data-filter-control>
          <option value="">All roles</option>
          ${roles.map((role) => `<option value="${escapeHtml(role.id)}" ${filters.role === role.id ? 'selected' : ''}>${escapeHtml(role.name)}</option>`).join('')}
        </select>
      </label>` : ''}
      ${showModule ? `
      <label>
        Module
        <select name="module" data-filter-control>
          <option value="">All modules</option>
          ${modules.map((module) => `<option value="${escapeHtml(module.id)}" ${filters.module === module.id ? 'selected' : ''}>${escapeHtml(module.name)}</option>`).join('')}
        </select>
      </label>` : ''}
      ${showTopic ? `
      <label>
        Topic
        <select name="topic" data-filter-control>
          <option value="">All topics</option>
          ${topics.map((topic) => `<option value="${escapeHtml(topic.id)}" ${filters.topic === topic.id ? 'selected' : ''}>${escapeHtml(topic.name)}</option>`).join('')}
        </select>
      </label>` : ''}
      ${showDifficulty ? `
      <label>
        Difficulty
        <select name="difficulty" data-filter-control>
          <option value="">All levels</option>
          ${['Beginner', 'Intermediate', 'Advanced'].map((level) => `<option value="${level}" ${filters.difficulty === level ? 'selected' : ''}>${level}</option>`).join('')}
        </select>
      </label>` : ''}
      ${showSearch ? `
      <label>
        Search in page
        <input type="search" name="q" value="${escapeHtml(filters.q || '')}" placeholder="Filter current page" data-filter-control />
      </label>` : ''}
      ${showCategory ? `
      <label>
        Category
        <select name="category" data-filter-control>
          <option value="">All categories</option>
          ${categories.map((category) => `<option value="${escapeHtml(category)}" ${filters.category === category ? 'selected' : ''}>${escapeHtml(category)}</option>`).join('')}
        </select>
      </label>` : ''}
    </form>
  `;
}

function detailAside(item, lookups) {
  const roleNames = (item.roleIds || []).map((id) => lookups.rolesById[id]?.name).filter(Boolean);
  const moduleNames = (item.moduleIds || []).map((id) => lookups.modulesById[id]?.name).filter(Boolean);
  const topicNames = (item.topicIds || []).map((id) => lookups.topicsById[id]?.name).filter(Boolean);

  return `
    <aside class="card">
      <div class="section-header">
        <div>
          <h2>Metadata</h2>
          <p>Use this to connect the answer to role, module, and topic prep.</p>
        </div>
      </div>
      <div class="detail-section">
        <h3>Type & Difficulty</h3>
        <div class="badges">
          <span class="badge green">${escapeHtml(labelForContentType(item.contentType))}</span>
          <span class="badge orange">${escapeHtml(item.difficulty)}</span>
        </div>
      </div>
      <div class="detail-section">
        <h3>Roles</h3>
        <div class="badges">${roleNames.map((name) => `<span class="badge">${escapeHtml(name)}</span>`).join('') || '<span class="small">No mapped roles yet</span>'}</div>
      </div>
      <div class="detail-section">
        <h3>Modules</h3>
        <div class="badges">${moduleNames.map((name) => `<span class="badge">${escapeHtml(name)}</span>`).join('') || '<span class="small">No mapped modules yet</span>'}</div>
      </div>
      <div class="detail-section">
        <h3>Topics</h3>
        <div class="badges">${topicNames.map((name) => `<span class="badge">${escapeHtml(name)}</span>`).join('') || '<span class="small">No mapped topics yet</span>'}</div>
      </div>
      <div class="detail-section">
        <h3>Related Tables</h3>
        <div class="table-list">${(item.relatedTables || []).length ? item.relatedTables.map((name) => `<div>${escapeHtml(name)}</div>`).join('') : '<span class="small">No related tables listed.</span>'}</div>
      </div>
      <div class="detail-section">
        <h3>Bookmark</h3>
        ${bookmarkButton(item)}
      </div>
    </aside>
  `;
}

function relatedSection(relatedItems, lookups, title = 'Related items') {
  if (!relatedItems.length) return '';
  return `
    <section class="detail-section">
      <div class="section-header">
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>Continue the same prep path through adjacent topics and scenarios.</p>
        </div>
      </div>
      <div class="grid cards-2">
        ${relatedItems.map((item) => itemCard(item, lookups)).join('')}
      </div>
    </section>
  `;
}


export function renderHome(state) {
  const { coverage, roles, modules, topics, theory, coding, useCases } = state.data;
  const allStudy = [...theory, ...coding, ...useCases];
  const featuredItems = [...coding.slice(0, 3), ...useCases.slice(0, 3), ...theory.slice(0, 2)];
  const featuredModules = ['itsm', 'cmdb', 'discovery', 'grc', 'secops', 'ham', 'sam']
    .map((id) => state.lookups.modulesById[id])
    .filter(Boolean);

  const domainCards = [
    { label: 'ITSM', moduleIds: ['itsm', 'incident-management', 'problem-management', 'change-management', 'request-management'] },
    { label: 'CMDB', moduleIds: ['cmdb'] },
    { label: 'Discovery', moduleIds: ['discovery'] },
    { label: 'GRC', moduleIds: ['grc', 'risk-management', 'audit-management'] },
    { label: 'SecOps', moduleIds: ['secops', 'vulnerability-response', 'security-incident-response'] },
    { label: 'HAM', moduleIds: ['ham'] },
    { label: 'SAM', moduleIds: ['sam'] }
  ].map((domain) => ({
    ...domain,
    itemCount: allStudy.filter((item) => (item.moduleIds || []).some((id) => domain.moduleIds.includes(id))).length
  }));

  return `
    <section class="hero enterprise-hero">
      <article class="card hero-copy accent-panel">
        <div class="badges">
          <span class="badge green">Expanded coverage</span>
          <span class="badge">Role / module / topic paths</span>
          <span class="badge orange">Exact answers + steps</span>
        </div>
        <h2>Prepare with a polished ServiceNow interview workspace built for depth, speed, and clarity.</h2>
        <p>Use this hub to prepare by role, module, topic, coding pattern, and implementation scenario. Everything is organized to help you move quickly from broad preparation into exact answers, scripts, and practical implementation paths.</p>
        <div class="hero-actions">
          <a class="button-link" href="#/modules">Explore modules</a>
          <a class="button secondary" href="#/coding">Open coding bank</a>
          <a class="button secondary" href="#/use-cases">Open use cases</a>
          <a class="button support-button" href="https://cash.app/$TEJASWIREDDYAnapalli" target="_blank" rel="noopener noreferrer" data-support-link="cashapp-home">Buy me a coffee ☕</a>
        </div>
      </article>

      <article class="card">
        <div class="section-header">
          <div>
            <h2>Coverage snapshot</h2>
            <p>Quick view of the current study surface across the interview hub.</p>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-tile"><span>Roles</span><strong>${formatCount(coverage.currentCounts.roles)}</strong></div>
          <div class="stat-tile"><span>Modules</span><strong>${formatCount(coverage.currentCounts.modules)}</strong></div>
          <div class="stat-tile"><span>Topics</span><strong>${formatCount(coverage.currentCounts.topics)}</strong></div>
          <div class="stat-tile"><span>Study items</span><strong>${formatCount(coverage.currentCounts.totalSeededStudyItems)}</strong></div>
          <div class="stat-tile"><span>Coding</span><strong>${formatCount(coverage.currentCounts.codingItems)}</strong></div>
          <div class="stat-tile"><span>Use cases</span><strong>${formatCount(coverage.currentCounts.useCaseItems)}</strong></div>
        </div>
      </article>
    </section>

    <section class="grid cards-3">
      ${entityCard({ id: 'home-roles', slug: 'roles', route: '#/roles', name: 'Roles', summary: 'Start from target job families and move into mapped modules and topics.' }, 'roles', { study: coverage.currentCounts.totalSeededStudyItems, modules: coverage.currentCounts.modules, topics: coverage.currentCounts.topics })}
      ${entityCard({ id: 'home-modules', slug: 'modules', route: '#/modules', name: 'Modules', summary: 'Explore product areas like ITSM, CMDB, Discovery, GRC, SecOps, HAM, and SAM.' }, 'modules', { study: coverage.currentCounts.totalSeededStudyItems, roles: coverage.currentCounts.roles, topics: coverage.currentCounts.topics })}
      ${entityCard({ id: 'home-topics', slug: 'topics', route: '#/topics', name: 'Topics', summary: 'Drill into exact concepts, APIs, tables, tricky differences, and interview edge cases.' }, 'topics', { study: coverage.currentCounts.totalSeededStudyItems, roles: coverage.currentCounts.roles, modules: coverage.currentCounts.modules })}
    </section>

    <section class="card">
      <div class="section-header">
        <div>
          <h2>Coverage by domain</h2>
          <p>Focus areas that now have stronger coverage for interview preparation.</p>
        </div>
      </div>
      <div class="grid cards-4 domain-grid">
        ${domainCards.map((domain) => `
          <article class="domain-card">
            <div class="title-row">
              <div>
                <div class="badges"><span class="badge green">Expanded</span></div>
                <h3>${escapeHtml(domain.label)}</h3>
                <p>Focused interview coverage</p>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    <section>
      <div class="section-header">
        <div>
          <h2>Priority module paths</h2>
          <p>Start with the domains that are most likely to surface in interviews.</p>
        </div>
      </div>
      <div class="grid cards-3">
        ${featuredModules.map((module) => entityCard(module, 'modules', { study: allStudy.filter((item) => (item.moduleIds || []).includes(module.id)).length })).join('')}
      </div>
    </section>

    <section class="card">
      <div class="section-header">
        <div>
          <h2>What this hub gives you</h2>
          <p>Everything is designed to keep preparation focused, practical, and easy to navigate.</p>
        </div>
      </div>
      <div class="coverage-list">
        <div class="coverage-row"><span>Exact-answer theory and tricky comparisons</span><span class="badge green">Ready</span></div>
        <div class="coverage-row"><span>Step-by-step coding responses with scripts</span><span class="badge green">Ready</span></div>
        <div class="coverage-row"><span>Implementation-style use cases with validation steps</span><span class="badge green">Ready</span></div>
        <div class="coverage-row"><span>Bookmark and quiz workflow for revision</span><span class="badge green">Ready</span></div>
        ${coverage.status.map((row) => `<div class="coverage-row"><span>${escapeHtml(row.area)}</span><span class="badge ${/applied|expanded|ready/i.test(row.status) ? 'green' : 'orange'}">${escapeHtml(row.status)}</span></div>`).join('')}
      </div>
    </section>

    <section>
      <div class="section-header">
        <div>
          <h2>Featured study items</h2>
          <p>Representative exact-answer content from theory, coding, and implementation use cases.</p>
        </div>
      </div>
      <div class="grid cards-2">
        ${featuredItems.map((item) => itemCard(item, state.lookups)).join('')}
      </div>
    </section>
  `;
}



export function renderRolesPage(state) {
  const allStudy = getAllStudyItems(state);
  return `
    <section class="card page-banner">
      <div class="section-header">
        <div>
          <h2>Role Paths</h2>
          <p>Pick the ServiceNow role you are targeting and jump into the most relevant study surface for that job family.</p>
        </div>
      </div>
      <div class="stat-grid">
        <div class="stat-tile"><span>Role catalog</span><strong>${formatCount(state.data.roles.length)}</strong></div>
        <div class="stat-tile"><span>Total mapped study items</span><strong>${formatCount(allStudy.length)}</strong></div>
        <div class="stat-tile"><span>Suggested path</span><strong>Role → Module → Topic</strong></div>
        <div class="stat-tile"><span>Use it for</span><strong>Focused interview prep</strong></div>
      </div>
    </section>
    <div class="grid cards-3">
      ${state.data.roles.map((role) => entityCard(role, 'roles', getRoleCounts(state, role))).join('')}
    </div>
  `;
}


export function renderRoleDetail(state, role, related) {
  const modules = role.moduleIds.map((id) => state.lookups.modulesById[id]).filter(Boolean);
  const counts = getRoleCounts(state, role);
  return `
    <nav class="breadcrumbs"><a href="#/roles">Roles</a><span class="sep">/</span><span>${escapeHtml(role.name)}</span></nav>
    <section class="card entity-detail-hero">
      <div class="entity-card-top">
        <div class="entity-icon-wrap role">${iconSvg('role')}</div>
        <div class="entity-copy">
          <div class="badges"><span class="badge">Role</span></div>
          <h2>${escapeHtml(role.name)}</h2>
          <p>${escapeHtml(role.summary)}</p>
        </div>
      </div>
      <div class="entity-metrics">
        ${countPill('Items', counts.study, 'green')}
        ${countPill('Modules', counts.modules)}
        ${countPill('Topics', counts.topics)}
      </div>
    </section>

    <section>
      <div class="section-header">
        <div><h2>Mapped modules</h2><p>Use this as your first pass for role-based preparation.</p></div>
      </div>
      <div class="grid cards-3">
        ${modules.map((module) => entityCard(module, 'modules', getModuleCounts(state, module))).join('')}
      </div>
    </section>

    ${relatedSection(related.slice(0, 8), state.lookups, 'Best starting items for this role')}
  `;
}


export function renderModulesPage(state) {
  const hotModules = ['itsm', 'cmdb', 'discovery', 'grc', 'secops', 'ham', 'sam']
    .map((id) => state.lookups.modulesById[id])
    .filter(Boolean);
  return `
    <section class="card page-banner">
      <div class="section-header">
        <div>
          <h2>Modules / Product Areas</h2>
          <p>Browse by platform domain and product area, then open theory, coding, and use-case coverage under each one.</p>
        </div>
      </div>
      <div class="badges">
        ${hotModules.map((module) => `<span class="badge">${escapeHtml(module.name)}</span>`).join('')}
      </div>
    </section>
    <div class="grid cards-3">
      ${state.data.modules.map((module) => entityCard(module, 'modules', getModuleCounts(state, module))).join('')}
    </div>
  `;
}


export function renderModuleDetail(state, module, related) {
  const relatedTopics = state.data.topics.filter((topic) => related.some((item) => (item.topicIds || []).includes(topic.id))).slice(0, 12);
  const counts = getModuleCounts(state, module);
  return `
    <nav class="breadcrumbs"><a href="#/modules">Modules</a><span class="sep">/</span><span>${escapeHtml(module.name)}</span></nav>
    <section class="card entity-detail-hero">
      <div class="entity-card-top">
        <div class="entity-icon-wrap module">${iconSvg('module')}</div>
        <div class="entity-copy">
          <div class="badges"><span class="badge">Module</span></div>
          <h2>${escapeHtml(module.name)}</h2>
          <p>${escapeHtml(module.summary)}</p>
        </div>
      </div>
      <div class="entity-metrics">
        ${countPill('Items', counts.study, 'green')}
        ${countPill('Topics', counts.topics)}
        ${countPill('Roles', counts.roles)}
      </div>
    </section>

    <section>
      <div class="section-header">
        <div><h2>Related topics</h2><p>Topic coverage currently linked to this module.</p></div>
      </div>
      <div class="grid cards-3">
        ${relatedTopics.map((topic) => entityCard(topic, 'topics', getTopicCounts(state, topic))).join('')}
      </div>
    </section>

    ${relatedSection(related.slice(0, 8), state.lookups, 'Best starting items for this module')}
  `;
}


export function renderTopicsPage(state, filters) {
  const categories = [...new Set(state.data.topics.map((topic) => topic.category))].sort();
  const q = (filters.q || '').toLowerCase();
  const topics = state.data.topics.filter((topic) => {
    if (filters.category && topic.category !== filters.category) return false;
    if (!q) return true;
    return `${topic.name} ${topic.category}`.toLowerCase().includes(q);
  });
  const allStudy = getAllStudyItems(state);
  return `
    <section class="card page-banner">
      <div class="section-header">
        <div>
          <h2>Topics</h2>
          <p>Go deep by exact platform concept, API, table, automation behavior, or tricky interview distinction.</p>
        </div>
      </div>
      <div class="stat-grid">
        <div class="stat-tile"><span>Topic catalog</span><strong>${formatCount(state.data.topics.length)}</strong></div>
        <div class="stat-tile"><span>Visible topics</span><strong>${formatCount(topics.length)}</strong></div>
        <div class="stat-tile"><span>Categories</span><strong>${formatCount(categories.length)}</strong></div>
        <div class="stat-tile"><span>Mapped study items</span><strong>${formatCount(allStudy.length)}</strong></div>
      </div>
    </section>
    ${filterBar({ route: '/topics', filters, roles: [], modules: [], topics: [], categories, showRole: false, showModule: false, showTopic: false, showDifficulty: false, showSearch: true, showCategory: true })}
    <div class="grid cards-3">
      ${topics.map((topic) => entityCard(topic, 'topics', getTopicCounts(state, topic))).join('')}
    </div>
  `;
}


export function renderTopicDetail(state, topic, related) {
  const grouped = {
    theory: related.filter((item) => item.contentType !== 'coding' && item.contentType !== 'use-case'),
    coding: related.filter((item) => item.contentType === 'coding'),
    useCases: related.filter((item) => item.contentType === 'use-case')
  };
  const counts = getTopicCounts(state, topic);
  return `
    <nav class="breadcrumbs"><a href="#/topics">Topics</a><span class="sep">/</span><span>${escapeHtml(topic.name)}</span></nav>
    <section class="card entity-detail-hero">
      <div class="entity-card-top">
        <div class="entity-icon-wrap topic">${iconSvg('topic')}</div>
        <div class="entity-copy">
          <div class="badges"><span class="badge">Topic</span><span class="badge">${escapeHtml(topic.category)}</span></div>
          <h2>${escapeHtml(topic.name)}</h2>
          <p>${escapeHtml(topic.category)} topic with exact-answer content, coding, and use-case coverage.</p>
        </div>
      </div>
      <div class="entity-metrics">
        ${countPill('Items', counts.study, 'green')}
        ${countPill('Modules', counts.modules)}
        ${countPill('Roles', counts.roles)}
      </div>
    </section>
    ${grouped.theory.length ? relatedSection(grouped.theory, state.lookups, 'Concept and explanation items') : ''}
    ${grouped.coding.length ? relatedSection(grouped.coding, state.lookups, 'Coding questions under this topic') : ''}
    ${grouped.useCases.length ? relatedSection(grouped.useCases, state.lookups, 'Use cases under this topic') : ''}
  `;
}


export function renderCodingPage(state, items, filters) {
  return `
    <section class="card page-banner">
      <div class="section-header">
        <div>
          <h2>Coding Questions</h2>
          <p>Exact script answers, where to configure them, and how to validate the output in interview-ready form.</p>
        </div>
      </div>
      <div class="badges">
        <span class="badge green">${escapeHtml(formatCount(items.length) + ' visible coding items')}</span>
        <span class="badge">GlideRecord</span>
        <span class="badge">GlideAggregate</span>
        <span class="badge">Script Includes</span>
      </div>
    </section>
    ${filterBar({ route: '/coding', filters, roles: state.data.roles, modules: state.data.modules, topics: state.data.topics })}
    <div class="grid cards-2">
      ${items.map((item) => itemCard(item, state.lookups)).join('') || '<section class="card empty-state"><h2>No coding items match this filter.</h2><p>Clear one or more filters and try again.</p></section>'}
    </div>
  `;
}



export function renderUseCasesPage(state, items, filters) {
  return `
    <section class="card page-banner">
      <div class="section-header">
        <div>
          <h2>Use Cases</h2>
          <p>Implementation-style answers with navigation paths, steps, validation checklists, and common traps.</p>
        </div>
      </div>
      <div class="badges">
        <span class="badge green">${escapeHtml(formatCount(items.length) + ' visible use cases')}</span>
        <span class="badge">Design</span>
        <span class="badge">Troubleshooting</span>
        <span class="badge">Operational flow</span>
      </div>
    </section>
    ${filterBar({ route: '/use-cases', filters, roles: state.data.roles, modules: state.data.modules, topics: state.data.topics })}
    <div class="grid cards-2">
      ${items.map((item) => itemCard(item, state.lookups)).join('') || '<section class="card empty-state"><h2>No use cases match this filter.</h2><p>Clear one or more filters and try again.</p></section>'}
    </div>
  `;
}


export function renderStudyDetail(state, item, relatedItems) {
  const comparison = item.comparisonTable || [];
  return `
    <nav class="breadcrumbs">
      <a href="#/topics">Topics</a><span class="sep">/</span><span>${escapeHtml(item.title)}</span>
    </nav>
    <section class="detail-layout">
      <article>
        <section class="card detail-section">
          <div class="section-header">
            <div>
              <h2>${escapeHtml(item.title)}</h2>
              <p>${escapeHtml(item.question)}</p>
            </div>
          </div>
          <div class="badges">
            <span class="badge green">${escapeHtml(labelForContentType(item.contentType))}</span>
            <span class="badge orange">${escapeHtml(item.difficulty)}</span>
          </div>
          <div class="detail-section">
            <h3>Exact answer</h3>
            <div class="detail-answer">${escapeHtml(item.exactAnswer)}</div>
          </div>
          <div class="detail-section">
            <h3>Key points</h3>
            <ul>${(item.keyPoints || []).map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul>
          </div>
          ${comparison.length ? `
          <div class="detail-section">
            <h3>Comparison breakdown</h3>
            <div class="table-list">${comparison.map((row) => `<div><strong>${escapeHtml(row.label)}:</strong> ${escapeHtml(row.value)}</div>`).join('')}</div>
          </div>` : ''}
          ${(item.examples || []).length ? `
          <div class="detail-section">
            <h3>Examples</h3>
            <ul>${item.examples.map((example) => `<li>${escapeHtml(example)}</li>`).join('')}</ul>
          </div>` : ''}
        </section>
        ${relatedSection(relatedItems, state.lookups, 'Related study items')}
      </article>
      ${detailAside(item, state.lookups)}
    </section>
  `;
}

export function renderCodingDetail(state, item, relatedItems) {
  return `
    <nav class="breadcrumbs">
      <a href="#/coding">Coding</a><span class="sep">/</span><span>${escapeHtml(item.title)}</span>
    </nav>
    <section class="detail-layout">
      <article>
        <section class="card detail-section">
          <div class="section-header">
            <div>
              <h2>${escapeHtml(item.title)}</h2>
              <p>${escapeHtml(item.question)}</p>
            </div>
          </div>
          <div class="badges">
            <span class="badge green">Coding</span>
            <span class="badge orange">${escapeHtml(item.difficulty)}</span>
          </div>
          <div class="detail-section">
            <h3>Exact answer</h3>
            <div class="detail-answer">${escapeHtml(item.exactAnswer)}</div>
          </div>
          <div class="detail-section">
            <h3>Implementation steps</h3>
            <ol>${(item.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
          </div>
          <div class="detail-section">
            <h3>Script</h3>
            <pre class="code-block"><code>${escapeHtml(item.code?.script || '')}</code></pre>
          </div>
          ${(item.expectedOutput || []).length ? `
          <div class="detail-section">
            <h3>Expected output</h3>
            <ul>${item.expectedOutput.map((row) => `<li>${escapeHtml(row)}</li>`).join('')}</ul>
          </div>` : ''}
          ${(item.explanation || []).length ? `
          <div class="detail-section">
            <h3>Why this works</h3>
            <ul>${item.explanation.map((row) => `<li>${escapeHtml(row)}</li>`).join('')}</ul>
          </div>` : ''}
          ${(item.commonMistakes || []).length ? `
          <div class="detail-section">
            <h3>Common mistakes</h3>
            <ul>${item.commonMistakes.map((row) => `<li>${escapeHtml(row)}</li>`).join('')}</ul>
          </div>` : ''}
        </section>
        ${relatedSection(relatedItems, state.lookups, 'Related coding and topic items')}
      </article>
      ${detailAside(item, state.lookups)}
    </section>
  `;
}

export function renderUseCaseDetail(state, item, relatedItems) {
  return `
    <nav class="breadcrumbs">
      <a href="#/use-cases">Use Cases</a><span class="sep">/</span><span>${escapeHtml(item.title)}</span>
    </nav>
    <section class="detail-layout">
      <article>
        <section class="card detail-section">
          <div class="section-header">
            <div>
              <h2>${escapeHtml(item.title)}</h2>
              <p>${escapeHtml(item.question)}</p>
            </div>
          </div>
          <div class="badges">
            <span class="badge green">Use Case</span>
            <span class="badge orange">${escapeHtml(item.difficulty)}</span>
          </div>
          <div class="detail-section">
            <h3>Scenario</h3>
            <p>${escapeHtml(item.scenario)}</p>
          </div>
          <div class="detail-section">
            <h3>Exact answer</h3>
            <div class="detail-answer">${escapeHtml(item.exactAnswer)}</div>
          </div>
          ${(item.navigationPath || []).length ? `
          <div class="detail-section">
            <h3>Navigation path</h3>
            <ul>${item.navigationPath.map((row) => `<li>${escapeHtml(row)}</li>`).join('')}</ul>
          </div>` : ''}
          <div class="detail-section">
            <h3>Implementation steps</h3>
            <ol>${(item.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>
          </div>
          ${(item.involvedArtifacts || []).length ? `
          <div class="detail-section">
            <h3>Involved artifacts</h3>
            <ul>${item.involvedArtifacts.map((row) => `<li>${escapeHtml(row)}</li>`).join('')}</ul>
          </div>` : ''}
          ${(item.codeSnippets || []).length ? `
          <div class="detail-section">
            <h3>Supporting code</h3>
            ${item.codeSnippets.map((snippet) => `
              <h4>${escapeHtml(snippet.title)}</h4>
              <pre class="code-block"><code>${escapeHtml(snippet.script)}</code></pre>
            `).join('')}
          </div>` : ''}
          ${(item.validationChecklist || []).length ? `
          <div class="detail-section">
            <h3>Validation checklist</h3>
            <ul>${item.validationChecklist.map((row) => `<li>${escapeHtml(row)}</li>`).join('')}</ul>
          </div>` : ''}
          ${(item.commonMistakes || []).length ? `
          <div class="detail-section">
            <h3>Common mistakes</h3>
            <ul>${item.commonMistakes.map((row) => `<li>${escapeHtml(row)}</li>`).join('')}</ul>
          </div>` : ''}
        </section>
        ${relatedSection(relatedItems, state.lookups, 'Related implementation items')}
      </article>
      ${detailAside(item, state.lookups)}
    </section>
  `;
}

export function renderSearchResults(query, results, state) {
  return `
    <section class="section-header">
      <div>
        <h2>Search results</h2>
        <p>${results.length ? `${formatCount(results.length)} results for "${escapeHtml(query)}"` : `No results for "${escapeHtml(query)}"`}</p>
      </div>
    </section>
    <section class="search-results">
      ${results.length ? results.map((result) => `
        <article class="search-result">
          <div class="badges">
            <span class="badge">${escapeHtml(labelForContentType(result.contentType))}</span>
            ${result.difficulty ? `<span class="badge orange">${escapeHtml(result.difficulty)}</span>` : ''}
          </div>
          <h3><a href="${linkForSearchResult(result)}">${escapeHtml(result.title)}</a></h3>
          <p>${escapeHtml(result.preview || '')}</p>
          <div class="meta-inline">${buildMetaChips((result.tags || []).slice(0, 5))}</div>
        </article>
      `).join('') : `
        <section class="card empty-state">
          <h2>No matching content found.</h2>
          <p>Try broader terms like business rules, CMDB, ACL, SLA, service portal, IRE, or Flow Designer.</p>
        </section>
      `}
    </section>
  `;
}


export function renderBookmarksPage(state) {
  const bookmarks = getBookmarks();
  const bookmarkedItems = bookmarks
    .map((bookmark) => state.lookups.contentById[bookmark.id])
    .filter(Boolean);

  if (!bookmarkedItems.length) {
    return `
      <section class="card empty-state">
        <h2>No bookmarks yet</h2>
        <p>Save theory, coding, or use-case items from any detail page and they will show up here as your personal revision queue.</p>
      </section>
    `;
  }

  const grouped = {
    theory: bookmarkedItems.filter((item) => item.contentType !== 'coding' && item.contentType !== 'use-case'),
    coding: bookmarkedItems.filter((item) => item.contentType === 'coding'),
    useCases: bookmarkedItems.filter((item) => item.contentType === 'use-case')
  };

  return `
    <section class="card page-banner">
      <div class="section-header">
        <div>
          <h2>Bookmarks</h2>
          <p>Use this page as your revision board for weak areas, tricky differences, and missed quiz concepts.</p>
        </div>
      </div>
      <div class="badges">
        <span class="badge green">${escapeHtml(formatCount(bookmarkedItems.length) + ' saved items')}</span>
      </div>
    </section>
    ${grouped.theory.length ? relatedSection(grouped.theory, state.lookups, 'Theory / tricky items') : ''}
    ${grouped.coding.length ? relatedSection(grouped.coding, state.lookups, 'Coding bookmarks') : ''}
    ${grouped.useCases.length ? relatedSection(grouped.useCases, state.lookups, 'Use case bookmarks') : ''}
  `;
}



export function renderQuizSetup(state) {
  return `
    <section class="quiz-shell">
      <article class="card page-banner">
        <div class="section-header">
          <div>
            <h2>Quiz Setup</h2>
            <p>Select scope, difficulty, and count, then launch a focused practice round from the current question bank.</p>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-tile"><span>Quiz items</span><strong>${formatCount(state.data.quizzes.length)}</strong></div>
          <div class="stat-tile"><span>Available counts</span><strong>10 · 20 · 25 · 30 · 40</strong></div>
          <div class="stat-tile"><span>Best use</span><strong>Revision + recall</strong></div>
          <div class="stat-tile"><span>After quiz</span><strong>Bookmark missed items</strong></div>
        </div>

        <form id="quiz-setup-form" class="filters" data-quiz-form>
          <label>
            Scope
            <select name="scope">
              <option value="mixed">Mixed</option>
              <option value="role">Role</option>
              <option value="module">Module</option>
              <option value="topic">Topic</option>
              <option value="coding">Coding</option>
              <option value="use-case">Use Case</option>
            </select>
          </label>
          <label>
            Role
            <select name="roleValue">
              <option value="">Any role</option>
              ${state.data.roles.map((role) => `<option value="${escapeHtml(role.id)}">${escapeHtml(role.name)}</option>`).join('')}
            </select>
          </label>
          <label>
            Module
            <select name="moduleValue">
              <option value="">Any module</option>
              ${state.data.modules.map((module) => `<option value="${escapeHtml(module.id)}">${escapeHtml(module.name)}</option>`).join('')}
            </select>
          </label>
          <label>
            Topic
            <select name="topicValue">
              <option value="">Any topic</option>
              ${state.data.topics.map((topic) => `<option value="${escapeHtml(topic.id)}">${escapeHtml(topic.name)}</option>`).join('')}
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
            Count
            <select name="count">
              ${[10, 20, 25, 30, 40].map((count) => `<option value="${count}">${count}</option>`).join('')}
            </select>
          </label>
          <div>
            <button class="button-link" type="submit">Start quiz</button>
          </div>
        </form>

        <div class="notice">Tip: if you choose Role, Module, or Topic scope, the app uses the matching value field and ignores the others. Coding and Use Case scopes pull from those quiz categories directly.</div>
      </article>
    </section>
  `;
}


export function renderQuizRunner(session) {
  const question = session.questions[session.currentIndex];
  if (!question) {
    return `
      <section class="quiz-shell">
        <article class="card empty-state">
          <h2>No quiz question available</h2>
          <p>The current quiz session is out of sync. Reset and start a new quiz round.</p>
          <div class="hero-actions">
            <button type="button" class="button-link" data-quiz-reset>Start over</button>
          </div>
        </article>
      </section>
    `;
  }
  const selected = session.answers[session.currentIndex];
  return `
    <section class="quiz-shell">
      <article class="card quiz-question">
        <div class="quiz-progress">
          <span>Question ${session.currentIndex + 1} of ${session.questions.length}</span>
          <span>${escapeHtml(session.options.scope || 'mixed')} scope</span>
        </div>
        <h3>${escapeHtml(question.question)}</h3>
        <div class="quiz-choices">
          ${question.choices.map((choice, index) => `
            <button type="button" class="quiz-choice ${String(selected) === String(index) ? 'selected' : ''}" data-quiz-choice="${index}">
              ${escapeHtml(choice)}
            </button>
          `).join('')}
        </div>
        <div class="hero-actions">
          <button type="button" class="button secondary" data-quiz-reset>Reset</button>
          <button type="button" class="button-link" data-quiz-next>${session.currentIndex === session.questions.length - 1 ? 'Submit quiz' : 'Next question'}</button>
        </div>
      </article>
    </section>
  `;
}

export function renderQuizResults(summary, state) {
  return `
    <section class="quiz-shell">
      <article class="card">
        <div class="section-header">
          <div>
            <h2>Quiz results</h2>
            <p>Your score is ${summary.correct} out of ${summary.total} (${summary.percentage}%).</p>
          </div>
        </div>
        <div class="stat-grid">
          <div class="stat-tile"><span>Correct</span><strong>${summary.correct}</strong></div>
          <div class="stat-tile"><span>Total</span><strong>${summary.total}</strong></div>
          <div class="stat-tile"><span>Percentage</span><strong>${summary.percentage}%</strong></div>
          <div class="stat-tile"><span>Missed</span><strong>${summary.total - summary.correct}</strong></div>
        </div>
        <div class="hero-actions">
          <button type="button" class="button secondary" data-quiz-reset>Start over</button>
        </div>
      </article>

      <section class="result-list">
        ${summary.results.map((result) => `
          <article class="result-item">
            <div class="badges">
              <span class="badge ${result.isCorrect ? 'green' : 'red'}">${result.isCorrect ? 'Correct' : 'Incorrect'}</span>
            </div>
            <h3>${escapeHtml(result.question.question)}</h3>
            <p><strong>Your answer:</strong> ${escapeHtml(result.userAnswer !== undefined ? result.question.choices[result.userAnswer] : 'Not answered')}</p>
            <p><strong>Correct answer:</strong> ${escapeHtml(result.question.choices[result.question.answerIndex])}</p>
            <p class="small">${escapeHtml(result.question.explanation)}</p>
          </article>
        `).join('')}
      </section>
    </section>
  `;
}

export function renderNotFound() {
  return `
    <section class="card empty-state">
      <h2>Route not found</h2>
      <p>Try Home, Roles, Modules, Topics, Coding, Use Cases, Quiz, or Bookmarks.</p>
      <p><a class="button-link" href="#/home">Go to Home</a></p>
    </section>
  `;
}
