function getApiBaseUrl() {
  let url = (import.meta.env.VITE_API_BASE_URL || '').trim();

  if (!url) {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return 'http://localhost:8080/api';
    }
    return 'http://localhost:8080/api';
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  url = url.replace(/\/+$/, '');

  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }

  return url;
}

const BASE_URL = getApiBaseUrl();

const TOKEN_KEY = 'pahadihaat_token';

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* localStorage unavailable — ignore, auth just won't persist */
  }
}

/**
 * Thin fetch wrapper: builds the URL, attaches the bearer token when present,
 * JSON-encodes the body, and throws a normal Error (with a readable message)
 * on any non-2xx response so callers can just try/catch.
 */
export async function apiFetch(path, { method = 'GET', body, auth = true, headers = {} } = {}) {
  const finalHeaders = { ...headers };
  let finalBody = body;

  if (body !== undefined) {
    finalHeaders['Content-Type'] = 'application/json';
    finalBody = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) finalHeaders['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, { method, headers: finalHeaders, body: finalBody });
  } catch (networkErr) {
    throw new Error(
      `Could not reach the server at ${BASE_URL}. Is the Spring Boot backend running? (${networkErr.message})`
    );
  }

  if (response.status === 204) return null;

  const isJson = (response.headers.get('content-type') || '').includes('application/json');
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (data === null && response.status !== 204) {
    throw new Error(`Server returned non-JSON response (${response.status})`);
  }

  return data;
}
