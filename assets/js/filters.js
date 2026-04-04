
export function filterStudyItems(items = [], filters = {}) {
  return items.filter((item) => {
    if (filters.module && !(item.moduleIds || []).includes(filters.module)) return false;
    if (filters.topic && !(item.topicIds || []).includes(filters.topic)) return false;
    if (filters.role && !(item.roleIds || []).includes(filters.role)) return false;
    if (filters.difficulty && item.difficulty !== filters.difficulty) return false;
    if (filters.type && item.contentType !== filters.type) return false;
    if (filters.query) {
      const haystack = [
        item.title,
        item.question,
        item.summary,
        ...(item.tags || []),
        ...(item.relatedTables || [])
      ].join(' ').toLowerCase();
      if (!haystack.includes(filters.query.toLowerCase())) return false;
    }
    return true;
  });
}
