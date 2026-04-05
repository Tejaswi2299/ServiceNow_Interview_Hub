
export const APP_NAME = 'ServiceNow Interview Hub';
export const REPO_NAME = 'ServiceNow_Interview_Hub';
export const GA_MEASUREMENT_ID = 'G-YMEYJNYHR7';

export const TAXONOMY_FILES = {
  roles: 'data/taxonomy/roles.json',
  modules: 'data/taxonomy/modules.json',
  topics: 'data/taxonomy/topics.json',
  contentTypes: 'data/taxonomy/content-types.json',
  difficultyLevels: 'data/taxonomy/difficulty-levels.json'
};

export const MAP_FILES = {
  roleModule: 'data/maps/role-module-map.json',
  moduleTopic: 'data/maps/module-topic-map.json',
  roleTopic: 'data/maps/role-topic-map.json',
  moduleCoding: 'data/maps/module-coding-map.json',
  moduleUseCase: 'data/maps/module-usecase-map.json'
};

export const CONTENT_FILES = {
  theory: [
    'data/content/theory/platform-core.json',
    'data/content/theory/tables-and-schema.json',
    'data/content/theory/security.json',
    'data/content/theory/integrations.json',
    'data/content/theory/cmdb.json',
    'data/content/theory/discovery.json',
    'data/content/theory/catalog.json',
    'data/content/theory/flow-designer.json',
    'data/content/theory/grc.json',
    'data/content/theory/secops.json',
    'data/content/theory/ham-sam.json',
    'data/content/theory/wave2.json',
    'data/content/theory/wave3.json',
    'data/content/theory/wave4.json',
    'data/content/theory/wave5.json',
    'data/content/theory/wave6-data-fix.json'
  ],
  coding: [
    'data/content/coding/business-rules.json',
    'data/content/coding/client-scripts.json',
    'data/content/coding/glide-record.json',
    'data/content/coding/glide-query.json',
    'data/content/coding/script-includes.json',
    'data/content/coding/integrations.json',
    'data/content/coding/acls.json',
    'data/content/coding/transform-maps.json',
    'data/content/coding/background-scripts.json',
    'data/content/coding/wave2.json',
    'data/content/coding/wave3.json',
    'data/content/coding/wave4.json',
    'data/content/coding/wave5.json'
  ],
  useCases: [
    'data/content/use-cases/incident.json',
    'data/content/use-cases/request.json',
    'data/content/use-cases/catalog.json',
    'data/content/use-cases/cmdb.json',
    'data/content/use-cases/discovery.json',
    'data/content/use-cases/integrations.json',
    'data/content/use-cases/security.json',
    'data/content/use-cases/grc.json',
    'data/content/use-cases/secops.json',
    'data/content/use-cases/ham-sam.json',
    'data/content/use-cases/wave2.json',
    'data/content/use-cases/wave3.json',
    'data/content/use-cases/wave4.json',
    'data/content/use-cases/wave5.json'
  ],
  quizzes: 'data/content/quizzes/quiz-bank.json',
  searchIndex: 'data/indexes/search-index.json',
  coverage: 'data/indexes/coverage-index.json'
};

export const DEFAULT_QUIZ_COUNT = 10;
export const QUIZ_COUNTS = [10, 20, 25, 30, 40];
