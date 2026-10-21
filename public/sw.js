// Ahorra service worker. It exists for installability, fast launches and updates.
// It never caches server data: Ahorra is online-only.
//
// The two markers below are replaced at build time by vite-plugins/ahorraServiceWorker.js.
// Do not edit them. In `npm run dev` this file is not registered.
const BUILD_ID = '__BUILD_ID__';
const PRECACHE_URLS = ['__PRECACHE_URLS__'];

const CACHE_PREFIX = 'ahorra-shell-';
const CACHE_NAME = `${CACHE_PREFIX}${BUILD_ID}`;
const OFFLINE_URL = '/offline.html';
const precached = new Set(PRECACHE_URLS);

const fromShell = (path) => caches.open(CACHE_NAME).then((cache) => cache.match(path));

// Install: fetch the whole app shell fresh from the network. If any file fails, the install fails
// and the browser retries later, so a half-cached version never becomes active.
// The new worker then waits: nothing reloads under the person. It takes over the next time the app
// is closed and reopened, or at once when a page sends { type: 'SKIP_WAITING' }.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS.map((url) => new Request(url, { cache: 'reload' })))),
  );
});

// Activate: drop the caches of older builds.
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

  // Only same-origin GETs. The API, other origins and anything that changes data pass straight through.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Page loads always ask the network. Only if it is unreachable does the "needs a connection" page appear.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => fromShell(OFFLINE_URL).then((page) => page ?? Response.error())));
    return;
  }

  // App-shell files (hashed scripts and styles, fonts, icons): cache first, network if missing.
  if (precached.has(url.pathname)) {
    event.respondWith(fromShell(url.pathname).then((hit) => hit ?? fetch(request)));
  }
  // Everything else is not handled here, so the browser fetches it as usual.
});
