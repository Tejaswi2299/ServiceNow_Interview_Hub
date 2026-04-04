
import { getHashWithoutPrefix } from './utils.js';

export function parseHash() {
  const raw = getHashWithoutPrefix();
  const [pathPart, queryString = ''] = raw.split('?');
  const cleanPath = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  const segments = cleanPath.split('/').filter(Boolean);
  const query = Object.fromEntries(new URLSearchParams(queryString).entries());

  return {
    raw,
    path: cleanPath,
    segments,
    query
  };
}

export function makeHash(path, query = {}) {
  const prefix = path.startsWith('/') ? path : `/${path}`;
  const params = new URLSearchParams(
    Object.entries(query).filter(([, value]) => value !== undefined && value !== null && value !== '')
  );
  return params.toString() ? `#${prefix}?${params.toString()}` : `#${prefix}`;
}

export function navigate(path, query = {}) {
  window.location.hash = makeHash(path, query);
}
