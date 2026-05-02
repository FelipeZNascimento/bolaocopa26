<template>
  <NavbarMobile v-if="isMobile" />
  <NavbarTop v-else />
  <PrimeToast />
  <div class="outer-view">
    <RouterView />
  </div>
  <div
    v-if="!isLoading && activeProfile && !activeProfile.isActive"
    class="not-active"
  >
    Clique <a href="">aqui</a> para saber como ativar seu perfil e participar do
    bolão!
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { RouterView } from "vue-router";

import NavbarMobile from "./components/NavbarTop/NavbarMobile.vue";
import NavbarTop from "./components/NavbarTop/NavbarTop.vue";
import ExtraBetService from "./services/extra_bet";
import MatchService from "./services/match";
import RankingService from "./services/ranking";
import StartupService from "./services/startup";
import { useViewport } from "./services/viewport";
import { useActiveProfileStore } from "./stores/activeProfile";
import { useClockStore } from "./stores/clock";
import { useConfigurationStore } from "./stores/configuration";
import { useExtraBetStore } from "./stores/extraBet";

const startupService = new StartupService();
const matchService = new MatchService();
const rankingService = new RankingService();
const extraBetService = new ExtraBetService();
const clockStore = useClockStore();
const configurationStore = useConfigurationStore();
const activeProfileStore = useActiveProfileStore();
const extraBetStore = useExtraBetStore();
const { isMobile } = useViewport();

function initializationCallback(isSuccess: boolean) {
  if (isSuccess) {
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
const isLoading = computed(() => activeProfileStore.isLoading);

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
    extraBetStore.setActiveProfileBets([]);
  }

  // Week is possibly zero (preseason)
  if (!selectedRound.value) {
    return;
  }
  // rankingService.fetch();
});
</script>

<style lang="scss" scoped>
.outer-view {
  width: 100%;
  min-height: calc(100vh - var(--navbar-height));
  margin-top: var(--navbar-height);

  @media (width <= 1024px) {
    min-height: calc(100vh - var(--navbar-height-mobile));
    margin-top: var(--navbar-height-mobile);
  }
}

.not-active {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  padding: var(--m-spacing) 0;
  font-size: var(--l-font-size);
  color: black;
  text-align: center;
  background-color: rgb(255 255 255 / 70%);
}
</style>
