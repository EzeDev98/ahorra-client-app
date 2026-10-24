import { sessionManager } from '@features/auth/session/sessionManager.js';
import { lockState } from './lockState.js';
import { pinStore } from './pinStore.js';

export const AWAY_LOCK_MS = 0;
export const IDLE_LOCK_MS = 5 * 60_000; 

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'];

const lockIfOn = () => {
  if (sessionManager.hasSession() && pinStore.has()) lockState.lock();
};

let started = false;

export function startAutoLock() {
  if (started) return;
  started = true;

  lockIfOn();

  sessionManager.subscribe(() => {
    if (!sessionManager.hasSession()) lockState.unlock();
  });

  let leftAt = null;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      leftAt = Date.now();
      if (AWAY_LOCK_MS === 0) lockIfOn();
      return;
    }
    const away = leftAt === null ? 0 : Date.now() - leftAt;
    leftAt = null;
    if (away >= AWAY_LOCK_MS) lockIfOn();
  });

  let idleTimer = null;
  const restartIdleTimer = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(lockIfOn, IDLE_LOCK_MS);
  };
  ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, restartIdleTimer, { capture: true, passive: true }));
  restartIdleTimer();
}
