import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { ahorraServiceWorker, makeBuildId, nextVersion } from './vite-plugins/ahorraServiceWorker.js';

const src = (path) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

const BUILD_ID = makeBuildId(process.cwd());

export default defineConfig(async ({ command }) => {
  const VERSION = command === 'build' ? await nextVersion() : '0.0.0';

  return {
    plugins: [react(), ahorraServiceWorker(BUILD_ID, VERSION)],
    define: { __APP_BUILD_ID__: JSON.stringify(BUILD_ID), __APP_VERSION__: JSON.stringify(VERSION) },
    server: { port: 2051, strictPort: true },
    preview: { port: 2051, strictPort: true },
    resolve: {
      alias: {
        '@': src(''),
        '@app': src('app'),
        '@core': src('core'),
        '@features': src('features'),
        '@shared': src('shared'),
      },
    },
  };
});
