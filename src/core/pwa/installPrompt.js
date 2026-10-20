// Captures install events from the moment the app starts. Chrome and Edge fire `beforeinstallprompt`
// once, early; if nothing is listening yet, the chance to offer the install is lost. So this file is the
// first import in main.jsx, long before any screen mounts.
//
// The Install screen (Step 4g) reads this state. It is also mirrored on window.__ahorraInstall for debugging.
import { markInstalled } from './isPWAInstalled.js';

let state = { prompt: null, installed: false };
const listeners = new Set();

function update(next) {
  state = { ...state, ...next };
  window.__ahorraInstall = state;
  listeners.forEach((listener) => listener());
}

window.__ahorraInstall = state;

window.addEventListener('beforeinstallprompt', (event) => {
  // Keep the event for our own Install screen and stop the browser's own mini-prompt.
  event.preventDefault();
  update({ prompt: event });
});

window.addEventListener('appinstalled', () => {
  markInstalled(); // the browser has just installed the app: this page now counts as installed
  update({ prompt: null, installed: true });
});

// { prompt: BeforeInstallPromptEvent | null, installed: boolean }. A new object on every change.
export const getInstallState = () => state;

// For useSyncExternalStore(subscribeInstall, getInstallState). Returns the unsubscribe function.
export function subscribeInstall(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// The browser allows one use of a captured prompt. Call this after prompt() has been shown.
export const clearInstallPrompt = () => update({ prompt: null });
