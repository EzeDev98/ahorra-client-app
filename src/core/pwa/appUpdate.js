import { useSyncExternalStore } from 'react';
import { queryClient } from '@core/data/queryClient.js';

export const CHECK_EVERY_MS = 3 * 60_000;
export const RUNNING_BUILD = typeof __APP_BUILD_ID__ === 'string' ? __APP_BUILD_ID__ : null;

const APPLIED_KEY = 'ahorra.applied.build';
const INSTALLED_KEY = 'ahorra.installed';
const KEPT_KEYS = [INSTALLED_KEY, 'ahorra.theme', 'ahorra.theme.pending'];

const readApplied = () => {
  try {
    return localStorage.getItem(APPLIED_KEY);
  } catch {
    return null;
  }
};
const writeApplied = (buildId) => {
  try {
    if (buildId) localStorage.setItem(APPLIED_KEY, buildId);
  } catch {
    
  }
};

let state = { latest: null }; 
const listeners = new Set();
const setState = (next) => {
  state = next;
  listeners.forEach((listener) => listener());
};

export const appUpdate = {
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => state,

  async check() {
    if (!import.meta.env.PROD || !RUNNING_BUILD) return;
    try {
      const response = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) return;
      const { buildId } = await response.json();
      if (typeof buildId !== 'string') return;
      if (buildId !== RUNNING_BUILD || buildId !== readApplied()) setState({ latest: buildId });
    } catch {
      
    }
  },

  start() {
    if (readApplied() === null && !navigator.serviceWorker?.controller) writeApplied(RUNNING_BUILD);
    appUpdate.check();
    setInterval(appUpdate.check, CHECK_EVERY_MS);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') appUpdate.check();
    });
  },

  async install() {
    const target = state.latest ?? RUNNING_BUILD;
    const attempt = async (step) => {
      try {
        await step();
      } catch {
        
      }
    };

    await attempt(async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    });
    await attempt(async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    });
    await attempt(async () => {
    
      const databases = (await indexedDB.databases?.()) ?? [];
      await Promise.all(
        databases
          .filter((database) => database.name)
          .map(
            (database) =>
              new Promise((resolve) => {
                const request = indexedDB.deleteDatabase(database.name);
                request.onsuccess = request.onerror = request.onblocked = () => resolve();
              }),
          ),
      );
    });
    await attempt(async () => sessionStorage.clear());
    await attempt(async () => {
      const kept = KEPT_KEYS.map((key) => [key, localStorage.getItem(key)]);
      localStorage.clear();
      kept.forEach(([key, value]) => {
        if (value !== null) localStorage.setItem(key, value);
      });
    });
    writeApplied(target);
    await attempt(async () => queryClient.clear());
    window.location.replace(`/?updated=${Date.now()}`);
  },
};

export const useAppUpdate = () => useSyncExternalStore(appUpdate.subscribe, appUpdate.getSnapshot);
