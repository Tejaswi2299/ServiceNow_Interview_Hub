
import { truncate } from './utils.js';

export function searchIndex(indexItems = [], query = '') {
  const cleaned = query.trim().toLowerCase();
  if (!cleaned) return [];
  const terms = cleaned.split(/\s+/).filter(Boolean);

  const scored = indexItems.map((item) => {
    const haystack = [
      item.title,
      item.question,
      item.summary,
      ...(item.tags || []),
      ...(item.relatedTables || []),
      ...(item.moduleIds || []),
      ...(item.roleIds || []),
      ...(item.topicIds || [])
    ].join(' | ').toLowerCase();

    let score = 0;
    for (const term of terms) {
      if (haystack.includes(term)) score += 1;
      if ((item.title || '').toLowerCase().includes(term)) score += 4;
      if ((item.question || '').toLowerCase().includes(term)) score += 2;
    }
    return { item, score };
  });

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || (a.item.title || '').localeCompare(b.item.title || ''))
    .map((entry) => ({
      ...entry.item,
      preview: truncate(entry.item.summary || entry.item.question || '', 170),
      score: entry.score
    }));
}
