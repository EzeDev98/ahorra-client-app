import { sessionManager } from './sessionManager.js';
import { REFRESH_LEAD_MS } from './tokenExpiry.js';

const RETRY_MS = 30_000;
const MIN_GAP_MS = 60_000;
const LONGEST_WAIT_MS = 24 * 60 * 60 * 1000;

let timer = null;
let lastRenewedAt = 0;
let started = false;

function schedule() {
  clearTimeout(timer);
  timer = null;
  const expiresAt = sessionManager.getAccessExpiry();
  if (!sessionManager.hasSession() || !expiresAt) return;

  const now = Date.now();
  const wait = Math.max(0, expiresAt - REFRESH_LEAD_MS - now, lastRenewedAt + MIN_GAP_MS - now);
  timer = setTimeout(renew, Math.min(wait, LONGEST_WAIT_MS));
}

async function renew() {
  timer = null;
  const expiresAt = sessionManager.getAccessExpiry();
  if (!sessionManager.hasSession() || !expiresAt) return;

  if (expiresAt - Date.now() > REFRESH_LEAD_MS) {
    schedule();
    return;
  }

  try {
    await sessionManager.refresh();
  } catch {
    timer = setTimeout(renew, RETRY_MS);
    return;
  }
  lastRenewedAt = Date.now();
  schedule();
}

export function startRefreshAhead() {
  if (started) return;
  started = true;

  sessionManager.subscribe(schedule);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') schedule();
  });
  addEventListener('online', schedule);
  schedule();
}
