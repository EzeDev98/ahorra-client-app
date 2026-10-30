const KEY = 'ahorra.reminder';

export const reminderStore = {
  isOn() {
    try {
      return localStorage.getItem(KEY) === 'on';
    } catch {
      return false;
    }
  },

  set(on) {
    try {
      if (on) localStorage.setItem(KEY, 'on');
      else localStorage.removeItem(KEY);
    } catch {
      // Storage unavailable: the reminder simply shows as off next time.
    }
  },
};
