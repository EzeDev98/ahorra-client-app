import { ApiError } from '@core/http/httpClient.js';
import { sessionManager } from '@features/auth/session/sessionManager.js';
import { isOnline } from '@shared/hooks/useNetwork.js';
import { pinApi } from './api/pinApi.js';
import { UNLOCK } from './lockContent.js';
import { pinStore } from './pinStore.js';

const MAX_ATTEMPTS = 5; 
const SYNC_WAIT_MS = 3000; 
const FORGOT_KEY = 'ahorra.lock.forgot'; 
const ACCEPTED = { ok: true, attemptsLeft: MAX_ATTEMPTS, lockedUntil: null };

const tooSlow = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error('Too slow')), ms));
const unreachable = (error) => error instanceof ApiError && (error.isNetwork || error.status >= 500);

function refusal(error) {
  if (!(error instanceof ApiError)) return null;
  const retry = error.body?.retryAfterSeconds;
  if (error.isRateLimited && Number.isFinite(retry)) return { ok: false, attemptsLeft: 0, lockedUntil: Date.now() + retry * 1000 };
  const left = error.body?.attemptsRemaining;
  if (error.status === 400 && Number.isInteger(left)) return { ok: false, attemptsLeft: left, lockedUntil: null };
  return null;
}

const requireConnection = () => {
  if (!isOnline()) throw new Error(UNLOCK.needsConnection);
};

async function keepOnDevice(pin) {
  try {
    await pinStore.set(pin);
  } catch {
    // Not stored on this device.
  }
  pinStore.markRemote(true);
}

const forgotOwner = () => {
  const user = sessionManager.getUser();
  return user ? String(user.userId ?? user.username) : null;
};

function clearForgot() {
  try {
    localStorage.removeItem(FORGOT_KEY);
  } catch {
    // Nothing to clear.
  }
}

export const pinService = {

  async verify(pin) {
    if (isOnline()) {
      try {
        await pinApi.verify(pin);
        await keepOnDevice(pin);
        return ACCEPTED;
      } catch (error) {
        const refused = refusal(error);
        if (refused) return refused;
       
        if (error instanceof ApiError && error.status === 400 && /no pin is set/i.test(error.message)) {
          pinStore.remove();
          return ACCEPTED;
        }
        if (!unreachable(error)) throw error;
      }
    }
    if (pinStore.hasLocal()) return pinStore.verify(pin);
    throw new Error(UNLOCK.needsConnection);
  },

  async set(pin) {
    requireConnection();
    await pinApi.set(pin);
    await keepOnDevice(pin);
  },

  async change(oldPin, pin) {
    requireConnection();
    await pinApi.change(oldPin, pin);
    await keepOnDevice(pin);
  },

  async remove(pin) {
    requireConnection();
    try {
      await pinApi.remove(pin);
    } catch (error) {
      const refused = refusal(error);
      if (refused) return refused;
      throw error;
    }
    pinStore.remove();
    clearForgot();
    return ACCEPTED;
  },

  async reset(pin) {
    requireConnection();
    await pinApi.reset(pin);
    clearForgot();
    await keepOnDevice(pin);
  },

  forgot() {
    const owner = forgotOwner();
    if (owner) {
      try {
        localStorage.setItem(FORGOT_KEY, owner);
      } catch {
        // Not remembered: the person meets Unlock again and can start over.
      }
    }
    pinStore.remove();
  },

  resetPending() {
    try {
      const owner = forgotOwner();
      return owner !== null && localStorage.getItem(FORGOT_KEY) === owner;
    } catch {
      return false;
    }
  },

  clearForgot,

  async sync() {
    if (!sessionManager.hasSession() || !isOnline()) return;
    try {
      const status = await Promise.race([pinApi.status(), tooSlow(SYNC_WAIT_MS)]);
      if (status?.pinSet) {
        pinStore.markRemote(true);
      } else {
        pinStore.remove();
        clearForgot();
      }
    } catch {
      // Keep what this device already knows.
    }
  },

  async hasServerPin() {
    if (!sessionManager.hasSession() || !isOnline()) return null;
    try {
      const status = await Promise.race([pinApi.status(), tooSlow(SYNC_WAIT_MS)]);
      return Boolean(status?.pinSet);
    } catch {
      return null;
    }
  },
};
