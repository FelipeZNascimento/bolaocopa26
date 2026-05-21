<template>
  <div class="clock-area">
    <p
      v-if="title"
      class="countdown-label"
    >
      {{ t(title) }}
    </p>
    <div class="clock">
      <div class="clock-unit">
        <span
          class="clock-value"
          :class="{
            info: colorful && countdown.days > 3,
            warn: colorful && countdown.days > 1 && countdown.days <= 3,
            danger: colorful && countdown.days <= 1,
          }"
          >{{ pad(countdown.days) }}</span
        >
        <span class="clock-key">{{ t('home.nextMatchCountdown.days') }}</span>
      </div>
      <span class="clock-colon">:</span>
      <div class="clock-unit">
        <span class="clock-value">{{ pad(countdown.hours) }}</span>
        <span class="clock-key">{{ t('home.nextMatchCountdown.hours') }}</span>
      </div>
      <span class="clock-colon">:</span>
      <div class="clock-unit">
        <span class="clock-value">{{ pad(countdown.minutes) }}</span>
        <span class="clock-key">{{ t('home.nextMatchCountdown.minutes') }}</span>
      </div>
      <span class="clock-colon">:</span>
      <div class="clock-unit">
        <span class="clock-value">{{ pad(countdown.seconds) }}</span>
        <span class="clock-key">{{ t('home.nextMatchCountdown.seconds') }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { type TParsedCountdown, useClockStore } from '@/stores/clock';

const props = defineProps<{
  colorful?: boolean;
  countdownTo: number;
  title?: string;
}>();

// ------ Initialization ------
const { t } = useI18n();

// ------ Services & Stores ------
const clockStore = useClockStore();

// ------ Computed Properties ------
const countdown = computed<TParsedCountdown>(() => {
  return clockStore.getParsedCountdown(props.countdownTo);
});

function pad(n: number): string {
  return String(n).padStart(2, '0');
}
</script>
<style lang="scss" scoped>
.countdown-label {
  font-size: var(--xs-font-size);
  font-weight: 600;
  color: var(--bolao-c-grey3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

// ---- Clock area — grows to fill remaining space ----
.clock-area {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.clock {
  display: flex;
  gap: var(--s-spacing);
  align-items: flex-end;
}

.clock-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 52px;
}

.clock-value {
  font-size: var(--xl-font-size);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  color: var(--bolao-c-grey2);

  &.info {
    color: var(--bolao-c-grey2);
  }

  &.warn {
    color: var(--bolao-c-gold);
  }

  &.danger {
    color: var(--bolao-c-red-l1);
  }
}

.clock-key {
  margin-top: 4px;
  font-size: var(--xxs-font-size);
  color: var(--bolao-c-grey2);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.clock-colon {
  padding-bottom: 18px;
  font-size: 2rem;
  font-weight: 300;
  line-height: 1;
  color: var(--bolao-c-grey2);
}
</style>
