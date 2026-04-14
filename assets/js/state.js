
export const appState = {
  loaded: false,
  route: null,
  data: {
    roles: [],
    modules: [],
    topics: [],
    theory: [],
    coding: [],
    useCases: [],
    quizzes: [],
    coverage: null,
    searchIndex: [],
    maps: {}
  },
  lookups: {
    rolesById: {},
    modulesById: {},
    topicsById: {},
    topicAliases: {},
    contentById: {}
  },
  quizSession: null
};
