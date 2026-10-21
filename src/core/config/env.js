
const raw = import.meta.env.VITE_API_BASE_URL;

if (!raw) {
  throw new Error('VITE_API_BASE_URL is not set. Copy .env.example to .env and restart the dev server.');
}

new URL(raw);

export const env = Object.freeze({
  apiBaseUrl: raw.replace(/\/+$/, ''),
  skipInstallGuard: import.meta.env.DEV && import.meta.env.VITE_SKIP_INSTALL_GUARD === 'true',
});
