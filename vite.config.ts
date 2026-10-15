import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA({
    registerType: 'prompt', injectRegister: false, includeAssets: ['icons/*.png', 'icons/favicon.svg'],
    manifest: { name: 'Ariano Suassuna e o Sertão — FLIC 2026', short_name: 'FLIC 2026', lang: 'pt-BR', start_url: '/', scope: '/', display: 'standalone', background_color: '#F7F1E6', theme_color: '#F7F1E6', icons: [{ src: '/icons/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' }, { src: '/icons/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }] },
    workbox: { globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,json}'], maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, navigateFallback: '/index.html', navigateFallbackDenylist: [/^\/api(?:\/|$)/], cleanupOutdatedCaches: true },
  })], test: { include: ['src/**/*.test.ts'], environment: 'node' },
});