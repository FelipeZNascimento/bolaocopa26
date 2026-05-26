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
export default defineConfig(({ command }) => ({
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
    ...(command === 'build' ? [basicSsl()] : []),
    vueDevTools(),
    VitePWA({
      devOptions: { enabled: true, type: 'module' },
      filename: 'sw.js',
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml'],
      injectManifest: { injectionPoint: undefined },
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
        short_name: 'Bolao 2026',
        start_url: '/',
        theme_color: '#1b2f42',
      },
      srcDir: 'src',
      strategies: 'injectManifest',
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
    },
  },
}));
