import { sessionManager } from '@features/auth/session/sessionManager.js';

const PREFIX = 'ahorra.setup.complete.';
const fallback = new Set(); 

function keyForCurrentUser() {
  const user = sessionManager.getUser();
  return user ? `${PREFIX}${user.userId ?? user.username}` : null;
}

export const setupStatus = {
  isComplete() {
    const key = keyForCurrentUser();
    if (!key) return false;
    if (fallback.has(key)) return true;
    try {
      return localStorage.getItem(key) === 'true';
    } catch {
      return false;
    }
  },

  markComplete() {
    const key = keyForCurrentUser();
    if (!key) return;
    fallback.add(key);
    try {
      localStorage.setItem(key, 'true');
    } catch {
      // Storage unavailable: setup counts as finished until this page closes.
    }
  },
};
