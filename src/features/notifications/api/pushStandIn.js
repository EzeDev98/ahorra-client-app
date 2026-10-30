const KEY = 'ahorra.standin.push';
const REMINDER_KEY = 'ahorra.standin.reminder';

export const pushStandIn = {
  subscribe: async ({ endpoint, keys }) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ endpoint, keys }));
    } catch {
      // Storage unavailable: nothing to keep.
    }
  },

  getReminder: async () => {
    try {
      return { enabled: localStorage.getItem(REMINDER_KEY) === 'on' };
    } catch {
      return { enabled: false };
    }
  },

  setReminder: async (enabled) => {
    try {
      if (enabled) localStorage.setItem(REMINDER_KEY, 'on');
      else localStorage.removeItem(REMINDER_KEY);
    } catch {
      // Storage unavailable: nothing to keep.
    }
  },

  unsubscribe: async () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // Storage unavailable: nothing to remove.
    }
  },
};
