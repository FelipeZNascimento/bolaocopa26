<template>
  <div header="Informações">
    <Transition name="expand">
      <div
        v-show="showMatchInfo"
        class="outer"
      >
        <div class="match-info">
          <div :class="{ 'span-two': isMobile }">
            <StadiumStickerComponent :stadium="match.stadium" />
          </div>
          <div
            v-if="match.weather.temperature"
            class="info-section"
          >
            <h3><i class="pi pi-sun" /><i class="pi pi-cloud" /> {{ t('matches.weather') }}</h3>
            <p class="info-title">{{ match.weather?.temperature ?? '' }} °C</p>
            <p class="info-detail">{{ t('matches.humidity') }}: {{ match.weather?.humidity ?? '' }}%</p>
            <p class="info-detail">{{ t('matches.windSpeed') }}: {{ match.weather?.windSpeed ?? '' }}km/h</p>
            <p
              v-if="locale === 'pt-BR'"
              class="info-detail"
            >
              {{ match.weather.description ?? '' }}
            </p>
          </div>
          <div class="info-section">
            <h3><i class="pi pi-user" /> {{ t('matches.referee') }}</h3>
            <p class="info-title">
              {{ match.referee.name }}
            </p>
            <p class="info-detail">
              <img
                class="flag"
                :src="`https://assets.omegafox.me/copa/countries_flags/${match.referee.isoCode.toLowerCase()}.png`"
                :alt="locale === 'pt-BR' ? match.referee.country : match.referee.country"
              />
              {{ locale === 'pt-BR' ? match.referee.country : match.referee.countryEn }}
            </p>
          </div>

          <div class="info-section">
            <h3><i class="pi pi-calendar" /> {{ t('matches.dateAndTime') }}</h3>
            <p class="info-title">
              {{ clockStore.getFormattedDate(match.timestamp) }}
            </p>
            <p class="info-detail"><i class="pi pi-clock" /> {{ clockStore.getFormattedTime(match.timestamp) }}</p>
            <p
              v-if="countdown"
              class="info-detail"
            >
              <i class="pi pi-clock" />
              {{ t('matches.countdown', { countdown }) }}
            </p>
          </div>

          <div class="info-section">
            <h3><i class="pi pi-flag" /> {{ t('matches.round') }}</h3>
            <p class="info-detail">
              {{ clockStore.getRoundName(match.round) }}
            </p>
            <p class="info-detail">{{ match.group ? `${t('matches.group', { group: match.group })}` : '' }}</p>
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

import StadiumStickerComponent from '@/components/StadiumStickerComponent.vue';
import { useViewport } from '@/services/viewport';
import { useClockStore } from '@/stores/clock';

const props = defineProps<{
  match: IMatch;
  showMatchInfo: boolean;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
const { locale, t } = useI18n();
const { isMobile } = useViewport();

// ------ Computed Properties ------
const countdown = computed(() => {
  return clockStore.getCountdown(props.match.timestamp);
});
</script>
<style lang="scss" scoped>
.outer {
  padding: 0 var(--l-spacing);
  overflow: hidden;
}

.match-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: var(--s-spacing);
  padding: var(--s-spacing) 0;
}

.span-two {
  grid-column: span 2;
}

.info-section {
  padding: var(--m-spacing);
  background-color: var(--bolao-c-blue3-d1);

  // border-radius: var(--border-radius);
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
  font-size: var(--s-font-size);
  font-weight: bold;
  color: var(--bolao-c-white);
}

.info-section .info-detail {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  margin-bottom: var(--xs-spacing);
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey1-t2);
}

.flag {
  display: block;
  width: 20px;
  height: 14px;
  object-fit: contain;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 20%));
}

.overlay-flag {
  height: 12px;
  border-radius: 2px;
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
