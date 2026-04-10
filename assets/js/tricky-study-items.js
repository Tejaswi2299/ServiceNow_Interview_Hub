const TRICKY_STUDY_TYPES = ['comparison', 'tricky', 'troubleshooting'];

function uniqueIds(values = []) {
  return [...new Set((values || []).filter(Boolean))];
}

function normalizeText(value = '') {
  return `${value}`.toLowerCase().replace(/\s+/g, ' ').trim();
}

function keyForTopicQuestion(topicId, value) {
  return `${topicId || ''}::${normalizeText(value)}`;
}

function buildFallbackKeyPoints(topicName) {
  return [
    `${topicName} should be explained in platform-accurate terms, not only as a shortcut definition.`,
    `Tie ${topicName} back to how it behaves in real implementations and interviews.`,
    `Call out the dependency, evaluation, or scope detail that candidates usually miss.`
  ];
}

function buildFallbackExamples(topicName) {
  return [
    `Use a real ${topicName} implementation example when answering this question in an interview.`,
    `Explain how you would validate ${topicName} with a realistic user, record, or workflow scenario.`
  ];
}

function buildExactAnswer(topicName, pitfall, overview = {}) {
  const parts = [
    overview.definition,
    overview.whatItDoes,
    ...(overview.keyComponents || []).slice(0, 2)
  ].filter(Boolean);

  if (parts.length) {
    return parts.join(' ');
  }

  return `${pitfall} The correct way to answer this is to explain what ${topicName} does on the platform, what controls or dependencies affect it, and how it behaves in a real implementation.`;
}

function getMappedModuleIds(lookups = {}, topicId = '') {
  return uniqueIds([...(lookups.topicToModuleIds?.[topicId] || []), ...(lookups.topicsById?.[topicId]?.moduleIds || [])]);
}

function getMappedRoleIds(lookups = {}, topicId = '', moduleIds = []) {
  const roleIdsFromTopic = lookups.topicToRoleIds?.[topicId] || [];
  const roleIdsFromModules = moduleIds.flatMap((moduleId) => lookups.moduleToRoleIds?.[moduleId] || []);
  return uniqueIds([...roleIdsFromTopic, ...roleIdsFromModules]);
}

export function getTrickyStudyItems(theory = []) {
  return (theory || []).filter((item) => TRICKY_STUDY_TYPES.includes(item.contentType));
}

export function buildPitfallStudyItems({ topics = [], theory = [], topicOverviews = [], lookups = {} }) {
  const topicById = Object.fromEntries((topics || []).map((topic) => [topic.id, topic]));
  const existingKeys = new Set(
    (theory || [])
      .filter((item) => TRICKY_STUDY_TYPES.includes(item.contentType))
      .flatMap((item) => {
        const label = item.question || item.title || '';
        const topicIds = item.topicIds || [];
        if (!label || !topicIds.length) return [];
        return topicIds.map((topicId) => keyForTopicQuestion(topicId, label));
      })
  );

  return (topicOverviews || []).flatMap((overview) => {
    const topic = topicById[overview.topicId];
    if (!topic) return [];

    const moduleIds = getMappedModuleIds(lookups, topic.id);
    const roleIds = getMappedRoleIds(lookups, topic.id, moduleIds);
    const keyPoints = (overview.keyComponents || []).length ? overview.keyComponents : buildFallbackKeyPoints(topic.name);
    const examples = (overview.realTimeExamples || []).length ? overview.realTimeExamples : buildFallbackExamples(topic.name);
    const relatedTables = overview.tablesInvolved || [];

    return (overview.interviewPitfalls || [])
      .filter(Boolean)
      .map((pitfall, index) => {
        const dedupeKey = keyForTopicQuestion(topic.id, pitfall);
        if (existingKeys.has(dedupeKey)) return null;
        existingKeys.add(dedupeKey);

        return {
          id: `pitfall-${topic.id}-${index + 1}`,
          slug: `${topic.slug}-pitfall-${index + 1}`,
          title: pitfall,
          question: pitfall,
          summary: `Interview pitfall for ${topic.name}`,
          exactAnswer: buildExactAnswer(topic.name, pitfall, overview),
          keyPoints,
          examples,
          roleIds,
          moduleIds,
          topicIds: [topic.id],
          difficulty: 'Interview',
          contentType: 'tricky',
          relatedTables,
          tags: ['interview pitfall', topic.name]
        };
      })
      .filter(Boolean);
  });
}
