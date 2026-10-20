import { defineConfig } from 'vite';
import react from'@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

const src = (path) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));

export default defineConfig({
    plugins: [react()],
    server: {port: 2051, strictPort: true },
    preview: {port: 2051, strictPort: true },
    resolve: {
        alias: {
            '@': src(''),
            '@app': src('app'),
            '@core': src('core'),
            '@features': src('features'),
            '@shared': src('shared'),
        },
    },

});