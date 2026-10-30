import { env } from '@core/config/env.js';
import { isStandIn } from '@core/http/standIn.js';
import { pushApi } from './api/pushApi.js';
import { reminderStore } from './reminderStore.js';

const STAND_IN_ENDPOINT = 'stand-in:this-device';

const READY_WAIT_MS = 4000;

const waitForWorker = () =>
  Promise.race([navigator.serviceWorker.ready, new Promise((resolve) => setTimeout(() => resolve(null), READY_WAIT_MS))]);

function keyToBytes(base64Url) {
  const padded = base64Url.padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), '=');
  const raw = atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

async function subscribeDevice() {
  const registration = await waitForWorker();
  if (env.vapidPublicKey && registration) {
    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyToBytes(env.vapidPublicKey) }));
    await pushApi.subscribe(subscription.toJSON());
  } else if (isStandIn('push')) {
    await pushApi.subscribe({ endpoint: STAND_IN_ENDPOINT, keys: {} });
  } else if (!env.vapidPublicKey) {
    throw new Error('Web push is not configured: VITE_VAPID_PUBLIC_KEY is empty.');
  } else {
    throw new Error('Web push needs the service worker, which does not run under npm run dev. Use npm run build && npm run preview.');
  }
}

let inFlight = null;

export function enablePush() {
  inFlight ??= (async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'denied') return 'blocked';
    if (permission !== 'granted') return 'dismissed';

    await subscribeDevice();
    await pushApi.setReminder(true);
    reminderStore.set(true);
    return 'on';
  })().finally(() => {
    inFlight = null;
  });
  return inFlight;
}

export async function restoreReminder() {
  const { enabled } = await pushApi.getReminder();
  if (!enabled) {
    reminderStore.set(false);
    return 'off';
  }
  if (Notification.permission === 'denied') {
    reminderStore.set(false);
    return 'blocked';
  }
  if (Notification.permission !== 'granted') {
    reminderStore.set(false);
    return 'needs-tap';
  }
  await subscribeDevice();
  reminderStore.set(true);
  return 'on';
}

export async function disablePush() {
  await pushApi.setReminder(false);
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration?.pushManager.getSubscription();
  await pushApi.unsubscribe(subscription?.endpoint ?? STAND_IN_ENDPOINT);
  await subscription?.unsubscribe();
  reminderStore.set(false);
}
