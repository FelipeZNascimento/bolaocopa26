<template>
  <div
    v-if="isBlocked"
    class="push-widget push-widget--blocked"
  >
    <i class="pi pi-bell-slash push-widget__icon" />
    <span class="push-widget__body">{{ t('pushNotifications.blocked') }}</span>
  </div>

  <div
    v-else
    class="push-widget"
  >
    <div class="push-widget__header">
      <i class="pi pi-bell push-widget__icon" />
      <div class="push-widget__text">
        <span class="push-widget__title">{{ t('pushNotifications.prompt.title') }}</span>
        <span class="push-widget__body">{{ t('pushNotifications.prompt.body') }}</span>
      </div>
    </div>
    <small
      v-if="subscribeError"
      class="push-widget__error"
      >{{ subscribeError }}</small
    >
    <div class="push-widget__actions">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import ApiService from '@/services/api_request';
import { subscribeToPush } from '@/services/pushNotification';

const emit = defineEmits<{ done: [] }>();

const { t } = useI18n();

const isLoading = ref(false);
const permission = ref<NotificationPermission>('Notification' in window ? Notification.permission : 'denied');
const subscribeError = ref<null | string>(null);

const isBlocked = ref(permission.value === 'denied');

onMounted(() => {
  if (permission.value === 'granted') emit('done');
});

const apiService = new ApiService();

function onDismiss() {
  emit('done');
}

async function onEnable() {
  isLoading.value = true;
  subscribeError.value = null;
  try {
    const result = await Notification.requestPermission();
    permission.value = result;
    isBlocked.value = result === 'denied';

    if (result !== 'granted') {
      emit('done');
      return;
    }

    const subscription = await subscribeToPush();
    if (subscription) {
      await apiService.post('user/push/subscribe', subscription.toJSON());
    }
    emit('done');
  } catch (err) {
    console.error('[PushNotifications] subscribe failed:', err);
    subscribeError.value = err instanceof Error ? err.message : String(err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.push-widget {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  height: 100%;
  padding: var(--m-spacing);

  &--blocked {
    flex-direction: row;
    align-items: center;
    opacity: 0.6;
  }

  &__header {
    display: flex;
    gap: var(--m-spacing);
    align-items: flex-start;
  }

  &__icon {
    flex-shrink: 0;
    font-size: var(--xl-font-size);
    color: var(--bolao-c-gold);
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    font-size: var(--s-font-size);
    font-weight: 700;
    color: var(--bolao-c-white);
  }

  &__body {
    font-size: var(--xs-font-size);
    color: var(--bolao-c-grey2);
  }

  &__actions {
    display: flex;
    flex-shrink: 0;
    gap: var(--s-spacing);
    align-items: center;
  }

  &__error {
    font-size: var(--xs-font-size);
    color: var(--p-red-400);
  }
}
</style>
