import { useSyncExternalStore } from 'react';

const KEY = 'ahorra.reminder.nudge';
const listeners = new Set();

function read() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return 'done'; 
  }
}

function write(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Storage unavailable: the line simply stays away.
  }
  listeners.forEach((listener) => listener());
}

export const reminderNudge = {

  arm() {
    if (read() === null) write('armed');
  },

  dismiss() {
    write('done');
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot() {
    return read() === 'armed';
  },
};

export function useReminderNudgeArmed() {
  return useSyncExternalStore(reminderNudge.subscribe, reminderNudge.getSnapshot);
}
