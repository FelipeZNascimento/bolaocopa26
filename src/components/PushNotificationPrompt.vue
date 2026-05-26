<template>
  <div
    v-if="isVisible"
    class="push-prompt"
  >
    <i class="pi pi-bell push-prompt__icon" />
    <div class="push-prompt__content">
      <span class="push-prompt__title">{{ t('pushNotifications.prompt.title') }}</span>
      <span class="push-prompt__body">{{ t('pushNotifications.prompt.body') }}</span>
    </div>
    <div class="push-prompt__actions">
      <PrimeButton
        :label="t('pushNotifications.prompt.enable')"
        :loading="isLoading"
        icon="pi pi-check"
        size="small"
        @click="onEnable"
      />
      <PrimeButton
        :label="t('pushNotifications.prompt.dismiss')"
        severity="secondary"
        size="small"
        variant="text"
        @click="onDismiss"
      />
    </div>
    <small
      v-if="subscribeError"
      class="push-prompt__error"
      >{{ subscribeError }}</small
    >
  </div>

  <div
    v-else-if="isBlocked"
    class="push-prompt push-prompt--blocked"
  >
    <i class="pi pi-bell-slash push-prompt__icon" />
    <span class="push-prompt__body">{{ t('pushNotifications.blocked') }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import ApiService from '@/services/api_request';
import { subscribeToPush } from '@/services/pushNotification';

const { t } = useI18n();

const isLoading = ref(false);
const isDismissed = ref(false);

const permission = ref<NotificationPermission>('Notification' in window ? Notification.permission : 'denied');

const isBlocked = computed(() => permission.value === 'denied');
const isVisible = computed(() => !isDismissed.value && permission.value === 'default' && 'PushManager' in window);

const apiService = new ApiService();

const subscribeError = ref<null | string>(null);

function onDismiss() {
  isDismissed.value = true;
}

async function onEnable() {
  isLoading.value = true;
  subscribeError.value = null;
  try {
    const result = await Notification.requestPermission();
    permission.value = result;

    if (result !== 'granted') {
      isDismissed.value = true;
      return;
    }

    const subscription = await subscribeToPush();
    if (subscription) {
      await apiService.post('user/push/subscribe', subscription.toJSON());
    }
    isDismissed.value = true;
  } catch (err) {
    console.error('[PushNotifications] subscribe failed:', err);
    subscribeError.value = err instanceof Error ? err.message : String(err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.push-prompt {
  display: flex;
  gap: var(--m-spacing);
  align-items: center;
  padding: var(--m-spacing);
  background-color: var(--p-surface-100);
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);

  &--blocked {
    opacity: 0.6;
  }

  &__icon {
    flex-shrink: 0;
    font-size: var(--xl-font-size);
  }

  &__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
  }

  &__title {
    font-weight: bold;
  }

  &__body {
    font-size: var(--s-font-size);
    color: var(--p-text-muted-color);
  }

  &__actions {
    display: flex;
    flex-shrink: 0;
    gap: var(--s-spacing);
  }

  &__error {
    font-size: var(--s-font-size);
    color: var(--p-red-500);
  }
}
</style>
