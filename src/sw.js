/// <reference lib="WebWorker" />

self.addEventListener('push', (event) => {
  console.log('[SW] push event received', event.data?.text());

  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    console.error('[SW] push data is not valid JSON:', event.data.text());
    return;
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      badge: '/notification-badge.png',
      body: data.body,
      data: { url: data.url ?? '/' },
      icon: '/android-chrome-512x512.png',
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url ?? '/';

  event.waitUntil(
    self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then((clientList) => {
      const existing = clientList.find((c) => c.url === url);
      if (existing) return existing.focus();
      return self.clients.openWindow(url);
    }),
  );
});
