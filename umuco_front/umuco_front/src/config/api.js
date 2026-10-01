// Set VITE_API_BASE to the backend origin when deploying. Locally this points
// at the Express API in ../../backend.
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export function apiUrl(path = '') {
  if (/^https?:\/\//i.test(path)) return path;
  
  let base = API_BASE.replace(/\/$/, '');
  if (!/^https?:\/\//i.test(base)) {
    base = `https://${base}`;
  }
  
  const normalizedPath = path.replace(/^\//, '');
  
  return `${base}/${normalizedPath}`;
}

export function assetUrl(path = '') {
  if (!path || /^https?:\/\//i.test(path) || path.startsWith('data:')) return path;
  return apiUrl(path);
}

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const hasBody = options.body != null;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers = {
    ...(hasBody && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  return fetch(apiUrl(path), { ...options, headers });
}

export async function apiJson(path, options = {}) {
  const res = await apiFetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || `Request failed (${res.status})`);
  }
  return data;
}
