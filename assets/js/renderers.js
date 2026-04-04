
import { buildMetaChips, escapeHtml, formatCount, truncate } from './utils.js';
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
  const route = `#/${type}/${entity.slug}`;
  return `
    <article class="card item-card">
      <div class="title-row">
        <div>
          <div class="badges"><span class="badge">${escapeHtml(type === 'roles' ? 'Role' : type === 'modules' ? 'Module' : 'Topic')}</span></div>
          <h3>${escapeHtml(entity.name)}</h3>
          <p>${escapeHtml(entity.summary || entity.category || '')}</p>
        </div>
      </div>
      <div class="meta-inline">
        ${counts.study ? `<span class="badge green">${escapeHtml(`${counts.study} related items`)}</span>` : ''}
        ${counts.modules ? `<span class="badge">${escapeHtml(`${counts.modules} modules`)}</span>` : ''}
        ${counts.topics ? `<span class="badge">${escapeHtml(`${counts.topics} topics`)}</span>` : ''}
      </div>
      <div class="footer-row">
        <span class="small">${escapeHtml(type === 'topics' ? entity.category || 'Topic' : type.slice(0, -1))}</span>
        <a class="link-arrow" href="${route}">Explore →</a>
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
  const featuredModules = modules.slice(0, 6);
  const featuredTopics = topics.slice(0, 6);
  const featuredItems = [...coding.slice(0, 2), ...useCases.slice(0, 2), ...theory.slice(0, 2)];

  return `
    <section class="hero">
      <article class="card hero-copy">
        <div class="badges">
          <span class="badge green">Phase 1 scope</span>
          <span class="badge">GitHub Pages</span>
          <span class="badge orange">GA4 enabled</span>
        </div>
        <h2>Prepare by role, module, topic, coding question, or real implementation use case.</h2>
        <p>This static GitHub Pages build is structured to scale toward a very large ServiceNow interview knowledge base without forcing local installs. The current repo ships broad taxonomy coverage plus seeded exact-answer content, quiz mode, bookmarks, and analytics.</p>
        <div class="hero-actions">
          <a class="button-link" href="#/roles">Start with roles</a>
          <a class="button secondary" href="#/quiz">Open quiz</a>
          <a class="button secondary" href="#/bookmarks">Review bookmarks</a>
        </div>
      </article>

      <article class="card">
        <div class="section-header">
          <div>
            <h2>Coverage snapshot</h2>
            <p>Current seeded baseline inside the repo.</p>
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

    <section class="card">
      <div class="section-header">
        <div>
          <h2>What this repo is doing</h2>
          <p>It separates architecture, content, and navigation so you can keep expanding directly in GitHub.</p>
        </div>
      </div>
      <div class="coverage-list">
        ${coverage.status.map((row) => `<div class="coverage-row"><span>${escapeHtml(row.area)}</span><span class="badge ${row.status === 'Expansion ready' ? 'orange' : 'green'}">${escapeHtml(row.status)}</span></div>`).join('')}
      </div>
      <hr class="soft" />
      <div class="notice">The taxonomy is broad and expansion-ready. The seeded content is intentionally structured so you can grow the repo toward the larger 5,000+ vision without rewriting the app shell.</div>
    </section>

    <section>
      <div class="section-header">
        <div>
          <h2>Featured modules</h2>
          <p>Jump into common interview-heavy areas first.</p>
        </div>
      </div>
      <div class="grid cards-3">
        ${featuredModules.map((module) => entityCard(module, 'modules', { study: [...theory, ...coding, ...useCases].filter((item) => (item.moduleIds || []).includes(module.id)).length })).join('')}
      </div>
    </section>

    <section>
      <div class="section-header">
        <div>
          <h2>Featured topics</h2>
          <p>Focus on tricky or commonly asked concepts.</p>
        </div>
      </div>
      <div class="grid cards-3">
        ${featuredTopics.map((topic) => entityCard(topic, 'topics', { study: [...theory, ...coding, ...useCases].filter((item) => (item.topicIds || []).includes(topic.id)).length })).join('')}
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
  const allStudy = [...state.data.theory, ...state.data.coding, ...state.data.useCases];
  return `
    <section class="section-header">
      <div>
        <h2>Roles</h2>
        <p>Browse interview prep by the job family or implementation role you are targeting.</p>
      </div>
    </section>
    <div class="grid cards-3">
      ${state.data.roles.map((role) => entityCard(role, 'roles', {
        modules: (role.moduleIds || []).length,
        study: allStudy.filter((item) => (item.roleIds || []).includes(role.id)).length
      })).join('')}
    </div>
  `;
}

export function renderRoleDetail(state, role, related) {
  const modules = role.moduleIds.map((id) => state.lookups.modulesById[id]).filter(Boolean);
  return `
    <nav class="breadcrumbs"><a href="#/roles">Roles</a><span class="sep">/</span><span>${escapeHtml(role.name)}</span></nav>
    <section class="card">
      <div class="section-header">
        <div>
          <h2>${escapeHtml(role.name)}</h2>
          <p>${escapeHtml(role.summary)}</p>
        </div>
      </div>
      <div class="badges">
        <span class="badge green">${escapeHtml(`${related.length} related study items`)}</span>
        <span class="badge">${escapeHtml(`${modules.length} mapped modules`)}</span>
      </div>
    </section>

    <section>
      <div class="section-header">
        <div><h2>Mapped modules</h2><p>Use this as your first pass for role-based preparation.</p></div>
      </div>
      <div class="grid cards-3">
        ${modules.map((module) => entityCard(module, 'modules', { study: related.filter((item) => (item.moduleIds || []).includes(module.id)).length })).join('')}
      </div>
    </section>

    ${relatedSection(related.slice(0, 8), state.lookups, 'Best starting items for this role')}
  `;
}

export function renderModulesPage(state) {
  const allStudy = [...state.data.theory, ...state.data.coding, ...state.data.useCases];
  return `
    <section class="section-header">
      <div>
        <h2>Modules / Product Areas</h2>
        <p>Browse the hub by ServiceNow product area and platform capability.</p>
      </div>
    </section>
    <div class="grid cards-3">
      ${state.data.modules.map((module) => entityCard(module, 'modules', { study: allStudy.filter((item) => (item.moduleIds || []).includes(module.id)).length })).join('')}
    </div>
  `;
}

export function renderModuleDetail(state, module, related) {
  const relatedTopics = state.data.topics.filter((topic) => related.some((item) => (item.topicIds || []).includes(topic.id))).slice(0, 12);
  return `
    <nav class="breadcrumbs"><a href="#/modules">Modules</a><span class="sep">/</span><span>${escapeHtml(module.name)}</span></nav>
    <section class="card">
      <div class="section-header">
        <div>
          <h2>${escapeHtml(module.name)}</h2>
          <p>${escapeHtml(module.summary)}</p>
        </div>
      </div>
      <div class="badges"><span class="badge green">${escapeHtml(`${related.length} related study items`)}</span></div>
    </section>

    <section>
      <div class="section-header">
        <div><h2>Related topics</h2><p>Topic coverage currently linked to this module.</p></div>
      </div>
      <div class="grid cards-3">
        ${relatedTopics.map((topic) => entityCard(topic, 'topics', { study: related.filter((item) => (item.topicIds || []).includes(topic.id)).length })).join('')}
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
  const allStudy = [...state.data.theory, ...state.data.coding, ...state.data.useCases];
  return `
    <section class="section-header">
      <div>
        <h2>Topics</h2>
        <p>Deep-dive by exact platform concept, table, API, automation pattern, or module-specific capability.</p>
      </div>
    </section>
    ${filterBar({ route: '/topics', filters, roles: [], modules: [], topics: [], categories, showRole: false, showModule: false, showTopic: false, showDifficulty: false, showSearch: true, showCategory: true })}
    <div class="grid cards-3">
      ${topics.map((topic) => entityCard(topic, 'topics', { study: allStudy.filter((item) => (item.topicIds || []).includes(topic.id)).length })).join('')}
    </div>
  `;
}

export function renderTopicDetail(state, topic, related) {
  const grouped = {
    theory: related.filter((item) => item.contentType !== 'coding' && item.contentType !== 'use-case'),
    coding: related.filter((item) => item.contentType === 'coding'),
    useCases: related.filter((item) => item.contentType === 'use-case')
  };
  return `
    <nav class="breadcrumbs"><a href="#/topics">Topics</a><span class="sep">/</span><span>${escapeHtml(topic.name)}</span></nav>
    <section class="card">
      <div class="section-header">
        <div>
          <h2>${escapeHtml(topic.name)}</h2>
          <p>${escapeHtml(topic.category)} topic with exact-answer content, coding, and use-case coverage.</p>
        </div>
      </div>
      <div class="badges">
        <span class="badge">${escapeHtml(topic.category)}</span>
        <span class="badge green">${escapeHtml(`${related.length} related items`)}</span>
      </div>
    </section>
    ${grouped.theory.length ? relatedSection(grouped.theory, state.lookups, 'Concept and explanation items') : ''}
    ${grouped.coding.length ? relatedSection(grouped.coding, state.lookups, 'Coding questions under this topic') : ''}
    ${grouped.useCases.length ? relatedSection(grouped.useCases, state.lookups, 'Use cases under this topic') : ''}
  `;
}

export function renderCodingPage(state, items, filters) {
  return `
    <section class="section-header">
      <div>
        <h2>Coding questions</h2>
        <p>Exact script answers, where to configure them, and how to validate the output.</p>
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
    <section class="section-header">
      <div>
        <h2>Use cases</h2>
        <p>Implementation-style answers with navigation paths, steps, and validation checklists.</p>
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
        <p>Save theory, coding, or use-case items from any detail page and they will show up here.</p>
      </section>
    `;
  }

  const grouped = {
    theory: bookmarkedItems.filter((item) => item.contentType !== 'coding' && item.contentType !== 'use-case'),
    coding: bookmarkedItems.filter((item) => item.contentType === 'coding'),
    useCases: bookmarkedItems.filter((item) => item.contentType === 'use-case')
  };

  return `
    <section class="section-header">
      <div>
        <h2>Bookmarks</h2>
        <p>Use this page to revisit weak areas and missed quiz concepts.</p>
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
      <article class="card">
        <div class="section-header">
          <div>
            <h2>Quiz setup</h2>
            <p>Choose scope, level, and question count before starting.</p>
          </div>
        </div>

        <form id="quiz-setup-form" class="filters" data-quiz-form>
          <label>
            Scope
            <select name="scope">
              <option value="mixed">Mixed</option>
              <option value="role">Role</option>
              <option value="module">Module</option>
              <option value="topic">Topic</option>
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

        <div class="notice">Tip: if you pick role/module/topic scope, the app uses the matching value field and ignores the others.</div>
      </article>
    </section>
  `;
}

export function renderQuizRunner(session) {
  const question = session.questions[session.currentIndex];
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
