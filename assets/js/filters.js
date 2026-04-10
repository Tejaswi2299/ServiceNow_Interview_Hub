
function uniqueIds(values = []) {
  return [...new Set((values || []).filter(Boolean))];
}

function invertMap(map = {}) {
  const inverted = {};
  Object.entries(map || {}).forEach(([parentId, childIds]) => {
    (childIds || []).forEach((childId) => {
      if (!inverted[childId]) inverted[childId] = [];
      inverted[childId].push(parentId);
    });
  });
  return inverted;
}

function buildFilterContext(context = {}) {
  if (context.__filterContextCache) return context.__filterContextCache;

  const maps = context.data?.maps || context.maps || {};
  const lookups = context.lookups || {};

  const roleToModules = maps.roleModule || {};
  const moduleToTopics = maps.moduleTopic || {};
  const roleToTopics = maps.roleTopic || {};

  const built = {
    lookups,
    roleToModules,
    moduleToTopics,
    roleToTopics,
    topicToModules: invertMap(moduleToTopics),
    topicToRoles: invertMap(roleToTopics),
    moduleToRoles: invertMap(roleToModules)
  };

  if (context && typeof context === 'object') {
    context.__filterContextCache = built;
  }

  return built;
}

function resolveTopicIds(item = {}) {
  return uniqueIds([...(item.topicIds || []), item.topicId]);
}

function resolveModuleIds(item = {}, context = {}) {
  const topicIds = resolveTopicIds(item);
  const derivedFromTopics = topicIds.flatMap((topicId) => context.topicToModules?.[topicId] || []);
  const derivedFromRoles = (item.roleIds || []).flatMap((roleId) => context.roleToModules?.[roleId] || []);
  return uniqueIds([...(item.moduleIds || []), ...derivedFromTopics, ...derivedFromRoles]);
}

function resolveRoleIds(item = {}, context = {}) {
  const topicIds = resolveTopicIds(item);
  const derivedFromTopics = topicIds.flatMap((topicId) => context.topicToRoles?.[topicId] || []);
  const directModuleIds = item.moduleIds || [];
  const derivedFromModules = directModuleIds.flatMap((moduleId) => context.moduleToRoles?.[moduleId] || []);
  return uniqueIds([...(item.roleIds || []), ...derivedFromTopics, ...derivedFromModules]);
}

function buildHaystack(item = {}, topicIds = [], moduleIds = [], roleIds = [], lookups = {}) {
  const topicNames = topicIds.map((id) => lookups.topicsById?.[id]?.name).filter(Boolean);
  const moduleNames = moduleIds.map((id) => lookups.modulesById?.[id]?.name).filter(Boolean);
  const roleNames = roleIds.map((id) => lookups.rolesById?.[id]?.name).filter(Boolean);

  return [
    item.title,
    item.question,
    item.summary,
    item.exactAnswer,
    ...(item.tags || []),
    ...(item.relatedTables || []),
    ...topicNames,
    ...moduleNames,
    ...roleNames
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function filterStudyItems(items = [], filters = {}, context = {}) {
  const derivedContext = buildFilterContext(context);

  return items.filter((item) => {
    const topicIds = resolveTopicIds(item);
    const moduleIds = resolveModuleIds(item, derivedContext);
    const roleIds = resolveRoleIds(item, derivedContext);

    if (filters.module && !moduleIds.includes(filters.module)) return false;
    if (filters.topic && !topicIds.includes(filters.topic)) return false;
    if (filters.role && !roleIds.includes(filters.role)) return false;

    const activeType = filters.type || filters.category || '';
    const activeQuery = filters.query || filters.q || '';

    if (filters.difficulty && item.difficulty !== filters.difficulty) return false;
    if (activeType && item.contentType !== activeType) return false;

    if (activeQuery) {
      const haystack = buildHaystack(item, topicIds, moduleIds, roleIds, derivedContext.lookups);
      if (!haystack.includes(activeQuery.toLowerCase())) return false;
    }

    return true;
  });
}
