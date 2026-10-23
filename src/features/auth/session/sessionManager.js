import { ApiError, httpClient } from '@core/http/httpClient.js';
import { tokenStore } from './tokenStore.js';
import { accessExpiry, isExpiring, sessionExpiry } from './tokenExpiry.js';

const listeners = new Set();
let endedReason = null; 
let refreshing = null;

const notify = () => listeners.forEach((listener) => listener());

function endLocal(reason) {
  if (!tokenStore.get()) return;
  tokenStore.clear();
  endedReason = reason;
  notify();
}

function start({ accessToken, refreshToken, userId, username, firstName, expiresIn }) {
  if (!accessToken || !refreshToken) throw new Error('The login response carried no tokens.');
  tokenStore.set({ accessToken, refreshToken, userId, username, firstName, accessExpiresAt: accessExpiry(accessToken, expiresIn) });
  endedReason = null;
  notify();
}

async function requestNewTokens(current) {
  try {
    const data = await httpClient.post('/auth/refresh-token', { refreshToken: current.refreshToken }, { auth: false });
    if (!data?.accessToken) throw new ApiError({ status: 500, message: 'Unexpected response from the server.' });
    tokenStore.set({
      ...current,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? current.refreshToken,
      accessExpiresAt: accessExpiry(data.accessToken, data.expiresIn),
    });
    return data.accessToken;
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error; 
    const latest = tokenStore.reload();
    if (latest && latest.refreshToken !== current.refreshToken) return latest.accessToken; 
    endLocal('expired');
    return null;
  }
}

function refresh(staleToken) {
  const current = tokenStore.get();
  if (!current) return Promise.resolve(null);
  if (staleToken && current.accessToken !== staleToken) return Promise.resolve(current.accessToken);
  refreshing ??= requestNewTokens(current).finally(() => {
    refreshing = null;
  });
  return refreshing;
}

function handleSessionRevoked(error) {
  endLocal(error?.isSessionRevoked ? 'revoked' : 'expired');
}

async function signOut(reason = null) {
  const session = tokenStore.get();
  let token = session?.accessToken;
  endLocal(reason);
  if (!token) return;
  try {
    if (isExpiring(sessionExpiry(session))) {
      const data = await httpClient.post('/auth/refresh-token', { refreshToken: session.refreshToken }, { auth: false });
      token = data?.accessToken ?? token;
    }
    await httpClient.post('/logout/user', undefined, { auth: false, headers: { Authorization: `Bearer ${token}` } });
  } catch {
    // Best effort: the device is already signed out.
  }
}

function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

tokenStore.onExternalChange(notify);

export const sessionManager = {
  start,
  refresh,
  signOut,
  handleSessionRevoked,
  subscribe,
  getAccessToken: () => tokenStore.get()?.accessToken ?? null,
  getAccessExpiry: () => {
    const session = tokenStore.get();
    return session ? sessionExpiry(session) : null;
  },
  hasSession: () => Boolean(tokenStore.get()),
  getUser: () => {
    const session = tokenStore.get();
    return session ? { userId: session.userId, username: session.username, firstName: session.firstName ?? null } : null;
  },
  getEndedReason: () => endedReason,
};
