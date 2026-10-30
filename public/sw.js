
const BUILD_ID = '__BUILD_ID__';
const PRECACHE_URLS = ['__PRECACHE_URLS__'];

const CACHE_PREFIX = 'ahorra-shell-';
const CACHE_NAME = `${CACHE_PREFIX}${BUILD_ID}`;
const OFFLINE_URL = '/offline.html';
const precached = new Set(PRECACHE_URLS);

const fromShell = (path) => caches.open(CACHE_NAME).then((cache) => cache.match(path));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: 'reload' })))),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => fromShell(OFFLINE_URL).then((page) => page ?? Response.error())));
    return;
  }

  if (precached.has(url.pathname)) {
    event.respondWith(fromShell(url.pathname).then((hit) => hit ?? fetch(request)));
  }
});

const NUDGE_TITLE = 'Ahorra';
const NUDGE_BODY = 'Entries are waiting for you. Confirm them before the day closes.';

self.addEventListener('push', (event) => {
  let message = {};
  try {
    message = event.data ? event.data.json() : {};
  } catch {
    // Not JSON: use the default words.
  }
  event.waitUntil(
    self.registration.showNotification(message.title || NUDGE_TITLE, {
      body: message.body || NUDGE_BODY,
      icon: '/icons/icon-192.png',
      tag: 'ahorra-daily',
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((client) => 'focus' in client);
      return open ? open.focus() : self.clients.openWindow('/');
    }),
  );
});

