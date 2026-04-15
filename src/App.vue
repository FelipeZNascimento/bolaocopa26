<template>
  <NavbarTop />
  <PrimeToast />
  <div class="outer-view">
    <RouterView />
  </div>
  <div
    v-if="!activeProfile?.isActive"
    class="not-active"
  >
    Clique <a href="">aqui</a> para saber como ativar seu perfil e participar do bolão!
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { RouterView } from 'vue-router';

import NavbarTop from './components/NavbarTop/NavbarTop.vue';
import ExtraBetService from './services/extra_bet';
import MatchService from './services/match';
import RankingService from './services/ranking';
import StartupService from './services/startup';
import { useActiveProfileStore } from './stores/activeProfile';
import { useClockStore } from './stores/clock';
import { useConfigurationStore } from './stores/configuration';
import { useExtraBetStore } from './stores/extraBet';

const startupService = new StartupService();
const matchService = new MatchService();
const rankingService = new RankingService();
const extraBetService = new ExtraBetService();
const clockStore = useClockStore();
const configurationStore = useConfigurationStore();
const activeProfileStore = useActiveProfileStore();
const extraBetStore = useExtraBetStore();

function initializationCallback(isSuccess: boolean) {
  if (isSuccess) {
    console.log('Fetching initial matches and rankings...');
    matchService.fetch();
  }
}

// ------ Initialization ------
startupService.initialize(initializationCallback).then(() => {
  clockStore.startClock();
  rankingService.fetch();
});

// ------ Computed ------
const selectedRound = computed(() => configurationStore.selectedRound);
const activeProfile = computed(() => activeProfileStore.activeProfile);

// ------ Watches ------
// Fetches week's matches and week's ranking when selectedRound is changed
watch(selectedRound, async (newValue, oldValue) => {
  if (newValue && oldValue && newValue !== oldValue) {
    matchService.fetch();
  }
});

// Fetches rankings and week's matches when user logs in or out
// Fetches rankings and week's matches when user updates profile
watch(activeProfile, async (newValue) => {
  rankingService.fetch();
  matchService.fetch();

  // Fetches extra bets if user logged in, clears bets if user logged out
  if (newValue) {
    extraBetService.fetch();
  } else {
    extraBetStore.setLoggedUserBets([]);
  }

  // Week is possibly zero (preseason)
  if (!selectedRound.value) {
    return;
  }
  // rankingService.fetch();
});
</script>

<style scoped>
.outer-view {
  width: 100%;
  margin-top: 100px;
}

.not-active {
  position: fixed;
  bottom: 0;
  left: 0;
  font-size: var(--l-font-size);
  color: black;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.7);
  width: 100vw;
  text-align: center;
  padding: var(--m-spacing) 0;
}
</style>
