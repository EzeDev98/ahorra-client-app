
const SHELL_CACHE_PREFIX = 'ahorra-shell-';
async function removeWorkerAndCaches() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
  if (!('caches' in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.filter((key) => key.startsWith(SHELL_CACHE_PREFIX)).map((key) => caches.delete(key)));
}

async function register() {
  try {
    await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
  } catch (error) {
    console.warn('Service worker registration failed:', error);
  }
}

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  if (!import.meta.env.PROD) {
    removeWorkerAndCaches().catch(() => {});
    return;
  }

  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
