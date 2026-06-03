<template>
  <NavbarMobile v-if="isMobile" />
  <NavbarTop v-else />
  <PrimeToast position="bottom-right" />
  <PrimeConfirmDialog />
  <div class="outer-view">
    <RouterView />
  </div>
  <div
    v-if="!isLoading && activeProfile && !activeProfile.isActive && route.path !== '/regras'"
    class="not-active"
  >
    {{ t('inactiveBanner.message1') }}
    <RouterLink to="regras?section=inscricoes">{{ t('inactiveBanner.cta') }}</RouterLink
    >{{ t('inactiveBanner.message2') }}
  </div>
  <FooterComponent />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterLink, RouterView, useRoute } from 'vue-router';

import FooterComponent from './components/FooterComponent.vue';
import NavbarMobile from './components/NavbarTop/NavbarMobile.vue';
import NavbarTop from './components/NavbarTop/NavbarTop.vue';
import ExtraBetService from './services/extra_bet';
import MatchService from './services/match';
import RankingService from './services/ranking';
import StartupService from './services/startup';
import { useViewport } from './services/viewport';
import { useActiveProfileStore } from './stores/activeProfile';
import { useClockStore } from './stores/clock';
import { useConfigurationStore } from './stores/configuration';
import { useExtraBetStore } from './stores/extraBet';
import { useMatchesStore } from './stores/matches';

const startupService = new StartupService();
const route = useRoute();
const matchService = new MatchService();
const rankingService = new RankingService();
const extraBetService = new ExtraBetService();
const clockStore = useClockStore();
const configurationStore = useConfigurationStore();
const activeProfileStore = useActiveProfileStore();
const extraBetStore = useExtraBetStore();
const matchesStore = useMatchesStore();
const { isMobile } = useViewport();
const { t } = useI18n();

let appInitialized = false;

function initializationCallback(isSuccess: boolean) {
  if (isSuccess) {
    matchService.fetch();
  }
}

// ------ Initialization ------
startupService.initialize(initializationCallback).then(() => {
  clockStore.startClock();
  rankingService.fetch();
  if (activeProfile.value) {
    extraBetService.fetch();
  }
  appInitialized = true;
});

// Warn user before closing tab with unsaved changes
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (matchesStore.hasAnyChanges()) {
    event.preventDefault();
    event.returnValue = ''; // Chrome requires returnValue to be set
  }
};

// Trigger SW update check whenever the tab becomes visible
function checkForSWUpdate() {
  if (document.visibilityState === 'visible') {
    navigator.serviceWorker?.getRegistration().then((reg) => reg?.update());
  }
}

// Every minute, check if the websocket connection is alive, and reconnect if it isn't.
// This is a workaround for an issue where the connection can drop after some time,
// especially on mobile networks. The WebsocketService already has its own internal
// reconnection logic, but this adds an extra layer of reliability.
setInterval(function () {
  matchService.checkWebsocketConnection();
}, 60 * 1000);

// Track PWA install event in GA4
window.addEventListener('appinstalled', () => {
  window.dataLayer?.push(['event', 'pwa_installed']);
});

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  document.addEventListener('visibilitychange', checkForSWUpdate);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
  document.removeEventListener('visibilitychange', checkForSWUpdate);
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
  if (!appInitialized) return;

  rankingService.fetch();
  matchService.fetch();

  // Fetches extra bets if user logged in, clears bets if user logged out
  if (newValue) {
    extraBetService.fetch();
  } else {
    extraBetStore.resetActiveProfileBets();
  }

  // Week is possibly zero (preseason)
  if (!selectedRound.value) {
    return;
  }
});
</script>

<style lang="scss" scoped>
.outer-view {
  width: 100%;
  min-height: calc(100vh - var(--navbar-height) - 10px);
  padding-bottom: var(--xl-spacing);
  margin-top: var(--navbar-height);

  @media (width <= 1024px) {
    min-height: calc(100vh - var(--navbar-height-mobile) - 10px);
    margin-top: calc(var(--navbar-height-mobile) + 10px);
  }
}

.not-active {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  padding: var(--m-spacing) 0;
  font-size: var(--l-font-size);
  color: black;
  text-align: center;
  background-color: var(--bolao-c-grey2-t3);

  @media (width <= 1024px) {
    font-size: var(--m-font-size);
  }
}
</style>
