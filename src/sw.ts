import { ExpirationPlugin } from 'workbox-expiration';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
/// <reference lib="WebWorker" />
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Static resources (scripts, styles, workers)
registerRoute(
  ({ request }) =>
    request.destination === 'style' || request.destination === 'script' || request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 10 * 24 * 60 * 60, // 10 days
        maxEntries: 50,
      }),
    ],
  }),
);

// Images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
        maxEntries: 100,
      }),
    ],
  }),
);

// Push notification received from server
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json() as { body: string; title: string; url?: string };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      badge: '/android-chrome-192x192.png',
      body: data.body,
      data: { url: data.url ?? '/' },
      icon: '/android-chrome-192x192.png',
    }),
  );
});

// User clicked the notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = (event.notification.data as { url: string }).url;

  event.waitUntil(
    self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clientList) => {
      const existing = clientList.find((c) => c.url === url);
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    }),
  );
});
