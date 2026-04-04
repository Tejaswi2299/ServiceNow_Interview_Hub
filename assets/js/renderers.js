
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
function backButton(fallback = '#/home', label = '← Back') {
  return `
    <div class="page-back-wrap">
      <button
        type="button"
        class="page-back-button"
        data-back-button
        data-fallback="${fallback}"
        aria-label="Go back"
      >
        ${label}
      </button>
    </div>
  `;
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
    quiz: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 4"/><path d="M12 17h.01"/></svg>`,
    developer: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/><path d="M12 16v4"/><path d="m9 10-2 2 2 2"/><path d="m15 10 2 2-2 2"/></svg>`,
    architect: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h16"/><path d="M6 20V8l6-4 6 4v12"/><path d="M9 10h6"/><path d="M9 14h6"/></svg>`,
    admin: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8 1.65 1.65 0 0 0 4.27 6.18l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8c.64.22 1.2.77 1.51 1.41.07.18.09.38.09.59a2 2 0 1 1 0 4h-.09c-.72 0-1.37.44-1.51 1Z"/></svg>`,
    manager: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="7" width="16" height="11" rx="2"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/><path d="M4 12h16"/></svg>`,
    analyst: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20h18"/><path d="M7 16v-6"/><path d="M12 16V8"/><path d="M17 16v-3"/></svg>`,
    shield: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3Z"/><path d="m9.5 12 1.7 1.7 3.3-3.7"/></svg>`,
    database: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>`,
    box: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z"/><path d="M4 7.5V16.5L12 21l8-4.5V7.5"/><path d="M12 12v9"/></svg>`,
    workflow: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="7" height="5" rx="1.5"/><rect x="14" y="4" width="7" height="5" rx="1.5"/><rect x="8.5" y="15" width="7" height="5" rx="1.5"/><path d="M10 6.5h4"/><path d="M12 9v6"/></svg>`,
    cloud: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 18a4 4 0 0 0 .7-7.94A6 6 0 0 0 7.4 8.2 4.5 4.5 0 0 0 7.5 18H18Z"/></svg>`,
    catalog: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l-1 11H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>`,
    table: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M9 4v16"/><path d="M15 4v16"/></svg>`,
    wrench: `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2-2 2.4-2.4Z"/></svg>`
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
  const text = `${entity.name || ''} ${entity.summary || ''} ${entity.category || ''}`.toLowerCase();
  if (type === 'roles') {
    if (/architect/.test(text)) return 'architect';
    if (/admin|administrator/.test(text)) return 'admin';
    if (/manager|owner/.test(text)) return 'manager';
    if (/analyst|consultant/.test(text)) return 'analyst';
    if (/security|secops|vulnerability|sir/.test(text)) return 'shield';
    if (/asset|ham|sam|itam/.test(text)) return 'box';
    if (/cmdb|discovery|cloud/.test(text)) return 'database';
    if (/flow|workspace|portal|catalog/.test(text)) return 'workflow';
    return 'developer';
  }
  if (type === 'modules') {
    if (/security|secops|grc|risk|audit|acl/.test(text)) return 'shield';
    if (/asset|ham|sam|itam/.test(text)) return 'box';
    if (/cmdb|discovery|service mapping|event management/.test(text)) return 'database';
    if (/flow|integration|app engine|workspace|portal|virtual agent/.test(text)) return 'workflow';
    if (/cloud/.test(text)) return 'cloud';
    if (/catalog|knowledge|request/.test(text)) return 'catalog';
    return 'module';
  }
  if (type === 'topics') {
    if (/script|glide|api|json|rest|soap|transform/.test(text)) return 'coding';
    if (/table|dictionary|schema|query|reference/.test(text)) return 'table';
    if (/acl|security|domain/.test(text)) return 'shield';
    if (/debug|performance|log|repair|troubleshoot/.test(text)) return 'wrench';
    if (/flow|approval|assignment|notification|sla/.test(text)) return 'workflow';
    return 'topic';
  }
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

function entityTags(entity, type, lookups = {}) {
  if (type === 'roles') {
    return (entity.moduleIds || []).slice(0, 3).map((id) => lookups.modulesById?.[id]?.name).filter(Boolean).map((name) => truncate(name, 18));
  }
  if (type === 'modules') {
    const summary = `${entity.summary || ''}`.split(',').map((item) => item.trim()).filter(Boolean);
    return summary.slice(0, 3).map((name) => truncate(name, 18));
  }
  if (type === 'topics') {
    return [entity.category].filter(Boolean).map((name) => truncate(name, 18));
  }
  return [];
}

function entityCard(entity, type, lookups = {}) {
  const route = entity.route || `#/${type}/${entity.slug}`;
  const typeLabel = type === 'roles' ? 'role' : type === 'modules' ? 'module' : type === 'topics' ? 'topic' : type;
  const iconName = iconForEntity(type, entity);
  const tags = entityTags(entity, type, lookups);

  return `
    <a class="card item-card entity-card entity-card-link entity-card-${escapeHtml(typeLabel)}" href="${route}" data-entity-type="${escapeHtml(typeLabel)}" data-entity-id="${escapeHtml(entity.id)}" aria-label="Open ${escapeHtml(entity.name)}">
      <div class="entity-card-inline">
        <div class="entity-icon-wrap ${escapeHtml(typeLabel)}">${iconSvg(iconName)}</div>
        <div class="entity-copy compact inline-copy">
          <h3>${escapeHtml(entity.name)}</h3>
          <p>${escapeHtml(entity.summary || entity.category || '')}</p>
        </div>
        <span class="entity-open-chip" aria-hidden="true">${chevronSvg()}</span>
      </div>
      ${tags.length ? `<div class="meta-inline entity-tags">${tags.map((tag) => `<span class="badge subtle">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
    </a>
  `;
}

function groupedTopicAccordions(items, lookups, titleFallback = 'General', preferredTopicIds = []) {
  const preferred = new Set(preferredTopicIds || []);
  const groups = new Map();
  items.forEach((item) => {
    const itemTopicIds = item.topicIds || [];
    const preferredTopicId = itemTopicIds.find((topicId) => preferred.has(topicId));
    const topicId = preferredTopicId || itemTopicIds[0] || '';
    const topicName = lookups.topicsById?.[topicId]?.name || titleFallback;
    if (!groups.has(topicName)) groups.set(topicName, []);
    groups.get(topicName).push(item);
  });
  return [...groups.entries()]
    .map(([title, groupItems]) => ({
      title,
      items: groupItems.sort((a, b) => a.title.localeCompare(b.title))
    }))
    .sort((a, b) => b.items.length - a.items.length || a.title.localeCompare(b.title));
}

function groupedTypeAccordions(items) {
  const labels = {
    theory: 'Concepts & Explanations',
    comparison: 'Comparisons & Tricky Differences',
    troubleshooting: 'Troubleshooting',
    'table-schema': 'Tables & Schema',
    'best-practice': 'Best Practices',
    tricky: 'Tricky Questions',
    coding: 'Coding Questions',
    'use-case': 'Use Cases'
  };
  const groups = new Map();
  items.forEach((item) => {
    const key = item.contentType;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });
  return [...groups.entries()]
    .map(([key, groupItems]) => ({ title: labels[key] || labelForContentType(key), items: groupItems.sort((a, b) => a.title.localeCompare(b.title)) }))
    .sort((a, b) => b.items.length - a.items.length || a.title.localeCompare(b.title));
}

function studyRow(item) {
  const typeTone = item.contentType === 'coding' ? 'blue' : item.contentType === 'use-case' ? 'orange' : 'green';
  return `
    <a class="study-row" href="${linkForItem(item)}">
      <div class="study-row-main">
        <span class="study-row-icon">${iconSvg(iconForEntity(item.contentType === 'use-case' ? 'use-cases' : item.contentType, item), 'study-mini-icon')}</span>
        <span class="study-row-title">${escapeHtml(item.title)}</span>
      </div>
      <div class="study-row-meta">
        <span class="badge subtle">${escapeHtml(item.difficulty)}</span>
      </div>
    </a>
  `;
}

function renderAccordionSet(groups, title, subtitle = '') {
  if (!groups.length) return `<section class="card empty-state"><h2>No study items mapped yet</h2><p>More content will appear here as the hub expands.</p></section>`;
  return `
    <section>
      <div class="section-header">
        <div>
          <h2>${escapeHtml(title)}</h2>
          ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''}
        </div>
      </div>
      <div class="accordion-stack">
        ${groups.map((group, index) => `
          <details class="study-accordion" ${index === 0 ? 'open' : ''}>
            <summary>
              <span class="accordion-summary-left">
                <span class="accordion-icon-wrap">${iconSvg(iconForEntity('topics', { name: group.title }), 'accordion-icon')}</span>
                <span>
                  <strong>${escapeHtml(group.title)}</strong>
                  <small>${escapeHtml(formatCount(group.items.length))} questions</small>
                </span>
              </span>
              <span class="accordion-caret">▾</span>
            </summary>
            <div class="accordion-panel">
              ${group.items.map((item) => studyRow(item)).join('')}
            </div>
          </details>
        `).join('')}
      </div>
    </section>
  `;
}

function simpleBanner(title, description, iconName = 'module', extra = '') {
  return `
    <section class="card clean-banner">
      <div class="clean-banner-head">
        <div class="clean-banner-icon">${iconSvg(iconName)}</div>
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(description)}</p>
        </div>
      </div>
      ${extra}
    </section>
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
  const { coverage, theory, coding, useCases } = state.data;
  const quickCards = [
    { id: 'home-roles', slug: 'roles', route: '#/roles', name: 'Browse by role', summary: 'Choose the job family you are targeting and study the most relevant topics for that role.' },
    { id: 'home-modules', slug: 'modules', route: '#/modules', name: 'Browse by module', summary: 'Go straight into ITSM, CMDB, Discovery, GRC, SecOps, HAM, SAM, and more.' },
    { id: 'home-topics', slug: 'topics', route: '#/topics', name: 'Browse by topic', summary: 'Focus on exact concepts like Business Rules, GlideRecord, ACLs, CMDB relationships, and more.' }
  ];
  const focusModules = ['itsm', 'cmdb', 'discovery', 'grc', 'secops', 'ham', 'sam']
    .map((id) => state.lookups.modulesById[id])
    .filter(Boolean);
  const featuredItems = [...coding.slice(0, 2), ...useCases.slice(0, 2), ...theory.slice(0, 2)];

  return `
    <section class="hero enterprise-hero home-hero-simple">
      <article class="card hero-copy accent-panel">
        <h2>Prepare by role, module, topic, coding question, or real implementation scenario.</h2>
        <p>Use this hub to study exact answers, practical scripts, and step-by-step ServiceNow scenarios without jumping through unnecessary layers.</p>
        <div class="hero-actions">
          <a class="button-link" href="#/roles">Start with roles</a>
          <a class="button secondary" href="#/quiz">Open quiz</a>
          <a class="button secondary" href="#/bookmarks">Review bookmarks</a>
          <a class="button support-button" href="https://cash.app/$TEJASWIREDDYAnapalli" target="_blank" rel="noopener noreferrer" data-support-link="cashapp-home">Buy me a coffee ☕</a>
        </div>
      </article>

      <article class="card">
        <div class="section-header compact-header">
          <div>
            <h2>At a glance</h2>
            <p>Current interview coverage across the hub.</p>
          </div>
        </div>
        <div class="stat-grid simple-stats">
          <div class="stat-tile"><span>Roles</span><strong>${formatCount(coverage.currentCounts.roles)}</strong></div>
          <div class="stat-tile"><span>Modules</span><strong>${formatCount(coverage.currentCounts.modules)}</strong></div>
          <div class="stat-tile"><span>Topics</span><strong>${formatCount(coverage.currentCounts.topics)}</strong></div>
          <div class="stat-tile"><span>Questions & scenarios</span><strong>${formatCount(coverage.currentCounts.totalSeededStudyItems)}</strong></div>
        </div>
      </article>
    </section>

    <section>
      <div class="section-header">
        <div>
          <h2>Start here</h2>
          <p>Jump in the way you prefer to study.</p>
        </div>
      </div>
      <div class="grid cards-3">
        ${quickCards.map((card, index) => entityCard(card, index === 0 ? 'roles' : index === 1 ? 'modules' : 'topics', state.lookups)).join('')}
      </div>
    </section>

    <section>
      <div class="section-header">
        <div>
          <h2>Focus areas</h2>
          <p>High-priority platform areas for interview preparation.</p>
        </div>
      </div>
      <div class="grid cards-3">
        ${focusModules.map((module) => entityCard(module, 'modules', state.lookups)).join('')}
      </div>
    </section>

    <section>
      <div class="section-header">
        <div>
          <h2>Featured study items</h2>
          <p>Start with a few exact-answer questions and implementation scenarios.</p>
        </div>
      </div>
      <div class="grid cards-2">
        ${featuredItems.map((item) => itemCard(item, state.lookups)).join('')}
      </div>
    </section>
  `;
}



function renderTopicNavigation(topics) {
  if (!topics.length) return '';
  return `
    <section>
      <div class="section-header">
        <div>
          <h2>Topic coverage</h2>
          <p>Open a topic to study everything mapped under it.</p>
        </div>
      </div>
      <div class="grid cards-3 topic-nav-grid">
        ${topics.map((topic) => entityCard(topic, 'topics')).join('')}
      </div>
    </section>
  `;
}

function splitStudyItems(items) {
  return {
    conceptItems: items.filter((item) => item.contentType !== 'coding' && item.contentType !== 'use-case'),
    codingItems: items.filter((item) => item.contentType === 'coding'),
    useCaseItems: items.filter((item) => item.contentType === 'use-case')
  };
}



export function renderRolesPage(state) {
  return `
    ${simpleBanner('Browse by role', 'Select your target role to see the most relevant topics, coding questions, and use cases.', 'role')}
    <div class="grid cards-3">
      ${state.data.roles.map((role) => entityCard(role, 'roles', state.lookups)).join('')}
    </div>
  `;
}



export function renderRoleDetail(state, role, related) {
  const modules = (role.moduleIds || []).map((id) => state.lookups.modulesById[id]).filter(Boolean);
  const mappedTopicIds = unique([...(role.topicIds || []), ...((state.data.maps.roleTopic[role.id] || state.data.maps.roleTopic[role.slug] || [])), ...related.flatMap((item) => item.topicIds || [])]);
  const mappedTopics = mappedTopicIds.map((id) => state.lookups.topicsById[id]).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
  const { conceptItems, codingItems, useCaseItems } = splitStudyItems(related);
  const conceptGroups = groupedTopicAccordions(conceptItems, state.lookups, 'Concepts', mappedTopicIds);
  const codingGroups = groupedTopicAccordions(codingItems, state.lookups, 'Coding', mappedTopicIds);
  const useCaseGroups = groupedTopicAccordions(useCaseItems, state.lookups, 'Use cases', mappedTopicIds);
  return `
    <nav class="breadcrumbs"><a href="#/roles">Roles</a><span class="sep">/</span><span>${escapeHtml(role.name)}</span></nav>
    <section class="card entity-detail-hero compact-detail-hero clean-detail-hero">
      <div class="entity-card-inline detail-inline">
        <div class="entity-icon-wrap role">${iconSvg(iconForEntity('roles', role))}</div>
        <div class="entity-copy inline-copy">
          <h2>${escapeHtml(role.name)}</h2>
          <p>${escapeHtml(role.summary)}</p>
        </div>
      </div>
      ${modules.length ? `<div class="meta-inline role-module-pills">${modules.slice(0, 10).map((module) => `<a class="badge subtle" href="#/modules/${module.slug}">${escapeHtml(module.name)}</a>`).join('')}</div>` : ''}
    </section>
    ${renderTopicNavigation(mappedTopics)}
    ${renderAccordionSet(conceptGroups, 'Concepts & tricky questions', 'Core interview explanations and tricky distinctions for this role.')}
    ${renderAccordionSet(codingGroups, 'Coding questions', 'Exact scripts and coding drills connected to this role.')}
    ${renderAccordionSet(useCaseGroups, 'Use case scenarios', 'Step-by-step implementation scenarios connected to this role.')}
  `;
}



export function renderModulesPage(state) {
  return `
    ${simpleBanner('Browse by module', 'Open a product area to study the topics and questions underneath it.', 'module')}
    <div class="grid cards-3">
      ${state.data.modules.map((module) => entityCard(module, 'modules', state.lookups)).join('')}
    </div>
  `;
}



export function renderModuleDetail(state, module, related) {
  const mappedTopicIds = unique([...(module.topicIds || []), ...((state.data.maps.moduleTopic[module.id] || state.data.maps.moduleTopic[module.slug] || [])), ...related.flatMap((item) => item.topicIds || [])]);
  const mappedTopics = mappedTopicIds.map((id) => state.lookups.topicsById[id]).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
  const { conceptItems, codingItems, useCaseItems } = splitStudyItems(related);
  const conceptGroups = groupedTopicAccordions(conceptItems, state.lookups, 'Concepts', mappedTopicIds);
  const codingGroups = groupedTopicAccordions(codingItems, state.lookups, 'Coding', mappedTopicIds);
  const useCaseGroups = groupedTopicAccordions(useCaseItems, state.lookups, 'Use cases', mappedTopicIds);
  return `
    <nav class="breadcrumbs"><a href="#/modules">Modules</a><span class="sep">/</span><span>${escapeHtml(module.name)}</span></nav>
    <section class="card entity-detail-hero compact-detail-hero clean-detail-hero">
      <div class="entity-card-inline detail-inline">
        <div class="entity-icon-wrap module">${iconSvg(iconForEntity('modules', module))}</div>
        <div class="entity-copy inline-copy">
          <h2>${escapeHtml(module.name)}</h2>
          <p>${escapeHtml(module.summary)}</p>
        </div>
      </div>
    </section>
    ${renderTopicNavigation(mappedTopics)}
    ${renderAccordionSet(conceptGroups, 'Concepts & tricky questions', 'Core interview explanations and tricky distinctions for this module.')}
    ${renderAccordionSet(codingGroups, 'Coding questions', 'Exact scripts and coding drills connected to this module.')}
    ${renderAccordionSet(useCaseGroups, 'Use case scenarios', 'Step-by-step implementation scenarios connected to this module.')}
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
  return `
    ${simpleBanner('Browse by topic', 'Choose an exact concept, API, table, or tricky distinction and study everything under it.', 'topic')}
    ${filterBar({ route: '/topics', filters, roles: [], modules: [], topics: [], categories, showRole: false, showModule: false, showTopic: false, showDifficulty: false, showSearch: true, showCategory: true })}
    <div class="grid cards-3">
      ${topics.map((topic) => entityCard(topic, 'topics', state.lookups)).join('')}
    </div>
  `;
}



export function renderTopicDetail(state, topic, related) {
  const groups = groupedTypeAccordions(related);
  return `
    <nav class="breadcrumbs"><a href="#/topics">Topics</a><span class="sep">/</span><span>${escapeHtml(topic.name)}</span></nav>
    <section class="card entity-detail-hero compact-detail-hero">
      <div class="entity-card-inline detail-inline">
        <div class="entity-icon-wrap topic">${iconSvg(iconForEntity('topics', topic))}</div>
        <div class="entity-copy inline-copy">
          <h2>${escapeHtml(topic.name)}</h2>
          <p>${escapeHtml(topic.category || 'Open each section below to study the exact questions mapped to this topic.')}</p>
        </div>
      </div>
    </section>
    ${renderAccordionSet(groups, 'Study content', 'Concepts, coding questions, and use cases under this topic.')}
  `;
}



export function renderCodingPage(state, items, filters) {
  return `
    ${simpleBanner('Coding questions', 'Exact script answers, where to write them, and how to validate the output.', 'coding')}
    ${filterBar({ route: '/coding', filters, roles: state.data.roles, modules: state.data.modules, topics: state.data.topics })}
    <div class="grid cards-2">
      ${items.map((item) => itemCard(item, state.lookups)).join('') || '<section class="card empty-state"><h2>No coding items match this filter.</h2><p>Clear one or more filters and try again.</p></section>'}
    </div>
  `;
}




export function renderUseCasesPage(state, items, filters) {
  return `
    ${simpleBanner('Use cases', 'Implementation-style answers with navigation paths, steps, validation checks, and common traps.', 'usecase')}
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
