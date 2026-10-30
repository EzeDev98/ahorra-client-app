import { sessionManager } from '@features/auth/session/sessionManager.js';
import { appearanceApi } from './appearanceApi.js';
import { themeStore } from './themeStore.js';

const PENDING_KEY = 'ahorra.theme.pending';

const pending = {
  is() {
    try {
      return localStorage.getItem(PENDING_KEY) === 'yes';
    } catch {
      return false;
    }
  },
  set(on) {
    try {
      if (on) localStorage.setItem(PENDING_KEY, 'yes');
      else localStorage.removeItem(PENDING_KEY);
    } catch {
      // Storage unavailable: the choice is simply not retried later.
    }
  },
};

function paintBrowserBar() {
  const style = getComputedStyle(document.documentElement);
  const colors = { light: style.getPropertyValue('--p-bg-light').trim(), dark: style.getPropertyValue('--p-bg-dark').trim() };
  if (!colors.light || !colors.dark) return;
  const mode = themeStore.get();
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    const own = meta.media.includes('dark') ? 'dark' : 'light';
    meta.content = colors[mode === 'system' ? own : mode];
  });
}

async function pushLocal() {
  await appearanceApi.set(themeStore.get().toUpperCase());
  pending.set(false);
}

async function sync() {
  if (pending.is()) return pushLocal();
  const { theme } = await appearanceApi.get();
  if (pending.is()) return pushLocal();
  if (theme) themeStore.set(theme.toLowerCase());
  else if (themeStore.get() !== 'system') await pushLocal(); 
  return undefined;
}

let inflight = null;

export function confirmTheme() {
  if (!sessionManager.hasSession()) return Promise.resolve();
  inflight ??= sync()
    .catch(() => {})
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function chooseTheme(next) {
  themeStore.set(next);
  pending.set(true);
  if (sessionManager.hasSession()) pushLocal().catch(() => {});
}

export function startThemeSync() {
  paintBrowserBar();
  themeStore.subscribe(paintBrowserBar);

  let wasSignedIn = sessionManager.hasSession();
  if (wasSignedIn) confirmTheme();
  sessionManager.subscribe(() => {
    const signedIn = sessionManager.hasSession();
    if (signedIn && !wasSignedIn) confirmTheme();
    wasSignedIn = signedIn;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') confirmTheme();
  });
}
