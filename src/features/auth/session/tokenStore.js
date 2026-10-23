const KEY = 'ahorra.session';

let cache; 

function read() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY));
    return parsed && typeof parsed.accessToken === 'string' && typeof parsed.refreshToken === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export const tokenStore = {
  get() {
    if (cache === undefined) cache = read();
    return cache;
  },

  reload() {
    cache = undefined;
    return this.get();
  },

  set(session) {
    cache = session;
    try {
      localStorage.setItem(KEY, JSON.stringify(session));
    } catch {
      // Storage unavailable: the session lasts until this page closes.
    }
  },

  clear() {
    cache = null;
    try {
      localStorage.removeItem(KEY);
    } catch {
      // Storage unavailable: nothing to remove.
    }
  },

  onExternalChange(listener) {
    const handler = (event) => {
      if (event.key !== KEY && event.key !== null) return;
      cache = undefined;
      listener();
    };
    addEventListener('storage', handler);
    return () => removeEventListener('storage', handler);
  },
};
