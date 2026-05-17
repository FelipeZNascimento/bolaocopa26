<template>
  <div class="rules-widget">
    <div
      class="icon-wrapper"
      :class="`icon-wrapper--${scenario.key}`"
    >
      <i :class="scenario.icon" />
    </div>
    <div class="text-content">
      <p class="message">{{ t(scenario.messageKey) }}</p>
    </div>
    <RouterLink
      :to="activeProfile && activeProfile.isActive ? '/regras?section=pontuacao' : '/regras?section=inscricoes'"
    >
      <PrimeButton
        :label="activeProfile && activeProfile.isActive ? t('home.rules.ctaActive') : t('home.rules.ctaInactive')"
        icon="pi pi-arrow-right"
        icon-pos="right"
        size="small"
        class="cta-button"
      />
    </RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

import { useActiveProfileStore } from '@/stores/activeProfile';

const activeProfileStore = useActiveProfileStore();
const activeProfile = computed(() => activeProfileStore.activeProfile);
const { t } = useI18n();

const scenario = computed(() => {
  if (!activeProfile.value) {
    return { icon: 'pi pi-user', key: 'guest', messageKey: 'home.rules.messageGuest' };
  }
  if (!activeProfile.value.isActive) {
    return { icon: 'pi pi-clock', key: 'inactive', messageKey: 'home.rules.messageInactive' };
  }
  return { icon: 'pi pi-check', key: 'active', messageKey: 'home.rules.messageActive' };
});
</script>

<style lang="scss" scoped>
.rules-widget {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  align-items: center;
  padding: var(--s-spacing) 0;
  text-align: center;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  font-size: var(--l-font-size);
  border-radius: 50%;

  &--guest {
    color: var(--bolao-c-blue1);
    background-color: var(--bolao-c-blue1-t2);
  }

  &--inactive {
    color: var(--bolao-c-gold);
    background-color: var(--bolao-c-gold-t1);
  }

  &--active {
    color: var(--bolao-c-mint);
    background-color: color-mix(in srgb, var(--bolao-c-mint) 15%, transparent);
  }
}

.message {
  max-width: 280px;
  font-size: var(--s-font-size);
  line-height: 1.5;
  color: var(--bolao-c-grey2);
}

.cta-button {
  margin-top: var(--xs-spacing);
}
</style>
