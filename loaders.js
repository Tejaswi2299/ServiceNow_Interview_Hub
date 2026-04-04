
export function filterStudyItems(items = [], filters = {}) {
  return items.filter((item) => {
    if (filters.module && !(item.moduleIds || []).includes(filters.module)) return false;
    if (filters.topic && !(item.topicIds || []).includes(filters.topic)) return false;
    if (filters.role && !(item.roleIds || []).includes(filters.role)) return false;
    const activeType = filters.type || filters.category || '';
    const activeQuery = filters.query || filters.q || '';
    if (filters.difficulty && item.difficulty !== filters.difficulty) return false;
    if (activeType && item.contentType !== activeType) return false;
    if (activeQuery) {
      const haystack = [
        item.title,
        item.question,
        item.summary,
        ...(item.tags || []),
        ...(item.relatedTables || [])
      ].join(' ').toLowerCase();
      if (!haystack.includes(activeQuery.toLowerCase())) return false;
    }
    return true;
  });
}
