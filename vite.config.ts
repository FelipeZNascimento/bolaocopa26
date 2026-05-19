import basicSsl from '@vitejs/plugin-basic-ssl';
import vue from '@vitejs/plugin-vue';
import { execSync } from 'node:child_process';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import vueDevTools from 'vite-plugin-vue-devtools';

const appVersion = (() => {
  try {
    return execSync('git describe --tags --abbrev=0').toString().trim().replace(/^v/, '');
  } catch {
    return '0.0.0';
  }
})();

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/vue-router') ||
            id.includes('node_modules/pinia')
          ) {
            return 'vendor-vue';
          }
          if (
            id.includes('node_modules/primevue') ||
            id.includes('node_modules/@primeuix') ||
            id.includes('node_modules/@primevue')
          ) {
            return 'vendor-primevue';
          }
        },
      },
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  plugins: [
    vue(),
    basicSsl(),
    vueDevTools(),
    VitePWA({
      devOptions: { enabled: true },
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml'],
      manifest: {
        background_color: '#1b2f42',
        description: 'Um bolão para acompanhar a Copa do Mundo 2026 em tempo real!',
        display: 'standalone',
        icons: [
          {
            purpose: 'any',
            sizes: '192x192',
            src: 'android-chrome-192x192.png',
            type: 'image/png',
          },
          {
            purpose: 'any',
            sizes: '512x512',
            src: 'android-chrome-512x512.png',
            type: 'image/png',
          },
          {
            purpose: 'maskable',
            sizes: '512x512',
            src: 'maskable-icon-512x512.png',
            type: 'image/png',
          },
        ],
        id: '/',
        name: 'Bolao Copa 2026',
        short_name: 'BolaoCopa2026',
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
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    host: true,
    // host: '127.0.0.1',
    // host: 'localhost',
    port: 3000,
    proxy: {
      '/api': {
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        target: 'http://localhost:63768',
      },
      '/ws': {
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ws/, ''),
        target: 'ws://localhost:63768',
        ws: true,
      },
    },
  },
});
