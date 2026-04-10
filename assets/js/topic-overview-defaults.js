const EXACT_DEFAULTS = {
  'app-engine-studio': {
    definition: 'App Engine Studio is a guided low-code design environment for building custom applications, data, experiences, and automation on the Now Platform.',
    whatItDoes: 'It helps teams assemble custom app artifacts in a more guided way while still relying on underlying platform objects such as tables, pages, and automations.',
    tablesInvolved: ['sys_app', 'sys_db_object', 'sys_ux_page_registry', 'sys_hub_flow']
  },
  'application-menu-modules': {
    definition: 'Application Menus and Modules define how applications and navigation entries appear in the navigator for users and administrators.',
    whatItDoes: 'They organize platform navigation so users can find the right records, lists, and entry points for an application.',
    tablesInvolved: ['sys_app_application', 'sys_app_module']
  },
  'atf-tests': {
    definition: 'ATF Tests are Automated Test Framework definitions used to validate platform behavior through repeatable test execution.',
    whatItDoes: 'They help teams automate regression coverage for forms, records, and application behavior before release.',
    tablesInvolved: ['sys_atf_test', 'sys_atf_step']
  },
  'background-scripts': {
    definition: 'Background Scripts are server-side scripts run on demand for troubleshooting, data fixes, and administrative tasks.',
    whatItDoes: 'They let administrators and developers execute server-side logic directly against the instance outside normal business transactions.',
    tablesInvolved: ['Target business table', 'sys_script_fix']
  },
  'catalog-variables': {
    definition: 'Catalog Variables are the user-input fields used on catalog items, record producers, and order guides.',
    whatItDoes: 'They capture request data and make those values available to fulfillment logic, approvals, and downstream processing.',
    tablesInvolved: ['item_option_new', 'sc_item_option', 'sc_item_option_mtom']
  },
  'choice-lists': {
    definition: 'Choice Lists are dictionary-driven lists of allowed values stored for choice fields.',
    whatItDoes: 'They standardize selectable values on forms and lists so users choose from governed options instead of entering free text.',
    tablesInvolved: ['sys_choice']
  },
  'credentials': {
    definition: 'Credentials in Discovery define the authentication material used to connect to target infrastructure during discovery and related operations.',
    whatItDoes: 'They allow Discovery and MID Server-driven processes to authenticate safely to hosts, devices, and services.',
    tablesInvolved: ['sa_credential', 'discovery_credentials']
  },
  'dashboards': {
    definition: 'Dashboards are collections of visual widgets used to present operational metrics, trends, and workload views to stakeholders.',
    whatItDoes: 'They assemble charts, reports, and indicator widgets into role-specific views for decision making.',
    tablesInvolved: ['pa_dashboards', 'sys_report']
  },
  'decision-tables': {
    definition: 'Decision Tables are low-code decision assets that evaluate input conditions and return configured outcomes.',
    whatItDoes: 'They move branching logic out of scattered scripts so automation can use governed decision rules.',
    tablesInvolved: ['sys_decision', 'sys_decision_question', 'sys_decision_answer']
  },
  'dictionary-overrides': {
    definition: 'Dictionary Overrides let extended tables change selected dictionary behavior inherited from a parent table.',
    whatItDoes: 'They let child tables adjust properties such as choice behavior or attributes without redefining the entire field model.',
    tablesInvolved: ['sys_dictionary', 'sys_dictionary_override']
  },
  'display-values': {
    definition: 'Display Values are the user-friendly values ServiceNow shows for certain fields, especially reference and choice fields.',
    whatItDoes: 'They separate what users see from what is stored internally so records remain relational and normalized.',
    tablesInvolved: ['sys_dictionary']
  },
  'fix-scripts': {
    definition: 'Fix Scripts are deployment-time scripts used to repair or adjust data and configuration as part of application delivery.',
    whatItDoes: 'They let teams execute controlled one-time or targeted remediation logic during installs or upgrades.',
    tablesInvolved: ['sys_script_fix']
  },
  'gform': {
    definition: 'g_form is the client-side API used by client scripts to interact with form fields and form-level behavior in the browser.',
    whatItDoes: 'It lets client logic read or set values, control field state, and show messages during user interaction.',
    tablesInvolved: ['No single table — client-side API']
  },
  'graphql-or-rest': {
    definition: 'GraphQL vs REST Discussion is an integration design topic comparing resource-oriented REST patterns with query-oriented GraphQL patterns.',
    whatItDoes: 'It helps teams choose the right integration style based on payload shape, client flexibility, governance, and platform fit.',
    tablesInvolved: ['No single table — integration design topic']
  },
  jelly: {
    definition: 'Jelly is a legacy XML-based templating technology used in older ServiceNow UI constructs such as some UI Pages and macros.',
    whatItDoes: 'It renders server-side UI markup in legacy experiences that predate modern workspace and portal patterns.',
    tablesInvolved: ['sys_ui_page', 'sys_ui_macro']
  },
  'mobile-actions': {
    definition: 'Mobile Actions are task-oriented actions exposed in ServiceNow mobile experiences for end users and agents.',
    whatItDoes: 'They let users complete common work quickly from a mobile context rather than navigating a full desktop workflow.',
    tablesInvolved: ['sys_sg_action_assignment', 'sys_ux_screen']
  },
  'mobile-experiences': {
    definition: 'Mobile Experiences are configured mobile app experiences built for role-based work on phones and tablets.',
    whatItDoes: 'They package screens, navigation, and actions for specific mobile journeys on the Now Platform.',
    tablesInvolved: ['sys_sg_app', 'sys_ux_screen']
  },
  'notifications-email': {
    definition: 'Notifications & Email is the platform communication topic covering email notifications, templates, and outbound email behavior.',
    whatItDoes: 'It helps teams automate communications from record changes and events while controlling recipients and message content.',
    tablesInvolved: ['sysevent_email_action', 'sys_email', 'sys_email_template']
  },
  'pa-breakdowns': {
    definition: 'PA Breakdowns are Performance Analytics dimensions used to segment indicator scores by categories such as assignment group, priority, or service.',
    whatItDoes: 'They let teams analyze trends by meaningful slices instead of only overall totals.',
    tablesInvolved: ['pa_breakdowns', 'pa_scores']
  },
  'pa-indicators': {
    definition: 'PA Indicators are Performance Analytics metric definitions used to collect and trend operational data over time.',
    whatItDoes: 'They define what is measured, how often it is collected, and how performance is trended historically.',
    tablesInvolved: ['pa_indicators', 'pa_scores']
  },
  'pattern-designer': {
    definition: 'Pattern Designer is the design environment used to create and maintain pattern-based discovery logic.',
    whatItDoes: 'It lets teams define pattern steps and data extraction logic used by Discovery.',
    tablesInvolved: ['sa_pattern', 'sa_pattern_step']
  },
  patterns: {
    definition: 'Patterns are pattern-based discovery definitions used to identify devices and populate CI attributes without legacy probes-and-sensors logic alone.',
    whatItDoes: 'They define structured discovery steps for collecting and transforming target data into CMDB records.',
    tablesInvolved: ['sa_pattern', 'sa_pattern_step']
  },
  'portal-client-controller': {
    definition: 'A Portal Client Controller is the client-side controller logic used within a Service Portal widget.',
    whatItDoes: 'It manages browser-side widget interaction, data binding, and user events in the Service Portal runtime.',
    tablesInvolved: ['sp_widget', 'sp_instance']
  },
  'portal-server-script': {
    definition: 'A Portal Server Script is the server-side script portion of a Service Portal widget.',
    whatItDoes: 'It prepares data for the widget and handles server-side processing before that data reaches the client controller.',
    tablesInvolved: ['sp_widget', 'sp_instance']
  },
  'portal-widgets': {
    definition: 'Service Portal Widgets are reusable components that combine markup, client logic, server logic, and options for portal pages.',
    whatItDoes: 'They power portal experiences by packaging display and interaction behavior into reusable units.',
    tablesInvolved: ['sp_widget', 'sp_page', 'sp_instance']
  },
  reports: {
    definition: 'Reports are configurable visualizations built from platform data sources for lists, charts, and operational views.',
    whatItDoes: 'They present record data in filtered, aggregated, or charted form for stakeholders and operational teams.',
    tablesInvolved: ['sys_report']
  },
  'reports-dashboards': {
    definition: 'Reports & Dashboards is the reporting topic that combines report design with dashboard presentation patterns.',
    whatItDoes: 'It helps teams surface operational information through governed visuals and shared reporting views.',
    tablesInvolved: ['sys_report', 'pa_dashboards']
  },
  'rest-api-authentication': {
    definition: 'REST API Authentication covers the authentication patterns used to secure inbound and outbound REST integrations.',
    whatItDoes: 'It ensures API traffic is authenticated appropriately through supported profiles, tokens, certificates, or other controls.',
    tablesInvolved: ['sys_auth_profile', 'sys_certificate']
  },
  'service-operations-workspace-topic': {
    definition: 'Service Operations Workspace is a modern workspace experience for analysts handling operational work such as incidents, alerts, and service health.',
    whatItDoes: 'It brings together record views, context, and productivity tools in a focused analyst workspace.',
    tablesInvolved: ['sys_ux_page_registry', 'sys_ux_macroponent']
  },
  'source-control': {
    definition: 'Source Control is the application-development integration used to connect scoped applications to external source repositories.',
    whatItDoes: 'It lets teams version application artifacts in a repository and coordinate collaborative development outside update sets alone.',
    tablesInvolved: ['sys_repo_config', 'sys_update_set']
  },
  'system-definition': {
    definition: 'System Definition is the platform metadata area that contains tables, dictionary records, choices, and related schema configuration.',
    whatItDoes: 'It governs how data structures and foundational metadata are defined across applications.',
    tablesInvolved: ['sys_db_object', 'sys_dictionary', 'sys_choice']
  },
  'system-properties': {
    definition: 'System Properties are instance-level configuration values used to influence platform behavior at runtime.',
    whatItDoes: 'They centralize configurable settings so behavior can be changed without rewriting code in many scenarios.',
    tablesInvolved: ['sys_properties']
  },
  'tables-dictionary': {
    definition: 'Tables and Dictionary is the data-model topic covering table definitions, fields, and metadata in the Now Platform.',
    whatItDoes: 'It explains how application data structures are defined, extended, and interpreted by forms, lists, and scripts.',
    tablesInvolved: ['sys_db_object', 'sys_dictionary']
  },
  'update-sets': {
    definition: 'Update Sets are transport packages used to move many configuration changes between ServiceNow instances.',
    whatItDoes: 'They let teams capture and promote supported configuration changes through development and test environments.',
    tablesInvolved: ['sys_update_set', 'sys_update_xml']
  },
  'ui-builder-components': {
    definition: 'UI Builder Components are reusable visual and functional blocks used in modern Next Experience pages.',
    whatItDoes: 'They let builders assemble workspace and experience pages from configurable components rather than legacy page constructs.',
    tablesInvolved: ['sys_ux_macroponent', 'sys_ux_screen_type']
  },
  'virtual-agent-topics': {
    definition: 'Virtual Agent Topics are guided conversation definitions used to drive chatbot-style support or service interactions.',
    whatItDoes: 'They structure conversational flows, collect inputs, and trigger downstream actions or handoffs.',
    tablesInvolved: ['sys_cs_topic', 'sys_cs_intent']
  },
  'workspace-record-pages': {
    definition: 'Workspace Record Pages are modern record experiences designed for workspace users in Next Experience.',
    whatItDoes: 'They define how records are presented, contextualized, and acted on in workspaces.',
    tablesInvolved: ['sys_ux_page_registry', 'sys_ux_macroponent']
  }
};

const CATEGORY_DEFAULTS = {
  Security: {
    tables: ['sys_user_role', 'sys_security_acl', 'sys_user_group'],
    definition: (name) => `${name} is a security and access topic on the Now Platform that controls or explains how users, permissions, and data boundaries are managed.`,
    whatItDoes: () => 'It helps administrators and developers control who can access records, which actions are allowed, and how security behavior is enforced consistently.',
    keyComponents: (name) => [
      `Understand the primary security object or rule set used for ${name}.`,
      'Know which user, role, group, or domain context is evaluated at runtime.',
      'Validate both allowed and denied access paths in realistic test scenarios.',
      'Watch for performance and maintainability when security logic uses scripts.'
    ],
    realTimeExamples: (name) => [
      `Apply ${name} so only the right support population can view or change sensitive records.`,
      `Use ${name} to troubleshoot why one user can access a record while another user cannot.`
    ],
    interviewPitfalls: (name) => [
      `Explaining ${name} only at a definition level without describing runtime evaluation.`,
      'Testing only with admin and missing the behavior seen by real end users.',
      'Overlooking the interaction between roles, conditions, and scripted checks.'
    ]
  },
  CMDB: {
    tables: ['cmdb_ci', 'cmdb_rel_ci', 'sys_object_source'],
    definition: (name) => `${name} is a CMDB topic used to model, identify, reconcile, govern, or troubleshoot configuration item data.`,
    whatItDoes: () => 'It supports accurate CI records, trusted relationships, and reliable operational data for impact analysis and service awareness.',
    keyComponents: (name) => [
      `Understand how ${name} affects CI quality, identification, reconciliation, or topology.`,
      'Know the class, relationship, or source-authority behavior involved.',
      'Validate the impact on duplicate prevention, attribute trust, and downstream consumers.',
      'Use CMDB health and troubleshooting evidence instead of assuming the data is correct.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to improve CI accuracy after Discovery and integrations populate the same classes.`,
      `Review ${name} when a CI is duplicated, stale, or updated by the wrong source.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} as a one-time configuration instead of an ongoing data-quality control.`,
      'Ignoring source authority, class design, or relationship meaning when troubleshooting.',
      'Writing directly to CMDB tables when governed entry patterns should be used.'
    ]
  },
  Discovery: {
    tables: ['discovery_schedule', 'ecc_queue', 'ecc_agent'],
    definition: (name) => `${name} is a Discovery topic used to identify infrastructure, connect through MID Servers, or populate CIs from discovered data.`,
    whatItDoes: () => 'It helps ServiceNow discover infrastructure accurately, connect securely to targets, and troubleshoot how discovery data becomes CMDB records.',
    keyComponents: () => [
      'Understand whether the topic concerns connectivity, credentials, scheduling, execution, or pattern logic.',
      'Know how MID Server processing and ECC activity relate to the topic.',
      'Validate the quality of discovered data as well as the execution status.',
      'Troubleshoot using status records, queue activity, and target reachability instead of assumptions.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} while configuring or troubleshooting discovery against servers, devices, or cloud targets.`,
      `Review ${name} when Discovery appears to run but the expected CI data is missing or wrong.`
    ],
    interviewPitfalls: (name) => [
      `Explaining ${name} only from the UI and ignoring MID Server or ECC execution behavior.`,
      'Blaming scheduling when connectivity, credentials, or pattern logic are the real problem.',
      'Accepting a nominal success state without validating the resulting CI data.'
    ]
  },
  'Event Management': {
    tables: ['em_alert', 'evt_mgmt_alert_group', 'em_event_rule'],
    definition: (name) => `${name} is an Event Management topic focused on how events and alerts are ingested, grouped, correlated, or turned into operational work.`,
    whatItDoes: () => 'It helps operations teams reduce noise, relate alerts correctly, and drive actionable outcomes such as incidents or service impact.',
    keyComponents: () => [
      'Understand how raw events become alerts and how rules are applied.',
      'Know where the topic influences grouping, correlation, or downstream ticketing.',
      'Validate severity, deduplication, and service context before enabling automation.',
      'Review operational outcomes, not just rule matches, after configuration.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} so duplicate infrastructure signals are grouped before analysts are notified.`,
      `Configure ${name} to generate or enrich incidents only when the alert conditions truly warrant it.`
    ],
    interviewPitfalls: (name) => [
      `Implementing ${name} without checking for alert storms or duplicate downstream work.`,
      'Focusing only on rule syntax instead of end-to-end operational noise reduction.',
      'Skipping validation of severity, timing, and service context.'
    ]
  },
  'App Engine': {
    tables: ['sys_app', 'sys_db_object', 'sys_ux_page_registry'],
    definition: (name) => `${name} is an App Engine topic for building, managing, or extending custom business applications on the Now Platform.`,
    whatItDoes: () => 'It helps teams deliver data models, experiences, and automation for custom applications with low-code or pro-code patterns.',
    keyComponents: () => [
      'Understand whether the topic is about application structure, tables, or the build experience.',
      'Know how data model, forms, automation, and user experience fit together.',
      'Keep scoped design and application ownership in mind.',
      'Validate how the design will be promoted, tested, and maintained after go-live.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} while building a custom internal workflow app with its own tables and experiences.`,
      `Apply ${name} to speed up custom app delivery without losing governance or maintainability.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} as only a UI feature instead of part of a full application design.`,
      'Skipping scoped design and cross-application dependency planning.',
      'Ignoring how custom data model choices affect reporting and automation later.'
    ]
  },
  Development: {
    tables: ['sys_app_application', 'sys_scope', 'sys_app_module'],
    definition: (name) => `${name} is a development topic that shapes how applications are structured, scoped, or surfaced in the platform.`,
    whatItDoes: () => 'It helps developers organize application objects clearly and keep development work maintainable and governable.',
    keyComponents: () => [
      'Understand scope, packaging, and where the object appears in the developer experience.',
      'Know how navigation, access, or application ownership is configured.',
      'Use consistent naming and application structure.',
      'Plan for migration, reuse, and long-term maintenance.'
    ],
    realTimeExamples: (name) => [
      `Configure ${name} while setting up a new custom app for a business process.`,
      `Review ${name} when users cannot find the right navigation or app assets.`
    ],
    interviewPitfalls: (name) => [
      `Focusing on ${name} only cosmetically and missing scope or lifecycle implications.`,
      'Creating inconsistent naming or module organization that confuses users.',
      'Ignoring deployment and reuse implications.'
    ]
  },
  Platform: {
    tables: ['sysapproval_approver', 'sysrule_assignment', 'sys_ui_action'],
    definition: (name) => `${name} is a platform capability used broadly across applications rather than only in one module.`,
    whatItDoes: () => 'It provides reusable platform behavior that supports routing, actions, approvals, or data behavior across multiple processes.',
    keyComponents: () => [
      'Understand the runtime trigger and evaluation logic.',
      'Know which record types or transactions are affected.',
      'Validate downstream side effects before enabling it broadly.',
      'Prefer maintainable configuration over fragmented custom logic.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to standardize behavior across incident, request, and custom applications.`,
      `Review ${name} when cross-module behavior seems inconsistent.`
    ],
    interviewPitfalls: (name) => [
      `Configuring ${name} for one use case without testing cross-platform impact.`,
      'Duplicating logic in multiple places instead of using the platform feature correctly.',
      'Ignoring sequence and interaction with other platform controls.'
    ]
  },
  HAM: {
    tables: ['alm_asset', 'alm_hardware', 'alm_stockroom'],
    definition: (name) => `${name} is a Hardware Asset Management topic that governs physical asset records, lifecycle state, model data, or movement.`,
    whatItDoes: () => 'It helps organizations track owned hardware accurately from receipt through use, transfer, and retirement.',
    keyComponents: () => [
      'Understand whether the topic is about asset master data, movement, lifecycle, or alignment to CIs.',
      'Know the relationship between assets, models, users, locations, and stockrooms.',
      'Validate state changes and inventory accuracy end to end.',
      'Keep reconciliation with CMDB and operational processes in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} when receiving, moving, or retiring laptops and other tracked hardware.`,
      `Review ${name} when asset records and CI records drift out of alignment.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} as inventory only and ignoring lifecycle control or CMDB alignment.`,
      'Missing the operational effect of transfers, disposals, or state changes.',
      'Allowing model or location data quality to degrade.'
    ]
  },
  Quality: {
    tables: ['sys_atf_test', 'sys_atf_step'],
    definition: (name) => `${name} is a testing topic used to validate platform behavior in a repeatable way.`,
    whatItDoes: () => 'It helps teams automate or structure regression coverage so changes can be promoted with more confidence.',
    keyComponents: () => [
      'Know what the test object validates and where it executes.',
      'Design tests to be stable, readable, and reusable.',
      'Validate expected outcomes rather than only navigation success.',
      'Keep test data management and environment readiness in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to validate a form, flow, or catalog change before release.`,
      `Review ${name} after a regression failure to understand which platform behavior changed.`
    ],
    interviewPitfalls: (name) => [
      `Building ${name} too tightly around fragile data or environment assumptions.`,
      'Confusing smoke checks with real business validation.',
      'Ignoring maintenance of automated tests after configuration changes.'
    ]
  },
  GRC: {
    tables: ['sn_compliance_policy', 'sn_compliance_control', 'sn_grc_issue'],
    definition: (name) => `${name} is a GRC topic related to policy, compliance, risk, audit, control, or issue governance.`,
    whatItDoes: () => 'It helps organizations document obligations, evaluate control effectiveness, and track remediation or risk decisions.',
    keyComponents: () => [
      'Understand the governing object, lifecycle, and record relationships involved.',
      'Know how attestations, issues, controls, policies, or risks connect.',
      'Validate ownership, evidence, and remediation tracking.',
      'Align the process with governance outcomes rather than only record creation.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to formalize governance work and track exceptions or remediation.`,
      `Review ${name} when audit, compliance, or risk stakeholders need traceable decisions.`
    ],
    interviewPitfalls: (name) => [
      `Explaining ${name} only as a record type instead of as part of a governance lifecycle.`,
      'Ignoring evidence, ownership, or downstream remediation behavior.',
      'Treating governance content as static instead of operational.'
    ]
  },
  Administration: {
    tables: ['sys_properties', 'sys_db_object', 'sys_script_fix'],
    definition: (name) => `${name} is an administration topic used to manage platform behavior, metadata, or operational utility functions.`,
    whatItDoes: () => 'It helps administrators inspect, change, or repair platform behavior safely across instances.',
    keyComponents: () => [
      'Understand the administrative object and when it should be used.',
      'Know whether it changes metadata, runtime behavior, or data directly.',
      'Use guardrails for production safety and change control.',
      'Document and validate admin-only actions carefully.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to inspect or repair platform behavior during support or release work.`,
      `Review ${name} when a configuration issue must be diagnosed quickly and safely.`
    ],
    interviewPitfalls: (name) => [
      `Using ${name} directly in production without a rollback or validation plan.`,
      'Confusing administrative utilities with normal application design patterns.',
      'Skipping change control because the action seems small.'
    ]
  },
  ITSM: {
    tables: ['incident', 'problem', 'change_request', 'task_sla'],
    definition: (name) => `${name} is an ITSM topic that shapes lifecycle, routing, approvals, or service restoration behavior in operational processes.`,
    whatItDoes: () => 'It helps support teams manage incidents, problems, changes, requests, or SLAs consistently and with the right governance.',
    keyComponents: () => [
      'Understand the process stage or ITSM object the topic belongs to.',
      'Know which state model, approval path, or operational rule is affected.',
      'Validate both analyst workflow and downstream reporting impact.',
      'Keep service restoration, customer communication, and governance in balance.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to improve how tickets move, escalate, or close in daily support operations.`,
      `Review ${name} when analysts follow the process but the operational outcome is still weak.`
    ],
    interviewPitfalls: (name) => [
      `Describing ${name} only as a form field or table without the actual process behavior.`,
      'Ignoring analyst usability and reporting implications.',
      'Forgetting state, SLA, approval, or communication side effects.'
    ]
  },
  Catalog: {
    tables: ['sc_cat_item', 'sc_request', 'sc_req_item', 'item_option_new'],
    definition: (name) => `${name} is a Service Catalog topic used to define orderable experiences, user inputs, or backend request fulfillment behavior.`,
    whatItDoes: () => 'It helps organizations collect request data cleanly and turn orders into approvals, requested items, and fulfillment work.',
    keyComponents: () => [
      'Understand whether the topic concerns the user experience, variables, or backend request model.',
      'Know how request, requested item, task, and approval records are affected.',
      'Validate the requester experience as well as fulfillment behavior.',
      'Keep maintainability and reuse in mind when designing catalog content.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} while designing a catalog experience for hardware, software, or access requests.`,
      `Review ${name} when a request looks correct to the user but fails during fulfillment.`
    ],
    interviewPitfalls: (name) => [
      `Explaining ${name} without referencing the underlying request data model.`,
      'Focusing only on the request form and not on downstream fulfillment behavior.',
      'Duplicating variable or logic patterns that should be reused.'
    ]
  },
  'Data Model': {
    tables: ['sys_db_object', 'sys_dictionary', 'sys_choice'],
    definition: (name) => `${name} is a data-model topic that explains how records, fields, hierarchy, references, or metadata are represented in the platform.`,
    whatItDoes: () => 'It helps developers understand how data is stored, extended, referenced, and displayed across applications.',
    keyComponents: () => [
      'Know the base table or metadata table involved.',
      'Understand how hierarchy, references, choices, or display behavior work at runtime.',
      'Validate impact on scripting, forms, reporting, and integrations.',
      'Prefer stable schema decisions over one-off shortcuts.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} while extending a table or troubleshooting how fields behave on forms and lists.`,
      `Review ${name} when data appears correct in one context but not in another.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} as only a UI concern instead of a platform data concern.`,
      'Ignoring inheritance, reference behavior, or dictionary effects.',
      'Making schema decisions without considering downstream impact.'
    ]
  },
  'Client/Server': {
    tables: ['sys_script_include', 'sys_user'],
    definition: (name) => `${name} is a client-to-server interaction topic used when client logic needs controlled server-side execution or data.`,
    whatItDoes: () => 'It helps forms and experiences retrieve or validate server data without submitting full records unnecessarily.',
    keyComponents: () => [
      'Understand what runs on the client and what runs on the server.',
      'Keep the server method narrow and intentionally exposed.',
      'Validate data returned to the client and response parsing behavior.',
      'Design with performance and security in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} when a form needs server-side data after a field changes.`,
      `Review ${name} when client behavior depends on data the browser should not compute itself.`
    ],
    interviewPitfalls: (name) => [
      `Mixing client and server responsibilities when discussing ${name}.`,
      'Returning too much data or exposing logic too broadly.',
      'Ignoring asynchronous behavior and form timing.'
    ]
  },
  Operations: {
    tables: ['syslog', 'syslog_transaction', 'sys_upgrade_history_log'],
    definition: (name) => `${name} is an operational platform topic used to keep instances healthy, diagnosable, and ready for change.`,
    whatItDoes: () => 'It helps administrators manage performance, logs, upgrades, cloning, and operational risk in the platform lifecycle.',
    keyComponents: () => [
      'Understand what signal, utility, or operational control is being reviewed.',
      'Know how the topic affects instance health or supportability.',
      'Use evidence from logs, transaction records, or upgrade history when troubleshooting.',
      'Balance fast diagnosis with safe change management.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to diagnose instance health or release problems before users are impacted.`,
      `Review ${name} during environment readiness or post-release support.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} as a one-time admin task instead of an operational discipline.`,
      'Making production changes without validating evidence first.',
      'Ignoring how environment differences affect conclusions.'
    ]
  },
  CSM: {
    tables: ['sn_customerservice_case'],
    definition: (name) => `${name} is a Customer Service Management topic focused on customer-facing case processes and supporting data.`,
    whatItDoes: () => 'It helps service teams manage external customer issues with the right case lifecycle, ownership, and visibility.',
    keyComponents: () => [
      'Understand the customer case record and related entitlements or accounts.',
      'Know how assignment, status, and communication behavior work.',
      'Validate agent workflow and customer experience together.',
      'Keep case security and service commitments in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to standardize external case handling and escalation.`,
      `Review ${name} when customer-facing service processes are inconsistent.`
    ],
    interviewPitfalls: (name) => [
      `Describing ${name} like internal ITSM without accounting for customer context.`,
      'Ignoring entitlements, communication, or account relationships.',
      'Focusing on records instead of service experience.'
    ]
  },
  Analytics: {
    tables: ['sys_report', 'pa_indicators', 'pa_dashboards'],
    definition: (name) => `${name} is an analytics topic used to define visualizations, indicators, or breakdowns for performance measurement.`,
    whatItDoes: () => 'It helps stakeholders turn platform data into reports, dashboards, and trend views that support decisions.',
    keyComponents: () => [
      'Understand the reporting or PA object and its data source.',
      'Know the difference between visualization and indicator collection logic.',
      'Validate data freshness, filters, and stakeholder meaning.',
      'Avoid building charts without agreeing on the metric definition first.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to show trend, workload, or service performance over time.`,
      `Review ${name} when a dashboard looks correct visually but tells the wrong business story.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} as only a visual exercise rather than a metric-definition exercise.`,
      'Ignoring source filters, time series behavior, or breakdown logic.',
      'Confusing a one-time report with a governed KPI.'
    ]
  },
  'Flow Designer': {
    tables: ['sys_hub_flow', 'sys_hub_trigger', 'sys_hub_action_type_definition'],
    definition: (name) => `${name} is a Flow Designer topic used to define reusable automation logic, execution inputs, and no-code orchestration behavior.`,
    whatItDoes: () => 'It helps teams automate processes through flows, triggers, subflows, actions, and data passed between steps.',
    keyComponents: () => [
      'Understand whether the topic is about starting automation, reusing logic, or passing data.',
      'Know how inputs, outputs, and data pills are exposed to the designer.',
      'Validate runtime behavior and flow execution results, not just design-time configuration.',
      'Keep reusability and maintainability in mind when packaging logic.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to build reusable automation for catalog, case, or task processes.`,
      `Review ${name} when a flow is published but the runtime output is not what the process expects.`
    ],
    interviewPitfalls: (name) => [
      `Confusing trigger logic, reusable logic, and output data when discussing ${name}.`,
      'Designing automation that works only for one narrow scenario.',
      'Ignoring execution logs and runtime data when troubleshooting.'
    ]
  },
  'Import and Transform': {
    tables: ['sys_data_source', 'sys_import_set', 'sys_transform_map'],
    definition: (name) => `${name} is an import topic used to stage, transform, or monitor incoming data before it lands in target tables.`,
    whatItDoes: () => 'It helps teams bring external data into the platform in a controlled way with staging, mapping, and transformation logic.',
    keyComponents: () => [
      'Understand source configuration, staging, and target transformation separately.',
      'Know which object controls load behavior versus transform behavior.',
      'Validate row results, error handling, and update-versus-insert behavior.',
      'Keep data quality and repeatability in mind, not just initial import success.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} while bringing users, assets, or CI data into the platform from an external feed.`,
      `Review ${name} when imports succeed technically but create duplicate or incomplete target records.`
    ],
    interviewPitfalls: (name) => [
      `Confusing the staging step with the transformation step for ${name}.`,
      'Ignoring row history and error outputs after a nominal success.',
      'Using unstable matching logic that creates duplicates or wrong updates.'
    ]
  },
  IntegrationHub: {
    tables: ['sys_hub_action_type_definition', 'sys_hub_step_instance'],
    definition: (name) => `${name} is an IntegrationHub topic used to package external-system logic as reusable actions, spokes, or data-stream processing.`,
    whatItDoes: () => 'It helps flows connect to external systems with reusable integration logic rather than one-off scripting everywhere.',
    keyComponents: () => [
      'Understand whether the topic packages actions, connector logic, or streamed response parsing.',
      'Know how inputs, outputs, and authentication are handled.',
      'Validate reuse and runtime behavior in flows.',
      'Keep connector governance and maintainability in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to expose external-system logic cleanly to Flow Designer users.`,
      `Review ${name} when a reusable integration step works in one flow but not another.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} as only a UI object and not as packaged integration logic.`,
      'Ignoring outputs and runtime parsing details.',
      'Hard-coding system-specific logic where reusable action design is expected.'
    ]
  },
  DevOps: {
    tables: ['sn_devops_pipeline_run', 'change_request'],
    definition: (name) => `${name} is a DevOps topic connecting delivery pipelines and change-governance outcomes.`,
    whatItDoes: () => 'It helps teams make release activity visible and governable without losing delivery speed.',
    keyComponents: () => [
      'Understand how pipeline or deployment activity is represented.',
      'Know which change or governance signals are linked to the activity.',
      'Validate automation and auditability together.',
      'Keep end-to-end release flow in mind rather than isolated steps.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to align change visibility with deployment execution.`,
      `Review ${name} when release automation is fast but governance reporting is weak.`
    ],
    interviewPitfalls: (name) => [
      `Explaining ${name} as pipeline data only without the governance outcome.`,
      'Ignoring traceability between delivery events and changes.',
      'Optimizing speed while losing auditability.'
    ]
  },
  Mobile: {
    tables: ['sys_sg_app', 'sys_sg_action_assignment', 'sys_ux_screen'],
    definition: (name) => `${name} is a mobile topic for designing actions or experiences in ServiceNow mobile clients.`,
    whatItDoes: () => 'It helps teams tailor mobile interactions so users can complete focused work on phones and tablets.',
    keyComponents: () => [
      'Understand whether the topic concerns app experience, screen behavior, or actionable tasks.',
      'Know the user role and mobile journey being supported.',
      'Validate quick task completion and device context.',
      'Keep parity and differences with desktop experiences in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to let field or support users complete common tasks from a mobile device.`,
      `Review ${name} when a desktop process does not translate cleanly into a mobile interaction.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} as a smaller desktop page instead of a mobile-first experience.`,
      'Ignoring action context and device limitations.',
      'Trying to expose too much complexity in one mobile interaction.'
    ]
  },
  SAM: {
    tables: ['alm_entitlement', 'cmdb_sam_sw_install', 'sam_sw_compliance'],
    definition: (name) => `${name} is a Software Asset Management topic used to govern software entitlement, normalization, compliance, or reclamation.`,
    whatItDoes: () => 'It helps organizations understand what software is installed, what is licensed, and where optimization or remediation is needed.',
    keyComponents: () => [
      'Understand whether the topic is about entitlement, installs, normalization, or optimization.',
      'Know how discovered installs, models, and license rights connect.',
      'Validate compliance outcomes, not just raw inventory.',
      'Keep publisher-specific rules and metric logic in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to improve license visibility and reduce unnecessary spend.`,
      `Review ${name} when software inventory exists but compliance status is still unclear.`
    ],
    interviewPitfalls: (name) => [
      `Explaining ${name} with inventory terms only and ignoring entitlement logic.`,
      'Assuming normalization and compliance happen automatically without governance.',
      'Ignoring publisher-specific metrics or reclaimable opportunities.'
    ]
  },
  HRSD: {
    tables: ['sn_hr_core_case', 'sn_hr_core_service'],
    definition: (name) => `${name} is an HR Service Delivery topic for HR cases, services, and employee-facing workflow governance.`,
    whatItDoes: () => 'It helps HR teams deliver employee service securely while preserving role-based visibility and process consistency.',
    keyComponents: () => [
      'Understand whether the topic concerns HR services or HR case security behavior.',
      'Know which employee and agent experiences are affected.',
      'Validate confidentiality and routing carefully.',
      'Keep HR-specific access expectations in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to support secure employee service delivery in HR workflows.`,
      `Review ${name} when HR cases are visible or routed incorrectly.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} like generic ITSM without HR confidentiality requirements.`,
      'Ignoring case visibility and employee privacy implications.',
      'Focusing only on form behavior instead of end-to-end HR workflow outcomes.'
    ]
  },
  'Legacy UI': {
    tables: ['sys_ui_page', 'sys_ui_macro'],
    definition: (name) => `${name} is a legacy UI topic used in older UI patterns and server-rendered interface customization.`,
    whatItDoes: () => 'It helps teams understand or maintain older ServiceNow UI constructs that still appear in some implementations.',
    keyComponents: () => [
      'Know the legacy object and where it is still used.',
      'Understand how server-rendered UI differs from newer experiences.',
      'Validate upgrade and maintainability implications.',
      'Prefer modern replacements for new development when appropriate.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} mainly when maintaining an existing legacy implementation.`,
      `Review ${name} during modernization work to understand what must be replaced or retained.`
    ],
    interviewPitfalls: (name) => [
      `Designing new experiences around ${name} without checking for a modern alternative.`,
      'Ignoring maintainability and upgrade concerns.',
      'Confusing legacy UI constructs with current workspace or portal patterns.'
    ]
  },
  'Server-side APIs': {
    tables: ['No single table — server-side API'],
    definition: (name) => `${name} is a server-side API topic used in scripts that run on the instance rather than in the browser.`,
    whatItDoes: () => 'It helps developers query data, manipulate records, control transaction behavior, or use platform utility classes from server-side code.',
    keyComponents: () => [
      'Understand what the API does and where it is valid to call it.',
      'Know common methods, scope behavior, and performance implications.',
      'Validate transaction side effects and data access patterns.',
      'Use the right API for the job instead of forcing one class into every scenario.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} in a Business Rule, Script Include, or background script to control server-side behavior.`,
      `Review ${name} when a script works functionally but scales or secures poorly.`
    ],
    interviewPitfalls: (name) => [
      `Using ${name} in the wrong execution context.`,
      'Ignoring scope, security, or performance tradeoffs.',
      'Memorizing syntax without explaining when the API is the right choice.'
    ]
  },
  'Client-side APIs': {
    tables: ['No single table — client-side API'],
    definition: (name) => `${name} is a client-side API topic used in browser-based form or UI behavior.`,
    whatItDoes: () => 'It helps client scripts interact with the user interface without going straight to database logic.',
    keyComponents: () => [
      'Know when the API runs and what objects are available in the browser.',
      'Use it for UI behavior rather than server-side data processing.',
      'Validate performance and user experience during form interaction.',
      'Pair with server calls only when the client truly needs extra data.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to control fields and messages on a form as the user works.`,
      `Review ${name} when client behavior looks correct visually but has the wrong data assumptions.`
    ],
    interviewPitfalls: (name) => [
      `Expecting ${name} to behave like a server-side API.`,
      'Putting too much data logic in the browser.',
      'Ignoring asynchronous timing and user interaction flow.'
    ]
  },
  Integrations: {
    tables: ['sys_rest_message', 'sys_soap_message', 'sys_ws_definition'],
    definition: (name) => `${name} is an integration topic used to exchange data or behavior between ServiceNow and external systems.`,
    whatItDoes: () => 'It helps teams expose inbound services, call outbound services, and authenticate or structure those interactions correctly.',
    keyComponents: () => [
      'Understand whether the topic is inbound, outbound, or design guidance.',
      'Know how authentication, payload, and error handling are managed.',
      'Validate security and retry behavior, not only the happy path.',
      'Keep maintainability and versioning in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to connect ServiceNow with external systems for data exchange or orchestration.`,
      `Review ${name} when an integration works in testing but fails under realistic error conditions.`
    ],
    interviewPitfalls: (name) => [
      `Explaining ${name} only as a transport protocol and not as an integration pattern.`,
      'Ignoring authentication, retry, or payload validation concerns.',
      'Choosing a pattern without considering long-term maintainability.'
    ]
  },
  SecOps: {
    tables: ['sn_si_incident', 'sn_vul_vulnerability', 'sn_ti_indicator'],
    definition: (name) => `${name} is a Security Operations topic covering incident response, threat intelligence, or vulnerability response workflows.`,
    whatItDoes: () => 'It helps security teams intake, triage, enrich, prioritize, and drive remediation work using ServiceNow security workflows.',
    keyComponents: () => [
      'Understand which SecOps capability the topic belongs to.',
      'Know the primary security record and how tasks, enrichments, or exceptions connect to it.',
      'Validate operational workflow as well as data enrichment quality.',
      'Keep CI context and remediation ownership in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to standardize how security teams move from intake to investigation and remediation.`,
      `Review ${name} when security records exist but the response workflow is inconsistent or incomplete.`
    ],
    interviewPitfalls: (name) => [
      `Explaining ${name} with generic ITSM language and missing security-specific workflow needs.`,
      'Ignoring enrichment, prioritization, or CI context.',
      'Focusing on intake while neglecting remediation follow-through.'
    ]
  },
  'Service Mapping': {
    tables: ['cmdb_ci_service', 'svc_entry_point', 'cmdb_rel_ci'],
    definition: (name) => `${name} is a Service Mapping topic used to model application service topology and the dependencies that support a business service.`,
    whatItDoes: () => 'It helps teams understand how services are composed so impact analysis and operational visibility are meaningful.',
    keyComponents: () => [
      'Understand the service, entry point, or dependency object involved.',
      'Know how topology is discovered or maintained.',
      'Validate map accuracy and business relevance.',
      'Keep the operational consumer of the service map in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to build or troubleshoot a service topology for an important business application.`,
      `Review ${name} when impact analysis is incomplete because dependencies are missing or wrong.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} as just a visual diagram instead of a maintained model.`,
      'Ignoring entry-point quality or relationship accuracy.',
      'Building maps without a clear operational use case.'
    ]
  },
  Workspace: {
    tables: ['sys_ux_page_registry', 'sys_ux_macroponent', 'sys_ux_screen_type'],
    definition: (name) => `${name} is a workspace topic used to build or configure modern Next Experience record pages and analyst experiences.`,
    whatItDoes: () => 'It helps teams design focused agent workspaces with the right pages, components, and productivity patterns.',
    keyComponents: () => [
      'Understand whether the topic concerns record pages, reusable components, or workspace experience layout.',
      'Know how the page or component is surfaced to the end user.',
      'Validate productivity and role-based usability.',
      'Prefer reusable workspace design patterns over one-off page customizations.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to tailor an analyst workspace for faster case or incident handling.`,
      `Review ${name} when a workspace experience is technically available but not efficient for agents.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} as only a visual customization and ignoring workflow fit.`,
      'Ignoring role targeting or page reuse strategy.',
      'Over-customizing pages without a maintainability plan.'
    ]
  },
  Reporting: {
    tables: ['sys_report', 'pa_dashboards'],
    definition: (name) => `${name} is a reporting topic focused on visualizing ServiceNow data for operational or management use.`,
    whatItDoes: () => 'It helps teams present the right measures and visuals so stakeholders can monitor work and trends.',
    keyComponents: () => [
      'Understand the data source and intended audience.',
      'Know which visuals belong in reports versus dashboards.',
      'Validate filters and date logic carefully.',
      'Use shared metric definitions to avoid conflicting reports.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to present service trends and work visibility to stakeholders.`,
      `Review ${name} when multiple visualizations appear to describe the same process differently.`
    ],
    interviewPitfalls: (name) => [
      `Focusing on chart style instead of metric definition in ${name}.`,
      'Ignoring filters or time windows.',
      'Publishing visuals before validating stakeholder interpretation.'
    ]
  },
  Deployment: {
    tables: ['sys_update_set', 'sys_update_xml', 'sys_repo_config'],
    definition: (name) => `${name} is a deployment topic used to move or govern changes across ServiceNow instances.`,
    whatItDoes: () => 'It helps teams control how development work is packaged, promoted, and tracked through the environment lifecycle.',
    keyComponents: () => [
      'Understand the packaging mechanism and where it fits in the delivery process.',
      'Know the relationship between development, test, and production movement.',
      'Validate completeness and dependency handling.',
      'Keep release governance and rollback readiness in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to prepare changes for movement across instances.`,
      `Review ${name} when a change is complete in development but not safely promotable.`
    ],
    interviewPitfalls: (name) => [
      `Using ${name} without checking dependencies or sequencing.`,
      'Confusing development convenience with release governance.',
      'Skipping validation because the transport step seems mechanical.'
    ]
  },
  'Virtual Agent': {
    tables: ['sys_cs_topic', 'sys_cs_intent'],
    definition: (name) => `${name} is a Virtual Agent topic used to define conversational experiences and guided interactions for users.`,
    whatItDoes: () => 'It helps teams automate support or service interactions through structured conversation flows and handoffs.',
    keyComponents: () => [
      'Understand the conversation topic, intent, or handoff behavior involved.',
      'Know what inputs are collected and what downstream action is triggered.',
      'Validate conversation clarity and fallback handling.',
      'Keep user guidance and escalation paths in mind.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to let users complete a support request through conversation instead of a full form.`,
      `Review ${name} when the bot reaches a logical dead end or poor handoff.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} as only a chatbot script and not a guided service experience.`,
      'Ignoring fallback and escalation behavior.',
      'Collecting too much information before providing value.'
    ]
  },
  'Data Management': {
    tables: ['sys_import_set', 'sys_transform_map', 'sys_transform_entry'],
    definition: (name) => `${name} is a data-management topic used to control how source data is staged, matched, mapped, and transformed in the platform.`,
    whatItDoes: () => 'It helps teams import external data accurately and manage how records are updated or inserted.',
    keyComponents: () => [
      'Understand what object controls matching, mapping, or transform behavior.',
      'Know how the staging layer differs from the target layer.',
      'Validate update versus insert logic carefully.',
      'Review import quality with row history and transform results.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} during recurring data loads where duplicate prevention and update logic matter.`,
      `Review ${name} when an import looks successful but produces unexpected target records.`
    ],
    interviewPitfalls: (name) => [
      `Treating ${name} as one-time configuration and not validating recurring behavior.`,
      'Ignoring target-table side effects and matching logic.',
      'Focusing only on field mapping while missing update strategy.'
    ]
  },
  Automation: {
    tables: ['sysevent', 'sysevent_script_action', 'sysauto'],
    definition: (name) => `${name} is an automation topic used to trigger, schedule, or react to platform events and business activity.`,
    whatItDoes: () => 'It helps teams decouple follow-on behavior and automate work consistently after key platform events occur.',
    keyComponents: () => [
      'Understand whether the topic reacts to events, time, or explicit automation logic.',
      'Know what triggers execution and what consumes the output.',
      'Validate timing and downstream side effects.',
      'Prefer reusable automation patterns over scattered custom code.'
    ],
    realTimeExamples: (name) => [
      `Use ${name} to perform work automatically after a record change or scheduled condition.`,
      `Review ${name} when automation appears correct but the downstream action never happens.`
    ],
    interviewPitfalls: (name) => [
      `Implementing ${name} without tracing the full trigger-to-consumer path.`,
      'Ignoring timing and execution order.',
      'Hard-coding follow-on logic where a cleaner event-driven pattern is available.'
    ]
  }
};

function defaultTemplates(topic) {
  const library = CATEGORY_DEFAULTS[topic.category];
  if (library) {
    return {
      definition: library.definition(topic.name),
      whatItDoes: library.whatItDoes(topic.name),
      tablesInvolved: library.tables,
      keyComponents: library.keyComponents(topic.name),
      realTimeExamples: library.realTimeExamples(topic.name),
      interviewPitfalls: library.interviewPitfalls(topic.name)
    };
  }
  return {
    definition: `${topic.name} is a ServiceNow topic used in platform configuration, development, or administration.`,
    whatItDoes: `It helps teams understand and apply ${topic.name} correctly in real platform implementations.`,
    tablesInvolved: ['Varies by implementation'],
    keyComponents: [
      `Understand the main object or behavior behind ${topic.name}.`,
      'Know where it is configured or executed.',
      'Validate runtime behavior with realistic test data.',
      'Explain tradeoffs and downstream impact in interviews.'
    ],
    realTimeExamples: [
      `Use ${topic.name} in a real implementation where the platform must support a business outcome.`,
      `Review ${topic.name} when troubleshooting unexpected behavior tied to this capability.`
    ],
    interviewPitfalls: [
      `Explaining ${topic.name} too generically.`,
      'Ignoring runtime behavior and dependencies.',
      'Skipping realistic validation or troubleshooting steps.'
    ]
  };
}

function inferTables(topic) {
  const id = topic.id;
  const exact = EXACT_DEFAULTS[id];
  if (exact?.tablesInvolved?.length) return exact.tablesInvolved;
  if (id.includes('gliderecord')) return ['Target business table', 'sys_db_object'];
  if (id.includes('glidequery') || id === 'glide-query') return ['Target business table'];
  if (id.includes('glidedatetime') || id === 'glide-date-time') return ['No single table — server-side API'];
  if (id.includes('rest')) return ['sys_rest_message', 'sys_ws_definition'];
  if (id.includes('soap')) return ['sys_soap_message'];
  if (id.includes('transform')) return ['sys_transform_map', 'sys_transform_entry', 'sys_transform_script'];
  if (id.includes('import')) return ['sys_data_source', 'sys_import_set', 'sys_import_set_row'];
  if (id.includes('catalog') || id.includes('variable') || id.includes('request')) return ['sc_cat_item', 'sc_request', 'sc_req_item', 'item_option_new'];
  if (id.includes('incident')) return ['incident', 'task'];
  if (id.includes('problem')) return ['problem', 'task'];
  if (id.includes('change')) return ['change_request', 'task'];
  if (id.includes('sla')) return ['contract_sla', 'task_sla'];
  if (id.includes('cmdb') || id.includes('ci-') || id.includes('-cis') || id.includes('ire') || id.includes('identification') || id.includes('reconciliation')) return ['cmdb_ci', 'cmdb_rel_ci', 'sys_object_source'];
  if (id.includes('discovery') || id.includes('mid-server') || id.includes('ecc') || id.includes('pattern') || id.includes('probe') || id.includes('sensor') || id.includes('credential')) return ['discovery_schedule', 'ecc_queue', 'ecc_agent'];
  if (id.includes('asset') || id.includes('stockroom') || id.includes('transfer') || id.includes('hardware')) return ['alm_asset', 'alm_hardware', 'alm_stockroom'];
  if (id.includes('software') || id.includes('license') || id.includes('reclamation') || id.includes('normalization') || id.includes('entitlement')) return ['alm_entitlement', 'cmdb_sam_sw_install', 'sam_sw_compliance'];
  if (id.includes('policy') || id.includes('audit') || id.includes('risk') || id.includes('control') || id.includes('vendor')) return ['sn_compliance_policy', 'sn_compliance_control', 'sn_grc_issue'];
  if (id.includes('security-incident') || id.includes('vulnerability') || id.includes('threat')) return ['sn_si_incident', 'sn_vul_vulnerability', 'sn_ti_indicator'];
  if (id.includes('portal')) return ['sp_widget', 'sp_page', 'sp_instance'];
  if (id.includes('workspace') || id.includes('ui-builder')) return ['sys_ux_page_registry', 'sys_ux_macroponent'];
  if (id.includes('mobile')) return ['sys_sg_app', 'sys_ux_screen'];
  if (id.includes('report') || id.includes('dashboard') || id.includes('pa-')) return ['sys_report', 'pa_dashboards'];
  if (id.includes('virtual-agent')) return ['sys_cs_topic', 'sys_cs_intent'];
  if (id.includes('hr-')) return ['sn_hr_core_case', 'sn_hr_core_service'];
  if (id.includes('csm-')) return ['sn_customerservice_case'];
  return defaultTemplates(topic).tablesInvolved;
}

function mergeArrays(base, override) {
  return Array.isArray(override) && override.length ? override : base;
}

function mergeEntry(defaultEntry, curatedEntry = {}) {
  return {
    topicId: defaultEntry.topicId,
    definition: curatedEntry.definition || defaultEntry.definition,
    whatItDoes: curatedEntry.whatItDoes || defaultEntry.whatItDoes,
    tablesInvolved: mergeArrays(defaultEntry.tablesInvolved, curatedEntry.tablesInvolved),
    keyComponents: mergeArrays(defaultEntry.keyComponents, curatedEntry.keyComponents),
    realTimeExamples: mergeArrays(defaultEntry.realTimeExamples, curatedEntry.realTimeExamples),
    interviewPitfalls: mergeArrays(defaultEntry.interviewPitfalls, curatedEntry.interviewPitfalls)
  };
}

export function buildTopicOverviews(topics = [], curated = []) {
  const curatedByTopicId = Object.fromEntries((curated || []).map((item) => [item.topicId, item]));
  return topics.map((topic) => {
    const exact = EXACT_DEFAULTS[topic.id] || {};
    const generic = defaultTemplates(topic);
    const defaultEntry = {
      topicId: topic.id,
      definition: exact.definition || generic.definition,
      whatItDoes: exact.whatItDoes || generic.whatItDoes,
      tablesInvolved: exact.tablesInvolved || inferTables(topic),
      keyComponents: generic.keyComponents,
      realTimeExamples: generic.realTimeExamples,
      interviewPitfalls: generic.interviewPitfalls
    };
    return mergeEntry(defaultEntry, curatedByTopicId[topic.id]);
  });
}
