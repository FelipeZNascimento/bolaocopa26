import { defineStore } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

import type { INotification, TNotificationSeverity } from './notification.types';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<INotification[]>([]);
  const toast = useToast();

  function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  function addNotification(severity: TNotificationSeverity, detail: string, summary?: string, life: number = 3000) {
    const notification: INotification = {
      detail,
      id: generateId(),
      life,
      severity,
      summary: summary || getSummaryBySeverity(severity),
    };

    notifications.value.push(notification);

    // Show toast notification
    toast.add({
      detail: notification.detail,
      life: notification.life,
      severity: notification.severity,
      summary: notification.summary,
    });

    // Auto-remove from queue after life duration
    setTimeout(() => {
      removeNotification(notification.id);
    }, life);
  }

  function getSummaryBySeverity(severity: TNotificationSeverity): string {
    switch (severity) {
      case 'error':
        return 'Error';
      case 'info':
        return 'Info';
      case 'success':
        return 'Success';
      default:
        return 'Notification';
    }
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  }

  function error(detail: string, summary?: string, life?: number) {
    addNotification('error', detail, summary, life);
  }

  function message(detail: string, summary?: string, life?: number) {
    addNotification('info', detail, summary, life);
  }

  function success(detail: string, summary?: string, life?: number) {
    addNotification('success', detail, summary, life);
  }

  function clearAll() {
    notifications.value = [];
    toast.removeAllGroups();
  }

  return {
    clearAll,
    error,
    message,
    notifications,
    success,
  };
});
