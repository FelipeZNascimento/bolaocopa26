import { ref } from 'vue';

import { subscribeToPush, unsubscribeFromPush } from '@/services/pushNotification';

export function usePushNotifications() {
  const permission = ref<NotificationPermission>('Notification' in window ? Notification.permission : 'denied');
  const isSubscribed = ref(false);

  async function checkSubscription() {
    if (!('serviceWorker' in navigator)) return;
    const registration = await navigator.serviceWorker.ready;
    const existing = await registration.pushManager.getSubscription();
    isSubscribed.value = !!existing;
  }

  // Call this on a user gesture (button click)
  async function requestAndSubscribe(
    onSubscribe: (subscription: PushSubscription) => Promise<void>,
  ): Promise<'denied' | 'subscribed' | 'unsupported'> {
    if (!('Notification' in window) || !('PushManager' in window)) return 'unsupported';

    const result = await Notification.requestPermission();
    permission.value = result;

    if (result !== 'granted') return 'denied';

    const subscription = await subscribeToPush();
    if (!subscription) return 'unsupported';

    await onSubscribe(subscription);
    isSubscribed.value = true;
    return 'subscribed';
  }

  async function unsubscribe() {
    await unsubscribeFromPush();
    isSubscribed.value = false;
  }

  checkSubscription();

  return { isSubscribed, permission, requestAndSubscribe, unsubscribe };
}
