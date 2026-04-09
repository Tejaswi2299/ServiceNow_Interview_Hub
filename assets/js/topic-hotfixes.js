import { escapeHtml, formatCount, unique } from './utils.js';

const TRICKY_TYPES = new Set(['tricky', 'comparison', 'troubleshooting']);

export function isTrickyStudyItem(item) {
  return TRICKY_TYPES.has(item?.contentType);
}

function hotfixStyles() {
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
    .topic-section-wrap{margin-bottom:18px;scroll-margin-top:88px;}
    .tricky-page-banner .clean-banner-head{align-items:center;}
    .tricky-type-badge{background:rgba(56,189,248,.14);color:#7dd3fc;border:1px solid rgba(125,211,252,.3);}
    .filter-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;}
    @media (max-width:880px){.topic-overview-grid,.topic-overview-footer{grid-template-columns:1fr;}}
  `;
}

function ensureStyles() {
  if (document.getElementById('topic-hotfix-styles')) return;
  const styleNode = document.createElement('style');
  styleNode.id = 'topic-hotfix-styles';
  styleNode.textContent = hotfixStyles();
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

export function ensureTopicHotfixAssets() {
  ensureStyles();
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

function labelForTrickyKind(item) {
  if (item.contentType === 'comparison') return 'Comparison';
  if (item.contentType === 'troubleshooting') return 'Troubleshooting';
  return 'Tricky';
}

function optionRows(items, selectedId = '') {
  return items
    .map((item) => `<option value="${escapeHtml(item.id)}" ${selectedId === item.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`)
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
            <span class="badge tricky-type-badge">${escapeHtml(labelForTrickyKind(item))}</span>
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

function topicCounts(relatedItems = []) {
  return {
    concepts: relatedItems.filter((item) => !['coding', 'use-case'].includes(item.contentType) && !isTrickyStudyItem(item)).length,
    coding: relatedItems.filter((item) => item.contentType === 'coding').length,
    useCases: relatedItems.filter((item) => item.contentType === 'use-case').length,
    tricky: relatedItems.filter((item) => isTrickyStudyItem(item)).length
  };
}

function keywordPack(topicName = '') {
  const name = topicName.toLowerCase();

  if (/acl|domain separation|impersonation|roles and groups|security/.test(name)) {
    return {
      keyComponents: [
        'Know the security boundary involved: which operation is being controlled, who is allowed, and what data visibility changes.',
        'Be ready to explain the evaluation path, not just the configuration screen.'
      ],
      examples: [
        `A real implementation example is using ${topicName} to let fulfilment teams work the record while still hiding sensitive fields from broader support users.`
      ],
      pitfalls: [
        `A common interview miss is explaining ${topicName} only as a role assignment topic instead of covering data visibility and runtime evaluation.`
      ]
    };
  }

  if (/business rule|client script|ui policy|script include|glide|g_form|gs api|glideajax|setworkflow|setabortaction|encoded quer|current and previous/.test(name)) {
    return {
      keyComponents: [
        'Explain the execution context clearly: client vs server, timing, and what object or API is available at runtime.',
        'Mention how the logic is tested and how recursion or unnecessary processing is avoided.'
      ],
      examples: [
        `A strong real-world example is using ${topicName} to validate input, update related records, or shape user behavior without breaking performance.`
      ],
      pitfalls: [
        `Do not mix client-side behavior with server-side behavior when answering ${topicName}; interviewers usually test that distinction.`,
        `Another common miss is forgetting execution timing and side effects for ${topicName}.`
      ]
    };
  }

  if (/catalog|variable|record producer|order guide|requested item/.test(name)) {
    return {
      keyComponents: [
        'Anchor the answer in requester experience, reusable input design, and fulfilment handoff.',
        'Mention how the topic affects requested items, tasks, approvals, or downstream automation.'
      ],
      examples: [
        `A common example is using ${topicName} to collect consistent requester data and pass it into fulfilment without duplicating configuration across many catalog items.`
      ],
      pitfalls: [
        `A common pitfall is describing ${topicName} only at design time and skipping how it affects RITMs, tasks, approvals, or catalog usability.`
      ]
    };
  }

  if (/flow|subflow|action|decision table|data pill|approval|notification|event|script action|scheduled job/.test(name)) {
    return {
      keyComponents: [
        'Explain the trigger, the decision logic, and what action happens downstream.',
        'Mention observability, idempotency, or how failures are handled when the automation runs in production.'
      ],
      examples: [
        `A real-world example is using ${topicName} to route work automatically, enrich a record, or notify the right team without manual follow-up.`
      ],
      pitfalls: [
        `Interview answers on ${topicName} often go weak when they skip trigger conditions, duplicate execution risk, or failure handling.`
      ]
    };
  }

  if (/cmdb|ci |ci$|identification|reconciliation|ire|service map|class manager|relationships|stale ci|duplicate ci/.test(name)) {
    return {
      keyComponents: [
        'Connect the answer to CI identity, data quality, class structure, and trusted sources.',
        'Explain how updates are governed so the CMDB stays reliable instead of becoming just a data dump.'
      ],
      examples: [
        `A practical example is using ${topicName} to keep a CI accurate when multiple tools send overlapping updates into the CMDB.`
      ],
      pitfalls: [
        `A common interview miss is treating ${topicName} as only a technical setting instead of explaining its impact on CMDB trust and downstream consumers.`
      ]
    };
  }

  if (/discovery|mid server|pattern|credential|ecc queue|probe|sensor|entry point/.test(name)) {
    return {
      keyComponents: [
        'Explain how credentials, MID communication, patterns, or classification steps influence the final discovered result.',
        'Mention where you would validate logs or ECC activity when results are incomplete.'
      ],
      examples: [
        `A common real-time example is troubleshooting ${topicName} when a server is reachable but the platform is not creating or updating the expected CI data.`
      ],
      pitfalls: [
        `Interviewers often expect you to connect ${topicName} to troubleshooting steps such as credentials, MID health, pattern behavior, or ECC queue inspection.`
      ]
    };
  }

  if (/import|transform|coalesce|data source|field map/.test(name)) {
    return {
      keyComponents: [
        'Be able to explain source data intake, matching logic, field mapping, and what determines insert vs update behavior.',
        'Mention how data quality is protected before bad records land in target tables.'
      ],
      examples: [
        `A good example is using ${topicName} to load external source data safely while preventing duplicates or malformed updates.`
      ],
      pitfalls: [
        `A common pitfall is talking about ${topicName} without mentioning coalesce behavior, transform scripts, or target-table impact.`
      ]
    };
  }

  if (/rest|soap|integration|spoke|data stream|restmessagev2|scripted rest/.test(name)) {
    return {
      keyComponents: [
        'Explain authentication, payload handling, response mapping, and error handling.',
        'Mention how you log, retry, or validate integration outcomes in production.'
      ],
      examples: [
        `A real implementation example is using ${topicName} to exchange records with an external system while controlling auth, payload shape, and failure visibility.`
      ],
      pitfalls: [
        `A weak interview answer on ${topicName} usually skips auth strategy, timeout or retry handling, and how errors are surfaced to operations.`
      ]
    };
  }

  if (/incident|problem|change|priority|sla|major incident|known error|root cause/.test(name)) {
    return {
      keyComponents: [
        'Tie the answer to lifecycle control, assignment or escalation behavior, and service impact.',
        'Mention the operational reason the process exists, not only the table or form.'
      ],
      examples: [
        `A realistic example is using ${topicName} to standardize how support teams route, prioritize, or restore service during a live outage or recurring issue.`
      ],
      pitfalls: [
        `A common pitfall is describing ${topicName} as a static form concept instead of an end-to-end operational process with states, ownership, and outcomes.`
      ]
    };
  }

  if (/asset|hardware|stockroom|model|license|entitlement|normalization|publisher pack|reclamation|software/.test(name)) {
    return {
      keyComponents: [
        'Explain the lifecycle or entitlement logic behind the topic, not only the UI screen.',
        'Mention how inventory, ownership, or compliance accuracy is preserved.'
      ],
      examples: [
        `A real project example is using ${topicName} to keep asset or software data aligned for audits, reclamation, or fulfilment decisions.`
      ],
      pitfalls: [
        `Interview answers on ${topicName} often miss the difference between record keeping and true lifecycle or compliance control.`
      ]
    };
  }

  if (/risk|control|policy|audit|vendor risk|attestation|issue management/.test(name)) {
    return {
      keyComponents: [
        'Connect the answer to governance, ownership, assessment cadence, and evidence collection.',
        'Mention how the topic supports risk reduction or audit readiness instead of being just a form design.'
      ],
      examples: [
        `A typical real-world example is using ${topicName} to track ownership, evidence, scoring, or remediation work for a control or policy program.`
      ],
      pitfalls: [
        `A common interview miss is explaining ${topicName} without tying it back to governance outcomes, evidence, or remediation accountability.`
      ]
    };
  }

  if (/security incident|vulnerability|threat/.test(name)) {
    return {
      keyComponents: [
        'Explain triage, enrichment, ownership, and remediation flow in addition to the record structure.',
        'Mention the external signals or intel sources that influence prioritization.'
      ],
      examples: [
        `A real implementation example is using ${topicName} to intake findings, enrich context, and coordinate response work across security and infrastructure teams.`
      ],
      pitfalls: [
        `A weak answer on ${topicName} usually ignores triage logic, enrichment, or the handoff between analysis and remediation teams.`
      ]
    };
  }

  if (/dashboard|report|indicator|breakdown|analytics/.test(name)) {
    return {
      keyComponents: [
        'Explain what metric is being measured, how it is segmented, and how leaders consume the output.',
        'Mention why data definitions matter more than just making the widget look good.'
      ],
      examples: [
        `A practical example is using ${topicName} to show trend movement by team, priority, or business unit so leaders can act on the data.`
      ],
      pitfalls: [
        `A common interview pitfall is focusing on visualization only and skipping data source quality, indicator definition, or breakdown design.`
      ]
    };
  }

  if (/update set|source control|upgrade|release|clone/.test(name)) {
    return {
      keyComponents: [
        'Explain how the topic supports safe delivery, promotion, and validation across environments.',
        'Mention governance steps such as regression review, collision handling, or skipped-change cleanup.'
      ],
      examples: [
        `A real delivery example is using ${topicName} to move changes safely while reducing deployment risk and post-release surprises.`
      ],
      pitfalls: [
        `A common miss is describing ${topicName} as a technical click path without covering release governance, testing, or rollback readiness.`
      ]
    };
  }

  return null;
}

function buildContext(topic, relatedItems, state) {
  const tables = unique(relatedItems.flatMap((item) => item.relatedTables || [])).slice(0, 6);
  const modules = unique(relatedItems.flatMap((item) => (item.moduleIds || []).map((id) => state.lookups.modulesById?.[id]?.name).filter(Boolean))).slice(0, 4);
  const roles = unique(relatedItems.flatMap((item) => (item.roleIds || []).map((id) => state.lookups.rolesById?.[id]?.name).filter(Boolean))).slice(0, 4);
  const counts = topicCounts(relatedItems);
  return {
    topic,
    relatedItems,
    tables,
    modules,
    roles,
    counts,
    category: topic.category || 'ServiceNow'
  };
}

function deriveKeyComponents(context) {
  const rule = keywordPack(context.topic.name);
  const items = [];

  if (rule?.keyComponents?.length) items.push(...rule.keyComponents);
  items.push(`Explain what ${context.topic.name} controls, when it applies, and where an administrator or developer usually configures or validates it.`);
  if (context.tables.length) {
    items.push(`Reference the underlying record impact for ${context.topic.name}, especially around ${context.tables.slice(0, 3).join(', ')}.`);
  }
  if (context.modules.length) {
    items.push(`Connect ${context.topic.name} back to ${context.modules.slice(0, 2).join(' and ')} so the answer sounds implementation-aware instead of isolated.`);
  }
  if (context.roles.length) {
    items.push(`Mention which teams care most about ${context.topic.name}, such as ${context.roles.slice(0, 2).join(' and ')}.`);
  }
  return unique(items).slice(0, 4);
}

function deriveExamples(context) {
  const rule = keywordPack(context.topic.name);
  const items = [];

  if (rule?.examples?.length) items.push(...rule.examples);
  if (context.modules.length && context.tables.length) {
    items.push(`A practical example is using ${context.topic.name} in ${context.modules[0]} to control how ${context.tables[0]} records are created, updated, validated, or routed.`);
  }
  items.push(`In a live ${context.category} implementation, teams use ${context.topic.name} to reduce manual work, make behavior consistent, and keep outcomes supportable.`);
  return unique(items).slice(0, 3);
}

function derivePitfalls(context) {
  const rule = keywordPack(context.topic.name);
  const items = [];

  if (rule?.pitfalls?.length) items.push(...rule.pitfalls);
  items.push(`Do not answer ${context.topic.name} only with a definition; explain trigger or scope, record impact, and business outcome.`);
  if (context.tables.length) {
    items.push(`Another common miss is skipping the underlying table or record behavior for ${context.topic.name}, especially around ${context.tables[0]}.`);
  }
  if (context.modules.length) {
    items.push(`Keep the answer tied to ${context.modules[0]} process flow; vague platform-only answers usually feel weak in interviews.`);
  }
  return unique(items).slice(0, 4);
}

function buildTopicOverview(topic, relatedItems = [], state) {
  const context = buildContext(topic, relatedItems, state);
  const conceptItems = relatedItems.filter((item) => !['coding', 'use-case'].includes(item.contentType) && !isTrickyStudyItem(item));
  const leadItem = conceptItems.find((item) => item.contentType === 'theory') || conceptItems[0] || relatedItems[0] || null;
  const relatedTables = context.tables;
  const keyPoints = unique([...(conceptItems.flatMap((item) => item.keyPoints || [])), ...deriveKeyComponents(context)]).slice(0, 4);
  const realTimeExamples = unique([...(conceptItems.flatMap((item) => item.examples || [])), ...deriveExamples(context)]).slice(0, 3);
  const pitfalls = unique([
    ...relatedItems.filter((item) => isTrickyStudyItem(item)).map((item) => item.question || item.title),
    ...derivePitfalls(context)
  ]).slice(0, 5);

  const definition = leadItem?.exactAnswer || leadItem?.summary || `${topic.name} is an interview topic under ${context.category}. A strong answer should explain what it is, where it fits, and why it matters in a real ServiceNow implementation.`;
  const whatItDoes = leadItem?.summary || `This topic currently maps to ${formatCount(relatedItems.length)} study item(s) across concept, coding, use-case, and tricky coverage in the hub.`;

  return `
    <section class="card topic-overview-card" id="topic-overview">
      <div class="topic-overview-header">
        <div>
          <p class="topic-overview-kicker">Topic explanation</p>
          <h2>${escapeHtml(topic.name)}</h2>
          <p class="topic-overview-subtitle">${escapeHtml(context.category)}</p>
        </div>
        <div class="topic-overview-metrics">
          <span class="metric-pill"><strong>${formatCount(context.counts.concepts)}</strong><span>Concepts</span></span>
          <span class="metric-pill"><strong>${formatCount(context.counts.coding)}</strong><span>Coding</span></span>
          <span class="metric-pill"><strong>${formatCount(context.counts.useCases)}</strong><span>Use cases</span></span>
          <span class="metric-pill green"><strong>${formatCount(context.counts.tricky)}</strong><span>Tricky</span></span>
        </div>
      </div>

      <div class="topic-overview-grid">
        <section class="topic-overview-block">
          <h3>Definition</h3>
          <p>${escapeHtml(definition)}</p>
        </section>

        <section class="topic-overview-block">
          <h3>What it does</h3>
          <p>${escapeHtml(whatItDoes)}</p>
        </section>

        <section class="topic-overview-block">
          <h3>Key components</h3>
          <ul>${keyPoints.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ul>
        </section>

        <section class="topic-overview-block">
          <h3>Tables involved</h3>
          ${relatedTables.length ? `<div class="topic-chip-list">${relatedTables.map((tableName) => `<span class="badge subtle">${escapeHtml(tableName)}</span>`).join('')}</div>` : `<p>${escapeHtml(`${topic.name} is often explained through process behavior and configuration scope even when a single table is not the main focus.`)}</p>`}
        </section>

        <section class="topic-overview-block">
          <h3>Real-time example</h3>
          <ul>${realTimeExamples.map((example) => `<li>${escapeHtml(example)}</li>`).join('')}</ul>
        </section>

        <section class="topic-overview-block">
          <h3>Interview pitfalls</h3>
          <ul>${pitfalls.map((pitfall) => `<li>${escapeHtml(pitfall)}</li>`).join('')}</ul>
        </section>
      </div>

      <div class="topic-overview-footer">
        ${context.roles.length ? `<div><span class="small">Roles</span><div class="topic-chip-list">${context.roles.map((name) => `<span class="badge subtle">${escapeHtml(name)}</span>`).join('')}</div></div>` : ''}
        ${context.modules.length ? `<div><span class="small">Modules</span><div class="topic-chip-list">${context.modules.map((name) => `<span class="badge subtle">${escapeHtml(name)}</span>`).join('')}</div></div>` : ''}
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

export function renderBetterTrickyPage(state, items, filters = {}) {
  return `
    <section class="card clean-banner tricky-page-banner">
      <div class="clean-banner-head">
        <div class="clean-banner-icon">?</div>
        <div>
          <h2>Tricky Questions</h2>
          <p>Review tricky, comparison, and troubleshooting-style interview content across roles, modules, and topics from one page.</p>
        </div>
      </div>
    </section>

    <form class="filters card" data-filter-form="/tricky">
      <label>
        Role
        <select name="role" data-filter-control>
          <option value="">All roles</option>
          ${optionRows(state.data.roles, filters.role || '')}
        </select>
      </label>
      <label>
        Module
        <select name="module" data-filter-control>
          <option value="">All modules</option>
          ${optionRows(state.data.modules, filters.module || '')}
        </select>
      </label>
      <label>
        Topic
        <select name="topic" data-filter-control>
          <option value="">All topics</option>
          ${optionRows(state.data.topics, filters.topic || '')}
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

    <section class="grid cards-2">
      ${items.length
        ? items.map((item) => renderTrickyCard(item, state.lookups)).join('')
        : `<section class="card empty-state"><h2>No tricky questions match this filter.</h2><p>Try removing one or more filters. This page now includes tricky, comparison, and troubleshooting-style interview content.</p></section>`
      }
    </section>
  `;
}

export function enhanceTopicDetailHotfix(state, topic, relatedItems = []) {
  const accordionStack = document.querySelector('.accordion-stack');
  if (!accordionStack) return;

  const sourceSection = accordionStack.closest('section');
  if (!sourceSection) return;

  const accordionDetails = [...accordionStack.querySelectorAll('.study-accordion')];
  if (!accordionDetails.length) return;

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
  if (sections.tricky.length) visibleSections.push({ id: 'topic-tricky', label: 'Tricky Questions' });

  const replacementHtml = [
    buildTopicOverview(topic, relatedItems, state),
    renderSectionNav(visibleSections),
    sectionWrapper('topic-concepts', 'Concepts & explanations', 'Read the mapped concepts first, then move into practice questions.', sections.concepts.join('')),
    sectionWrapper('topic-coding', 'Coding questions', 'Exact scripting drills mapped to this topic.', sections.coding.join('')),
    sectionWrapper('topic-use-cases', 'Use case scenarios', 'Implementation-style interview scenarios connected to this topic.', sections.useCases.join('')),
    sectionWrapper('topic-tricky', 'Tricky questions', 'Edge cases, comparisons, troubleshooting traps, and tricky distinctions for this topic.', sections.tricky.join(''))
  ].join('');

  sourceSection.outerHTML = replacementHtml;

  const firstConceptAccordion = document.querySelector('#topic-concepts .study-accordion');
  if (firstConceptAccordion) {
    firstConceptAccordion.setAttribute('open', '');
  }
}
