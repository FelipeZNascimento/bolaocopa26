import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        background_color: '#1b2f42',
        description: 'Um bolão para acompanhar a temporada completa da NFL em tempo real!',
        display: 'standalone',
        icons: [
          {
            sizes: '192x192',
            src: '192x192.png',
            type: 'image/png',
          },
          {
            sizes: '512x512',
            src: '512x512.png',
            type: 'image/png',
          },
        ],
        name: 'BolaoNFL',
        short_name: 'BolaoNFL',
        start_url: '/',
        theme_color: '#1b2f42',
      },
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        runtimeCaching: [
          {
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxAgeSeconds: 10 * 24 * 60 * 60, // 10 days
                maxEntries: 50,
              },
            },
            urlPattern: ({ request }) =>
              request.destination === 'style' || request.destination === 'script' || request.destination === 'worker',
          },
          {
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
                maxEntries: 100,
              },
            },
            urlPattern: ({ request }) => request.destination === 'image',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // host: '127.0.0.1',
    // host: 'localhost',
    port: 3000,
  },
});
