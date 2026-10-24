let locked = false;
const listeners = new Set();

function setLocked(next) {
  if (locked === next) return;
  locked = next;
  listeners.forEach((listener) => listener());
}

export const lockState = {
  isLocked: () => locked,
  subscribe(listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  lock: () => setLocked(true),
  unlock: () => setLocked(false),
};
