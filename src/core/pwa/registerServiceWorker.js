
// Same prefix as public/sw.js.
const SHELL_CACHE_PREFIX = 'ahorra-shell-';

// In development nothing may be served from a cache, so remove any worker (and its caches) left
// behind by a production preview on this same address.
async function removeWorkerAndCaches() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
  if (!('caches' in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.filter((key) => key.startsWith(SHELL_CACHE_PREFIX)).map((key) => caches.delete(key)));
}

async function register() {
  try {
    // updateViaCache: 'none' makes the browser fetch sw.js fresh, so a new build is noticed.
    await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
  } catch (error) {
    console.warn('Service worker registration failed:', error);
  }
}

// Production builds register the worker once the page has loaded, so it never competes with startup.
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  if (!import.meta.env.PROD) {
    removeWorkerAndCaches().catch(() => {});
    return;
  }

  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
