
const STORAGE_KEY = 'snow_interview_hub_bookmarks';

export function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (_error) {
    return [];
  }
}

export function saveBookmarks(bookmarks = []) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function isBookmarked(id) {
  return getBookmarks().some((item) => item.id === id);
}

export function toggleBookmark(payload) {
  const bookmarks = getBookmarks();
  const existing = bookmarks.find((item) => item.id === payload.id);

  if (existing) {
    const updated = bookmarks.filter((item) => item.id !== payload.id);
    saveBookmarks(updated);
    return { active: false, bookmarks: updated };
  }

  const updated = [{ ...payload, savedAt: new Date().toISOString() }, ...bookmarks];
  saveBookmarks(updated);
  return { active: true, bookmarks: updated };
}
