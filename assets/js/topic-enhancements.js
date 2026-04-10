import { escapeHtml, formatCount, unique } from './utils.js';

const TRICKY_CONTENT_TYPES = ['tricky', 'comparison', 'troubleshooting'];

function enhancementStyles() {
  return `
    .topic-overview-card{margin-bottom:18px;}
    .topic-overview-header{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;flex-wrap:wrap;}
    .topic-overview-kicker{margin:0 0 6px;color:var(--muted);font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;}
    .topic-overview-subtitle{margin:6px 0 0;color:var(--muted);}
    .topic-overview-metrics{display:flex;gap:10px;flex-wrap:wrap;}
    .topic-overview-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:18px;}
    .topic-overview-block{padding:16px;border-radius:16px;border:1px solid var(--border);background:rgba(255,255,255,.03);}
    .topic-overview-block h3{margin:0 0 10px;}
    .topic-overview-block p,.topic-overview-block li{color:var(--muted);line-height:1.6;}
    .topic-overview-block ul{margin:0;padding-left:1.1rem;}
    .topic-overview-footer{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:18px;}
    .topic-chip-list{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;}
    .topic-section-nav{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;}
    .topic-section-pill{display:inline-flex;align-items:center;justify-content:center;padding:10px 14px;border-radius:999px;border:1px solid var(--border);background:rgba(255,255,255,.03);color:var(--text);font-weight:600;cursor:pointer;}
    .topic-section-pill:hover{border-color:rgba(56,189,248,.35);background:rgba(56,189,248,.08);}
    .topic-section-wrap{margin-bottom:18px;}
    .tricky-page-banner .clean-banner-head{align-items:center;}
    .filter-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap;}
    @media (max-width:880px){.topic-overview-grid,.topic-overview-footer{grid-template-columns:1fr;}}
  `;
}

function ensureEnhancementStyles() {
  if (document.getElementById('topic-enhancement-styles')) return;
  const styleNode = document.createElement('style');
  styleNode.id = 'topic-enhancement-styles';
  styleNode.textContent = enhancementStyles();
  document.head.appendChild(styleNode);
}

function trickyNavMarkup() {
  return `
    <a data-nav-link href="#/tricky">
      <span class="nav-link-content">
        <span class="nav-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3l7 4v5c0 4.4-2.7 7.8-7 9-4.3-1.2-7-4.6-7-9V7l7-4Z"/>
            <path d="M9.5 10.5h5"/>
            <path d="M9.5 14h5"/>
          </svg>
        </span>
        <span>Tricky Questions</span>
      </span>
    </a>
  `;
}

export function ensureEnhancementAssets() {
  ensureEnhancementStyles();
  const nav = document.querySelector('.sidebar-nav');
  if (nav && !nav.querySelector('[href="#/tricky"]')) {
    const topicsLink = nav.querySelector('[href="#/topics"]');
    if (topicsLink) {
      topicsLink.insertAdjacentHTML('afterend', trickyNavMarkup());
    } else {
      nav.insertAdjacentHTML('beforeend', trickyNavMarkup());
    }
  }
}

function linkForItem(item) {
  if (!item) return '#/home';
  if (item.contentType === 'coding') return `#/coding/${item.slug}`;
  if (item.contentType === 'use-case') return `#/use-cases/${item.slug}`;
  return `#/study/${item.slug}`;
}

function topicOptionRows(topics, selectedId = '') {
  return topics
    .map((topic) => `<option value="${escapeHtml(topic.id)}" ${selectedId === topic.id ? 'selected' : ''}>${escapeHtml(topic.name)}</option>`)
    .join('');
}

function roleOptionRows(roles, selectedId = '') {
  return roles
    .map((role) => `<option value="${escapeHtml(role.id)}" ${selectedId === role.id ? 'selected' : ''}>${escapeHtml(role.name)}</option>`)
    .join('');
}

function moduleOptionRows(modules, selectedId = '') {
  return modules
    .map((module) => `<option value="${escapeHtml(module.id)}" ${selectedId === module.id ? 'selected' : ''}>${escapeHtml(module.name)}</option>`)
    .join('');
}

function renderTrickyCard(item, lookups) {
  const moduleNames = (item.moduleIds || []).slice(0, 3).map((id) => lookups.modulesById?.[id]?.name).filter(Boolean);
  const topicNames = (item.topicIds || []).slice(0, 3).map((id) => lookups.topicsById?.[id]?.name).filter(Boolean);
  return `
    <article class="card item-card">
      <div class="title-row">
        <div>
          <div class="badges">
            <span class="badge orange">${escapeHtml(item.difficulty || 'Interview')}</span>
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.summary || item.question || 'Open the item to review the full tricky explanation and exact answer.')}</p>
        </div>
      </div>
      <div class="meta-inline">
        ${moduleNames.map((name) => `<span class="badge subtle">${escapeHtml(name)}</span>`).join('')}
        ${topicNames.map((name) => `<span class="badge subtle">${escapeHtml(name)}</span>`).join('')}
      </div>
      <div class="footer-row">
        <span class="small">${escapeHtml(item.question || 'Open this tricky item')}</span>
        <a class="link-arrow" href="${linkForItem(item)}">Open →</a>
      </div>
    </article>
  `;
}

function safeFirstText(values = []) {
  return values.find((value) => `${value || ''}`.trim()) || '';
}

function getTrickyItems(items = []) {
  return items.filter((item) => TRICKY_CONTENT_TYPES.includes(item.contentType));
}

function getVerifiedOverview(state, topicId) {
  return state.lookups?.topicOverviewByTopicId?.[topicId] || null;
}

function topicCounts(relatedItems = []) {
  return {
    concepts: relatedItems.filter((item) => !['coding', 'use-case', ...TRICKY_CONTENT_TYPES].includes(item.contentType)).length,
    coding: relatedItems.filter((item) => item.contentType === 'coding').length,
    useCases: relatedItems.filter((item) => item.contentType === 'use-case').length,
    tricky: getTrickyItems(relatedItems).length
  };
}

function buildFallbackKeyComponents(topic, relatedTables = []) {
  return [
    `Core purpose and business value of ${topic.name}.`,
    `Where ${topic.name} is configured, scripted, or maintained in the platform.`,
    relatedTables.length
      ? `Records or tables commonly discussed with ${topic.name}: ${relatedTables.slice(0, 3).join(', ')}.`
      : `Key records, conditions, APIs, or dependencies that influence ${topic.name}.`,
    `How ${topic.name} is tested, validated, and debugged during implementation.`
  ];
}

function buildFallbackExamples(topic, moduleNames = []) {
  const moduleContext = moduleNames[0] || topic.category || 'the platform';
  const category = (topic.category || '').toLowerCase();

  if (category.includes('security')) {
    return [
      `Explain how you would validate ${topic.name} for a user who should have access and another user who should be denied access.`,
      `Describe a production example where ${topic.name} controls read, write, or execution behavior safely within ${moduleContext}.`
    ];
  }

  if (category.includes('cmdb') || category.includes('discovery')) {
    return [
      `Describe how ${topic.name} affects CI quality, identification, or operational visibility in ${moduleContext}.`,
      `Explain how you would troubleshoot ${topic.name} when records, relationships, or discovery results are not behaving as expected.`
    ];
  }

  if (category.includes('scripting') || category.includes('api') || category.includes('client/server')) {
    return [
      `Walk through a real requirement where ${topic.name} is used to control form behavior, record processing, or server-side logic.`,
      `Explain how you would test ${topic.name} end-to-end in a non-production instance before moving the change forward.`
    ];
  }

  if (category.includes('catalog') || category.includes('itsm')) {
    return [
      `Describe a service request or ticket workflow where ${topic.name} changes how work is routed, fulfilled, or validated.`,
      `Explain how ${topic.name} would be reviewed during defect triage when users report that the process is not behaving correctly.`
    ];
  }

  return [
    `Explain a production use case where ${topic.name} supports a real requirement in ${moduleContext}.`,
    `Describe how you would validate ${topic.name} after configuration so the business outcome is achieved without side effects.`
  ];
}

function buildFallbackPitfalls(topic) {
  const category = (topic.category || '').toLowerCase();
  const common = [
    `Confusing what ${topic.name} does with adjacent platform features instead of explaining its exact purpose.`,
    `Skipping validation of conditions, target records, or execution context before declaring ${topic.name} complete.`
  ];

  if (category.includes('security')) {
    return [
      ...common,
      `Overgranting access or validating only one user path instead of checking both allowed and denied outcomes for ${topic.name}.`
    ];
  }

  if (category.includes('cmdb') || category.includes('discovery')) {
    return [
      ...common,
      `Ignoring data quality, identification, reconciliation, or relationship impact when discussing ${topic.name}.`
    ];
  }

  if (category.includes('scripting') || category.includes('api')) {
    return [
      ...common,
      `Discussing ${topic.name} without covering debugging, test strategy, or side effects on the transaction.`
    ];
  }

  return [
    ...common,
    `Answering ${topic.name} only at a definition level instead of explaining implementation checks, validation, and interview tradeoffs.`
  ];
}

function buildTopicOverview(topic, relatedItems = [], state) {
  const verified = getVerifiedOverview(state, topic.id);
  const trickyItems = getTrickyItems(relatedItems);
  const conceptItems = relatedItems.filter((item) => !['coding', 'use-case', ...TRICKY_CONTENT_TYPES].includes(item.contentType));
  const leadItem = conceptItems.find((item) => item.contentType === 'theory') || conceptItems[0] || trickyItems[0] || null;
  const relatedTables = unique([...(verified?.tablesInvolved || []), ...relatedItems.flatMap((item) => item.relatedTables || [])]).slice(0, 8);
  const roleNames = unique(relatedItems.flatMap((item) => (item.roleIds || []).map((id) => state.lookups.rolesById?.[id]?.name).filter(Boolean))).slice(0, 4);
  const moduleNames = unique(relatedItems.flatMap((item) => (item.moduleIds || []).map((id) => state.lookups.modulesById?.[id]?.name).filter(Boolean))).slice(0, 4);
  const counts = topicCounts(relatedItems);

  const keyPoints = unique(conceptItems.flatMap((item) => item.keyPoints || [])).slice(0, 5);
  const finalKeyPoints = verified?.keyComponents?.length ? verified.keyComponents : (keyPoints.length ? keyPoints : buildFallbackKeyComponents(topic, relatedTables));

  const realTimeExamples = unique(conceptItems.flatMap((item) => item.examples || [])).slice(0, 3);
  const finalExamples = verified?.realTimeExamples?.length ? verified.realTimeExamples : (realTimeExamples.length ? realTimeExamples : buildFallbackExamples(topic, moduleNames));

  const pitfalls = unique([
    ...trickyItems.map((item) => item.question || item.title),
    ...relatedItems.filter((item) => item.contentType === 'comparison').map((item) => item.title),
    ...relatedItems.filter((item) => item.contentType === 'troubleshooting').map((item) => item.title)
  ]).slice(0, 5);
  const finalPitfalls = verified?.interviewPitfalls?.length ? verified.interviewPitfalls : (pitfalls.length ? pitfalls : buildFallbackPitfalls(topic));

  const definition = verified?.definition
    || leadItem?.exactAnswer
    || leadItem?.summary
    || `${topic.name} is a ${topic.category || 'ServiceNow'} topic in this hub. Use this page to understand what it does, how it is used, and how it is discussed in interviews.`;
  const whatItDoes = verified?.whatItDoes
    || leadItem?.summary
    || safeFirstText(finalKeyPoints)
    || `${topic.name} is currently linked to ${formatCount(relatedItems.length)} study item(s) inside the hub.`;

  return `
    <section class="card topic-overview-card" id="topic-overview">
      <div class="topic-overview-header">
        <div>
          <p class="topic-overview-kicker">Topic explanation</p>
          <h2>${escapeHtml(topic.name)}</h2>
          <p class="topic-overview-subtitle">${escapeHtml(topic.category || 'ServiceNow topic')}</p>
        </div>
        <div class="topic-overview-metrics">
          <span class="metric-pill"><strong>${formatCount(counts.concepts)}</strong><span>Concepts</span></span>
          <span class="metric-pill"><strong>${formatCount(counts.coding)}</strong><span>Coding</span></span>
          <span class="metric-pill"><strong>${formatCount(counts.useCases)}</strong><span>Use cases</span></span>
          <span class="metric-pill green"><strong>${formatCount(counts.tricky)}</strong><span>Tricky</span></span>
        </div>
      </div>

      <div class="topic-overview-grid">
        <section class="topic-overview-block topic-overview-definition">
          <h3>Definition</h3>
          <p>${escapeHtml(definition)}</p>
        </section>

        <section class="topic-overview-block">
          <h3>What it does</h3>
          <p>${escapeHtml(whatItDoes)}</p>
        </section>

        <section class="topic-overview-block">
          <h3>Key components</h3>
          <ul>${finalKeyPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul>
        </section>

        <section class="topic-overview-block">
          <h3>Tables involved</h3>
          ${relatedTables.length ? `<div class="topic-chip-list">${relatedTables.map((tableName) => `<span class="badge subtle">${escapeHtml(tableName)}</span>`).join('')}</div>` : `<p class="small">No related tables are mapped yet for this topic.</p>`}
        </section>

        <section class="topic-overview-block">
          <h3>Real-time example</h3>
          <ul>${finalExamples.map((example) => `<li>${escapeHtml(example)}</li>`).join('')}</ul>
        </section>

        <section class="topic-overview-block">
          <h3>Interview pitfalls</h3>
          <ul>${finalPitfalls.map((pitfall) => `<li>${escapeHtml(pitfall)}</li>`).join('')}</ul>
        </section>
      </div>

      <div class="topic-overview-footer">
        ${roleNames.length ? `<div><span class="small">Roles</span><div class="topic-chip-list">${roleNames.map((name) => `<span class="badge subtle">${escapeHtml(name)}</span>`).join('')}</div></div>` : ''}
        ${moduleNames.length ? `<div><span class="small">Modules</span><div class="topic-chip-list">${moduleNames.map((name) => `<span class="badge subtle">${escapeHtml(name)}</span>`).join('')}</div></div>` : ''}
      </div>
    </section>
  `;
}

function sectionWrapper(id, title, subtitle, content) {
  if (!content) return '';
  return `
    <section class="topic-section-wrap" id="${escapeHtml(id)}">
      <div class="section-header">
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(subtitle)}</p>
        </div>
      </div>
      ${content}
    </section>
  `;
}

function renderSectionNav(sections = []) {
  if (!sections.length) return '';
  return `
    <nav class="card topic-section-nav" aria-label="On this topic">
      ${sections.map((section) => `<button type="button" class="topic-section-pill" data-scroll-target="${escapeHtml(section.id)}">${escapeHtml(section.label)}</button>`).join('')}
    </nav>
  `;
}

export function renderTrickyPage(state, items, filters = {}) {
  return `
    <section class="card clean-banner tricky-page-banner">
      <div class="clean-banner-head">
        <div class="clean-banner-icon">?</div>
        <div>
          <h2>Tricky Questions</h2>
          <p>Review the mapped tricky, comparison, and troubleshooting content across roles, modules, and topics.</p>
        </div>
      </div>
    </section>

    <form class="filters card" data-filter-form="/tricky" data-auto-submit="false">
      <label>
        Role
        <select name="role" data-filter-control>
          <option value="">All roles</option>
          ${roleOptionRows(state.data.roles, filters.role || '')}
        </select>
      </label>
      <label>
        Module
        <select name="module" data-filter-control>
          <option value="">All modules</option>
          ${moduleOptionRows(state.data.modules, filters.module || '')}
        </select>
      </label>
      <label>
        Topic
        <select name="topic" data-filter-control>
          <option value="">All topics</option>
          ${topicOptionRows(state.data.topics, filters.topic || '')}
        </select>
      </label>
      <label>
        Difficulty
        <select name="difficulty" data-filter-control>
          <option value="">All levels</option>
          ${['Beginner', 'Intermediate', 'Advanced'].map((level) => `<option value="${level}" ${filters.difficulty === level ? 'selected' : ''}>${level}</option>`).join('')}
        </select>
      </label>
      <label>
        Search in page
        <input type="search" name="q" value="${escapeHtml(filters.q || '')}" placeholder="Filter tricky questions" data-filter-control />
      </label>
      <div class="filter-actions">
        <button class="button-link" type="submit">Apply filters</button>
        <a class="button secondary" href="#/tricky">Clear filters</a>
      </div>
    </form>

    <section class="section-header">
      <div>
        <h2>Results</h2>
        <p>${escapeHtml(formatCount(items.length))} tricky item(s) match the current filters.</p>
      </div>
    </section>

    <section class="grid cards-2">
      ${items.length
        ? items.map((item) => renderTrickyCard(item, state.lookups)).join('')
        : `<section class="card empty-state"><h2>No tricky questions match this filter.</h2><p>Try clearing the filters or broadening the search terms.</p></section>`
      }
    </section>
  `;
}

export function enhanceTopicDetailPage(state, topic, relatedItems = []) {
  const accordionStack = document.querySelector('.accordion-stack');
  const sourceSection = accordionStack?.closest('section') || document.querySelector('.empty-state')?.closest('section');
  if (!sourceSection) return;

  const accordionDetails = accordionStack ? [...accordionStack.querySelectorAll('.study-accordion')] : [];
  const sections = {
    concepts: [],
    coding: [],
    useCases: [],
    tricky: []
  };

  accordionDetails.forEach((detail) => {
    const label = (detail.querySelector('summary strong')?.textContent || '').trim().toLowerCase();
    if (label.includes('coding')) {
      sections.coding.push(detail.outerHTML);
      return;
    }
    if (label.includes('use case')) {
      sections.useCases.push(detail.outerHTML);
      return;
    }
    if (label.includes('tricky') || label.includes('comparison') || label.includes('troubleshoot')) {
      sections.tricky.push(detail.outerHTML);
      return;
    }
    sections.concepts.push(detail.outerHTML);
  });

  const visibleSections = [];
  if (sections.concepts.length) visibleSections.push({ id: 'topic-concepts', label: 'Concepts' });
  if (sections.coding.length) visibleSections.push({ id: 'topic-coding', label: 'Coding' });
  if (sections.useCases.length) visibleSections.push({ id: 'topic-use-cases', label: 'Use Cases' });
  if (sections.tricky.length) visibleSections.push({ id: 'topic-tricky', label: 'Tricky' });

  const fallbackBody = !visibleSections.length
    ? `<section class="card empty-state"><h2>No mapped study items yet</h2><p>This topic now includes a complete overview, but detailed question content has not been mapped yet. Use the definition, components, examples, and pitfalls above to prepare the topic.</p></section>`
    : '';

  const replacementHtml = [
    buildTopicOverview(topic, relatedItems, state),
    renderSectionNav(visibleSections),
    sectionWrapper('topic-concepts', 'Concepts & explanations', 'Read the mapped concepts first, then move into practice questions.', sections.concepts.join('')),
    sectionWrapper('topic-coding', 'Coding questions', 'Exact scripting drills mapped to this topic.', sections.coding.join('')),
    sectionWrapper('topic-use-cases', 'Use case scenarios', 'Implementation-style interview scenarios connected to this topic.', sections.useCases.join('')),
    sectionWrapper('topic-tricky', 'Tricky questions', 'Edge cases, interview traps, and tricky distinctions for this topic.', sections.tricky.join('')),
    fallbackBody
  ].join('');

  sourceSection.outerHTML = replacementHtml;

  const firstConceptAccordion = document.querySelector('#topic-concepts .study-accordion');
  if (firstConceptAccordion) {
    firstConceptAccordion.setAttribute('open', '');
  }
}
