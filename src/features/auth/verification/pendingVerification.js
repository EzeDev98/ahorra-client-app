const KEY = 'ahorra.pendingVerification';

export const RESEND_COOLDOWN_MS = 60_000;

let memory = null; 

function readStored() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(KEY));
    return parsed && typeof parsed.email === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

function write(value) {
  memory = value;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
   
  }
}

export const pendingVerification = {

  get: () => readStored() ?? memory,

  set: ({ email, username, resendAvailableAt }) => write({ email, username, resendAvailableAt }),

  update(changes) {
    const current = this.get();
    if (current) write({ ...current, ...changes });
  },

  clear() {
    memory = null;
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      
    }
  },
};
