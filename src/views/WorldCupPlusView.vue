<template>
  <div class="outer-teams">
    <!-- Section navigation -->
    <nav class="section-nav">
      <PrimeButton
        variant="text"
        icon="pi pi-list"
        :label="!isMobile ? t('worldCupPlus.standings') : ''"
        style="color: #4ade80"
        :aria-label="t('worldCupPlus.standings')"
        :class="{ active: selectedSection === SECTIONS.STANDINGS }"
        @click="() => (selectedSection = SECTIONS.STANDINGS)"
      />
      <span class="section-nav__divider" />

      <PrimeButton
        variant="text"
        icon="pi pi-shield"
        :label="!isMobile ? t('worldCupPlus.teams') : ''"
        :aria-label="t('worldCupPlus.teams')"
        :class="{ active: selectedSection === SECTIONS.TEAMS }"
        style="color: var(--bolao-c-blue-l2)"
        @click="() => (selectedSection = SECTIONS.TEAMS)"
      />
      <span class="section-nav__divider" />
      <PrimeButton
        variant="text"
        icon="pi pi-id-card"
        :label="!isMobile ? t('worldCupPlus.players') : ''"
        style="color: var(--bolao-c-white)"
        :aria-label="t('worldCupPlus.players')"
        :class="{ active: selectedSection === SECTIONS.PLAYERS }"
        @click="() => (selectedSection = SECTIONS.PLAYERS)"
      />
      <span class="section-nav__divider" />
      <PrimeButton
        variant="text"
        icon="pi pi-map-marker"
        :label="!isMobile ? t('worldCupPlus.stadiums') : ''"
        :aria-label="t('worldCupPlus.stadiums')"
        :class="{ active: selectedSection === SECTIONS.STADIUMS }"
        style="color: var(--bolao-c-gold)"
        @click="() => (selectedSection = SECTIONS.STADIUMS)"
      />
      <span class="section-nav__divider" />
      <PrimeButton
        variant="text"
        icon="pi pi-flag"
        :label="!isMobile ? t('worldCupPlus.referees') : ''"
        style="color: #f97316"
        :aria-label="t('worldCupPlus.referees')"
        :class="{ active: selectedSection === SECTIONS.REFEREES }"
        @click="() => (selectedSection = SECTIONS.REFEREES)"
      />
    </nav>

    <!-- Sections -->
    <!-- <GroupsComponent v-if="selectedSection === SECTIONS.GROUPS" /> -->
    <TeamsComponent v-if="selectedSection === SECTIONS.TEAMS" />
    <StadiumsComponent v-if="selectedSection === SECTIONS.STADIUMS" />
    <PlayersComponent v-if="selectedSection === SECTIONS.PLAYERS" />
    <RefereesComponent v-if="selectedSection === SECTIONS.REFEREES" />
    <StandingsComponent v-if="selectedSection === SECTIONS.STANDINGS" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useViewport } from '@/services/viewport';
// import GroupsComponent from '@/views/WorldCupPlus/GroupsComponent.vue';
import PlayersComponent from '@/views/WorldCupPlus/PlayersComponent.vue';
import RefereesComponent from '@/views/WorldCupPlus/RefereesComponent.vue';
import StadiumsComponent from '@/views/WorldCupPlus/StadiumsComponent.vue';
import StandingsComponent from '@/views/WorldCupPlus/StandingsComponent.vue';
import TeamsComponent from '@/views/WorldCupPlus/TeamsComponent.vue';

const SECTIONS = {
  PLAYERS: 'PLAYERS',
  REFEREES: 'REFEREES',
  STADIUMS: 'STADIUMS',
  STANDINGS: 'STANDINGS',
  TEAMS: 'TEAMS',
} as const;
type TSection = (typeof SECTIONS)[keyof typeof SECTIONS];

// ------ Services & Stores ------
const { t } = useI18n();
const { isMobile } = useViewport();

// ------ Refs ------
const selectedSection = ref<TSection>(SECTIONS.STANDINGS); // 'STANDINGS' | 'STADIUMS' | 'PLAYERS' | 'TEAMS'

// ------ Computed Properties ------
</script>
<style lang="scss" scoped>
.outer-teams {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--l-spacing);
  align-items: center;
  padding: var(--l-spacing) 160px;

  @media (width <=768px) {
    padding: var(--xxl-spacing) var(--s-spacing);
  }

  h1 {
    margin: 0;
  }
}

.section-nav {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--xs-spacing) var(--m-spacing);
  background-color: var(--bolao-c-blue4);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);

  &__divider {
    width: 1px;
    height: 16px;
    background-color: var(--bolao-c-blue3);
  }

  :deep(.p-button.active) {
    background-color: rgb(255 255 255 / 8%);
    box-shadow: inset 0 -2px 0 currentcolor;
  }

  @media (width <= 400px) {
    padding: var(--xs-spacing);

    :deep(.p-button-label) {
      display: none;
    }

    :deep(.p-button) {
      justify-content: center;
      min-width: 44px;
      min-height: 44px;
      padding: var(--xs-spacing);
    }
  }
}

.skeleton-outer {
  width: 20% !important;
  min-height: 200px;

  @media (width <= 1024px) {
    width: 45% !important;
  }

  @media (width <= 600px) {
    width: 100% !important;
  }
}
</style>
