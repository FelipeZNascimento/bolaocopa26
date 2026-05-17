<template>
  <div header="Informações">
    <Transition name="expand">
      <div
        v-show="showMatchInfo"
        class="outer"
      >
        <div class="match-info">
          <div class="info-section">
            <h3><i class="pi pi-building" /> Estádio</h3>
            <p class="info-title">
              {{ match.stadium.name }}
            </p>
            <p class="info-detail">{{ match.stadium.city }}, {{ match.stadium.country }}</p>
            <p class="info-detail">
              {{ t('matches.capacity', { capacity: match.stadium.capacity.toLocaleString('pt-BR') }) }}
            </p>
          </div>

          <div class="info-section">
            <h3><i class="pi pi-user" /> {{ t('matches.referee') }}</h3>
            <p class="info-title">
              {{ match.referee.name }}
            </p>
            <p class="info-detail">
              {{ match.referee.country }}
            </p>
          </div>

          <div class="info-section">
            <h3><i class="pi pi-calendar" /> {{ t('matches.dateAndTime') }}</h3>
            <p class="info-title">
              {{ clockStore.getFormattedDate(parseInt(match.timestamp, 10)) }}
            </p>
            <p class="info-detail">
              {{ clockStore.getFormattedTime(parseInt(match.timestamp, 10)) }}
            </p>
            <p
              v-if="countdown"
              class="countdown"
            >
              <i class="pi pi-clock" />
              {{ t('matches.countdown', { countdown }) }}
            </p>
          </div>

          <div class="info-section">
            <h3><i class="pi pi-flag" /> {{ t('matches.round') }}</h3>
            <p class="info-title">
              {{ clockStore.getRoundName(match.round) }}
            </p>
            <p class="info-title">{{ match.group ? `${t('matches.group', { group: match.group })}` : '' }}</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IMatch } from '@/stores/matches.types';

import { useClockStore } from '@/stores/clock';

const props = defineProps<{
  match: IMatch;
  showMatchInfo: boolean;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
const { t } = useI18n();

// ------ Computed Properties ------
const countdown = computed(() => {
  return clockStore.getCountdown(parseInt(props.match.timestamp, 10));
});
</script>
<style lang="scss" scoped>
.outer {
  padding: 0 var(--l-spacing);
  overflow: hidden;
}

.match-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--l-spacing);
  padding: var(--l-spacing) 0;
}

.info-section {
  padding: var(--m-spacing);
  background-color: var(--bolao-c-blue3-t2);
  border-radius: var(--border-radius);
}

.info-section h3 {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  margin-bottom: var(--m-spacing);
  font-size: 0.9rem;
  color: var(--bolao-c-gold);
}

.info-section .info-title {
  margin-bottom: var(--s-spacing);
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--bolao-c-white);
}

.info-section .info-detail {
  margin-bottom: var(--xs-spacing);
  font-size: 0.9rem;
  color: var(--bolao-c-grey1-t2);
}

.expand-enter-active,
.expand-leave-active {
  max-height: 500px;
  opacity: 1;
  transition: all 0.4s ease;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  opacity: 0;
}
</style>
