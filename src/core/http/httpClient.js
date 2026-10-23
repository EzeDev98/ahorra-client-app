import { env } from '@core/config/env.js';

const SESSION_REVOKED = 'SESSION_REVOKED';

const FALLBACK_MESSAGES = {
  0: 'Could not reach the server. Check your connection and try again.',
  401: 'Please sign in again.',
  403: 'You do not have access to this.',
  429: 'Too many attempts. Please wait a moment and try again.',
};

function fallbackMessage(status) {
  if (FALLBACK_MESSAGES[status]) return FALLBACK_MESSAGES[status];
  return status >= 500 ? 'The service is having trouble. Please try again shortly.' : 'Something went wrong. Please try again.';
}

const text = (value) => (typeof value === 'string' && value.trim() ? value : null);
const plainObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : null);

export class ApiError extends Error {
  constructor({ status, message, code = null, fieldErrors = null, body = null, cause }) {
    super(message, cause ? { cause } : undefined);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.body = body;
  }

  get isNetwork() { return this.status === 0; }
  get isUnauthorized() { return this.status === 401; }
  get isSessionRevoked() { return this.code === SESSION_REVOKED; }
  get isNotFound() { return this.status === 404; }
  get isConflict() { return this.status === 409; }
  get isRateLimited() { return this.status === 429; }
}

let config = {
  getAccessToken: () => null,
  refreshAccessToken: async () => null,
  onSessionRevoked: () => {},
};

export function configureHttpClient(next) {
  config = { ...config, ...next };
}

function buildUrl(path, params) {
  const url = new URL(env.apiBaseUrl + (path.startsWith('/') ? path : `/${path}`));
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  });
  return url;
}

async function readBody(response) {
  if (response.status === 204) return null;
  const raw = await response.text();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

function toApiError(status, body) {
  const data = plainObject(body) ?? {};
  return new ApiError({
    status,
    message: text(data.detail) ?? text(data.message) ?? fallbackMessage(status),
    code: text(data.code) ?? text(data.description),
    fieldErrors: plainObject(data.errors),
    body,
  });
}

async function send({ method, url, payload, token, headers, signal }) {
  const requestHeaders = { Accept: 'application/json', ...headers };
  if (payload !== undefined && !(payload instanceof FormData)) requestHeaders['Content-Type'] = 'application/json';
  if (token) requestHeaders.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(url, { method, headers: requestHeaders, body: payload, signal });
  } catch (cause) {
    if (cause?.name === 'AbortError') throw cause;
    throw new ApiError({ status: 0, message: fallbackMessage(0), cause });
  }

  const body = await readBody(response);
  if (!response.ok) throw toApiError(response.status, body);
  return body;
}

async function recoverFrom401(error, req) {
  if (error.isSessionRevoked) {
    config.onSessionRevoked(error);
    throw error;
  }
  const freshToken = await config.refreshAccessToken(req.token);
  if (!freshToken) {
    config.onSessionRevoked(error);
    throw error;
  }
  try {
    return await send({ ...req, token: freshToken });
  } catch (retryError) {
    if (retryError instanceof ApiError && retryError.status === 401) config.onSessionRevoked(retryError);
    throw retryError;
  }
}

async function request(method, path, { body, params, auth = true, headers, signal } = {}) {
  const req = {
    method,
    url: buildUrl(path, params),
    payload: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    token: auth ? config.getAccessToken() : null,
    headers,
    signal,
  };
  try {
    return await send(req);
  } catch (error) {
    if (auth && error instanceof ApiError && error.status === 401) return recoverFrom401(error, req);
    throw error;
  }
}

export const httpClient = {
  get: (path, options) => request('GET', path, options),
  post: (path, body, options) => request('POST', path, { ...options, body }),
  put: (path, body, options) => request('PUT', path, { ...options, body }),
  delete: (path, options) => request('DELETE', path, options),
};
