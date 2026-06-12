<template>
  <PrimeDialog
    v-model:visible="isVisible"
    dismissable-mask
    modal
    :draggable="false"
    :style="{
      width: '1024px',
      height: '90vh',
      backgroundColor: 'var(--bolao-c-blue4)',
    }"
    :breakpoints="{ '1024px': '90vw', '575px': '95vw' }"
    content-class="content-class"
  >
    <template #header>
      <div class="header-outer">
        <span v-if="!isMobile && match"> {{ clockStore.getRoundName(match.round) }} - </span>
        <img
          class="team-shield-image"
          :src="`https://assets.omegafox.me/copa/countries_flags/${match.homeTeam.isoCode.toLowerCase()}.png`"
          :alt="`${locale === 'pt-BR' ? match.homeTeam.name : match.homeTeam.nameEn} Shield`"
          style="height: 20px"
        />
        {{ modalHeader() }}
        <img
          class="team-shield-image"
          :src="`https://assets.omegafox.me/copa/countries_flags/${match.awayTeam.isoCode.toLowerCase()}.png`"
          :alt="`${locale === 'pt-BR' ? match.awayTeam.name : match.awayTeam.nameEn} Shield`"
          style="height: 20px"
        />
      </div>
    </template>
    <template #default>
      <MoreInfoMobileView
        v-if="isMobile"
        :match="match"
        :hit-level="hitLevel"
        :is-match-started="isMatchStarted"
      />
      <MoreInfoDesktopView
        v-else
        :match="match"
        :hit-level="hitLevel"
        :is-match-started="isMatchStarted"
      />
    </template>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IMatch } from '@/stores/matches.types';

import { useScrollLock } from '@/composables/useScrollLock';
import { type THitLevel } from '@/constants/bets';
import { useViewport } from '@/services/viewport';
import { useClockStore } from '@/stores/clock';

import MoreInfoDesktopView from './MoreInfoDesktopView.vue';
import MoreInfoMobileView from './MoreInfoMobileView.vue';

const props = defineProps<{
  handleCloseModal: () => void;
  hitLevel: null | THitLevel;
  isOpen: boolean;
  match: IMatch;
}>();

// ------ Initialization ------
const clockStore = useClockStore();
const isVisible = ref(false);
const { isMobile } = useViewport();
const { locale } = useI18n();

// ------ Computed Properties ------
const isMatchStarted = computed(() => {
  return clockStore.currentTimestamp >= props.match.timestamp;
});

// ------ Functions ------
function modalHeader() {
  if (!props.match) return '';

  const homeTeamAbbr =
    locale.value === 'pt-BR' ? props.match.homeTeam.abbreviation : props.match.homeTeam.abbreviationEn;
  const awayTeamAbbr =
    locale.value === 'pt-BR' ? props.match.awayTeam.abbreviation : props.match.awayTeam.abbreviationEn;

  return `${homeTeamAbbr} ${props.match.score?.home ?? 0} x ${props.match.score?.away ?? 0} ${awayTeamAbbr}`;
}

// ------ Watches ------
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  },
);

const { lock, unlock } = useScrollLock();

watch(isVisible, async (newValue) => {
  if (newValue) lock();
  else unlock();
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>
<style lang="scss" scoped>
.header-outer {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>

<style lang="scss">
/* Unscoped styles for PrimeDialog content customization */
.content-class {
  padding: 0 !important;
}

.p-dialog-header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: var(--s-spacing) var(--m-spacing) !important;
  margin-bottom: var(--s-spacing);
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--bolao-c-blue2-d1) 55%, transparent) 0%,
      color-mix(in srgb, var(--bolao-c-blue2-d1) 8%, transparent) 100%
    ),
    var(--bolao-c-blue4) !important;
  border-radius: var(--border-radius);
  box-shadow: 0 4px 16px rgb(0 0 0 / 30%);
}
</style>
