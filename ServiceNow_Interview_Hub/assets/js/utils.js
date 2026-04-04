
export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function toTitleCase(value = '') {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function unique(array = []) {
  return [...new Set(array)];
}

export function sortByName(items = [], key = 'name') {
  return [...items].sort((a, b) => (a[key] || '').localeCompare(b[key] || ''));
}

export function truncate(value = '', max = 160) {
  if (!value || value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

export function formatCount(value) {
  return new Intl.NumberFormat('en-US').format(value || 0);
}

export function groupBy(array, getter) {
  return array.reduce((acc, item) => {
    const key = getter(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function getHashWithoutPrefix() {
  return window.location.hash.replace(/^#/, '') || '/home';
}

export function slugLabelMap(items = []) {
  return items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
}

export function buildMetaChips(labels = []) {
  return labels.filter(Boolean).map((label) => `<span class="badge">${escapeHtml(label)}</span>`).join('');
}
