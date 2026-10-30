const KEY = 'ahorra.theme';
const MODES = ['system', 'light', 'dark'];

const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());

function read() {
  try {
    const saved = localStorage.getItem(KEY);
    return MODES.includes(saved) ? saved : 'system';
  } catch {
    return 'system';
  }
}

let mode = read();

function apply() {
  const root = document.documentElement;
  if (mode === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', mode);
}

export const themeStore = {
  get: () => mode,

  set(next) {
    if (!MODES.includes(next) || next === mode) return;
    mode = next;
    try {
      if (mode === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, mode);
    } catch {
      // Storage unavailable: the choice lasts until this page closes.
    }
    apply();
    notify();
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

let started = false;

export function startTheme() {
  if (started) return;
  started = true;
  apply();
  addEventListener('storage', (event) => {
    if (event.key !== KEY) return;
    mode = read();
    apply();
    notify();
  });
}
