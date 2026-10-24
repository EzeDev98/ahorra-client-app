
import { sessionManager } from '@features/auth/session/sessionManager.js';

export const PIN_LENGTH = 6;

const PREFIX = 'ahorra.lock.pin.';
const ITERATIONS = 310_000; 
const SALT_BYTES = 16;
const HASH_BITS = 256;

const ATTEMPTS_PER_ROUND = 5;
const FIRST_WAIT_MS = 30_000;
const LONGEST_WAIT_MS = 15 * 60_000;
const PIN_PATTERN = new RegExp(`^\\d{${PIN_LENGTH}}$`);

const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());

addEventListener('storage', (event) => {
  if (event.key === null || event.key.startsWith(PREFIX)) notify();
});

function keyForCurrentUser() {
  const user = sessionManager.getUser();
  return user ? `${PREFIX}${user.userId ?? user.username}` : null;
}

const remoteKey = (key) => `${key}.remote`;
const remembersRemote = (key) => {
  try {
    return Boolean(key) && localStorage.getItem(remoteKey(key)) === '1';
  } catch {
    return false;
  }
};

function readRecord(key) {
  if (!key) return null;
  try {
    const record = JSON.parse(localStorage.getItem(key));
    const valid =
      record &&
      record.v === 1 &&
      Number.isInteger(record.iterations) &&
      Number.isInteger(record.length) &&
      typeof record.salt === 'string' &&
      typeof record.hash === 'string';
    return valid ? record : null;
  } catch {
    return null;
  }
}

const toBase64 = (bytes) => btoa(String.fromCharCode(...bytes));
const fromBase64 = (text) => Uint8Array.from(atob(text), (char) => char.charCodeAt(0));

async function derive(pin, salt, iterations) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, material, HASH_BITS);
  return new Uint8Array(bits);
}

function sameBytes(a, b) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

function writeRecord(key, record) {
  try {
    localStorage.setItem(key, JSON.stringify(record));
  } catch {
    // Not remembered.
  }
}

const waitAfter = (failures) => Math.min(FIRST_WAIT_MS * 2 ** (failures / ATTEMPTS_PER_ROUND - 1), LONGEST_WAIT_MS);

function attemptState(record) {
  const failures = record?.failures ?? 0;
  const lockedUntil = record?.lockedUntil > Date.now() ? record.lockedUntil : null;
  return { attemptsLeft: ATTEMPTS_PER_ROUND - (failures % ATTEMPTS_PER_ROUND), lockedUntil };
}

const isSupported = () => Boolean(globalThis.crypto?.subtle);

export const pinStore = {

  isSupported,

  has: () => readRecord(keyForCurrentUser()) !== null || remembersRemote(keyForCurrentUser()),

  hasLocal: () => readRecord(keyForCurrentUser()) !== null,

  markRemote(isSet) {
    const key = keyForCurrentUser();
    if (!key) return;
    try {
      if (isSet) localStorage.setItem(remoteKey(key), '1');
      else localStorage.removeItem(remoteKey(key));
    } catch {
      // Storage unavailable: not remembered.
    }
    notify();
  },

  getLength: () => readRecord(keyForCurrentUser())?.length ?? null,

  async set(pin) {
    const key = keyForCurrentUser();
    if (!key) throw new Error('Sign in before setting a PIN.');
    if (!PIN_PATTERN.test(pin)) throw new Error(`A PIN is ${PIN_LENGTH} digits.`);
    if (!isSupported()) throw new Error('A PIN cannot be set in this browser context.');

    const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
    const hash = await derive(pin, salt, ITERATIONS);
    const record = { v: 1, algorithm: 'PBKDF2-SHA256', iterations: ITERATIONS, length: PIN_LENGTH, salt: toBase64(salt), hash: toBase64(hash), failures: 0, lockedUntil: 0 };
    try {
      localStorage.setItem(key, JSON.stringify(record));
    } catch {
      throw new Error('Could not save the PIN on this device.');
    }
    notify();
  },

  async verify(pin) {
    const key = keyForCurrentUser();
    const record = readRecord(key);
    const state = attemptState(record);
    if (!record || !isSupported() || state.lockedUntil) return { ok: false, ...state };
    if (typeof pin !== 'string' || pin.length !== record.length) return { ok: false, ...state };

    const hash = await derive(pin, fromBase64(record.salt), record.iterations);
    if (sameBytes(hash, fromBase64(record.hash))) {
      if (record.failures) writeRecord(key, { ...record, failures: 0, lockedUntil: 0 });
      return { ok: true, attemptsLeft: ATTEMPTS_PER_ROUND, lockedUntil: null };
    }

    const failures = (record.failures ?? 0) + 1;
    const next = { ...record, failures, lockedUntil: failures % ATTEMPTS_PER_ROUND === 0 ? Date.now() + waitAfter(failures) : 0 };
    writeRecord(key, next);
    return { ok: false, ...attemptState(next) };
  },

  getAttempts: () => attemptState(readRecord(keyForCurrentUser())),

  remove() {
    const key = keyForCurrentUser();
    if (!key) return;
    try {
      localStorage.removeItem(key);
      localStorage.removeItem(remoteKey(key));
    } catch {
      // Storage unavailable: nothing to remove.
    }
    notify();
  },

  subscribe(listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
