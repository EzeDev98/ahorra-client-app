const raw = import.meta.env.VITE_API_BASE_URL;

if (!raw) {
  throw new Error('VITE_API_BASE_URL is not set. Copy .env.example to .env and restart the dev server.');
}

new URL(raw);

export const env = Object.freeze({
  
  apiBaseUrl: raw.replace(/\/+$/, ''),
  standIns: Object.freeze(
    (import.meta.env.VITE_STAND_INS ?? '').split(',').map((name) => name.trim()).filter(Boolean),
  ),
  vapidPublicKey: (import.meta.env.VITE_VAPID_PUBLIC_KEY ?? '').trim(),
  skipInstallGuard: import.meta.env.DEV && import.meta.env.VITE_SKIP_INSTALL_GUARD === 'true',
});
