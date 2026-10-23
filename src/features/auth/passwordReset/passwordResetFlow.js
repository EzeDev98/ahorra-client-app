const KEY = 'ahorra.passwordReset';

export const RESEND_COOLDOWN_MS = 60_000;

let memory = null; 
let resetToken = null;

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
    // Storage unavailable: it lasts until this page closes.
  }
}

export const passwordResetFlow = {

  get: () => readStored() ?? memory,

  begin({ email, resendAvailableAt }) {
    resetToken = null;
    write({ email, resendAvailableAt });
  },

  update(changes) {
    const current = this.get();
    if (current) write({ ...current, ...changes });
  },

  getResetToken: () => resetToken,
  setResetToken(token) {
    resetToken = token;
  },
  clearResetToken() {
    resetToken = null;
  },

  clear() {
    memory = null;
    resetToken = null;
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      // Storage unavailable: nothing to remove.
    }
  },
};
