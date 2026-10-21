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
  event.preventDefault();
  update({ prompt: event });
});

window.addEventListener('appinstalled', () => {
  markInstalled(); 
  update({ prompt: null, installed: true });
});

export const getInstallState = () => state;

export function subscribeInstall(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const clearInstallPrompt = () => update({ prompt: null });
