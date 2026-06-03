<template>
  <div class="outer">
    <BannerComponent
      v-if="!activeProfile?.isActive"
      :items="BANNER_ITEMS"
    />
    <div
      v-if="!isDashboardBannerDismissed"
      class="rules-banner"
    >
      <h3>{{ t('extraBets.rulesBanner') }}</h3>
      <RouterLink
        to="/regras?section=extras"
        class="rules-banner-link"
      >
        {{ t('extraBets.rulesBannerLink') }} <i class="pi pi-arrow-up-right" />
      </RouterLink>
      <button
        class="banner-dismiss"
        :aria-label="$t('common.dismiss')"
        @click="dismissBanner"
      >
        <i class="pi pi-times" />
      </button>
    </div>
    <div style="padding: var(--m-spacing); background-color: var(--bolao-c-blue3); border-radius: var(--border-radius)">
      <CountdownComponent
        v-if="showCountdown"
        :countdown-to="configurationStore.editionStart ?? 0"
        :colorful="true"
        title="home.extras.countdownLabel"
      />
    </div>
    <h2 style="text-align: center">
      {{ t('extraBets.myBets') }}
    </h2>
    <MyExtrasComponent
      :selectedToggle="selectedToggle"
      :extraBetsOptions="extraBetsOptions"
      :onSelectToggle="onSelectToggle"
      :isLoading="isLoading"
    />
    <h2>{{ currentSelectedToggle ? t(currentSelectedToggle.label) : '' }}</h2>
    <ExtrasBeforeTeam
      v-if="
        currentSelectedToggle?.value != EXTRA_BETS_VALUES.TOP_SCORER &&
        currentSelectedToggle?.value != EXTRA_BETS_VALUES.BEST_PLAYER
      "
      :selectedToggle="currentSelectedToggle"
      @teamClickFail="onTeamClickFail"
    />
    <ExtrasBeforePlayer
      v-else
      :selectedToggle="currentSelectedToggle"
      @playerClickFail="onPlayerClickFail"
    />
  </div>
  <!-- Modals -->
  <LoginModal
    :is-open="isLoginModalOpen"
    :handle-close-modal="handleCloseLoginModal"
  />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { BannerItem } from '@/components/BannerComponent.vue';
import type { IPlayer } from '@/stores/teams.types';
import type { ISelectedTeamEntry, IToggleOption } from '@/views/Extras/extrasView.types';

import CountdownComponent from '@/components/CountdownComponent.vue';
import LoginModal from '@/components/LoginModal.vue';
import { EXTRA_BETS_LABELS, EXTRA_BETS_VALUES } from '@/constants/bets';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useClockStore } from '@/stores/clock';
import { useConfigurationStore } from '@/stores/configuration';
import { useExtraBetStore } from '@/stores/extraBet';
import { useTeamsStore } from '@/stores/teams';
import ExtrasBeforePlayer from '@/views/Extras/ExtrasBeforePlayer.vue';
import ExtrasBeforeTeam from '@/views/Extras/ExtrasBeforeTeam.vue';
import MyExtrasComponent from '@/views/Extras/MyExtrasComponent.vue';

import { BUTTON_OPTIONS } from './extrasView.constants';

// ------ Banner ------
const BANNER_ITEMS: BannerItem[] = [
  { key: 'inactiveBanner.message1', type: 'description' },
  { key: 'common.clickHere', route: 'regras?section=inscricoes', type: 'link' },
];

// ------ Services & Stores ------
const teamsStore = useTeamsStore();
const extraBetStore = useExtraBetStore();
const activeProfileStore = useActiveProfileStore();
const configurationStore = useConfigurationStore();
const clockStore = useClockStore();
const { t } = useI18n();

// ------ Refs ------
const isLoginModalOpen = ref(false);
const selectedToggle = ref<IToggleOption>({
  label: EXTRA_BETS_LABELS[EXTRA_BETS_VALUES.CHAMPION],
  value: EXTRA_BETS_VALUES.CHAMPION,
});

// ------ Computed Properties ------
const isLoading = computed(() => {
  return extraBetStore.isLoading || extraBetStore.isUpdating || teamsStore.isLoading;
});
const showCountdown = computed(() => {
  return !clockStore.hasEditionStarted;
});

const activeProfile = computed(() => activeProfileStore.activeProfile);
const activeProfileBets = computed(() => extraBetStore.activeProfileBets);
const currentSelectedToggle = computed(
  () =>
    extraBetsOptions.value.find((option) => option.value === selectedToggle.value.value) ?? extraBetsOptions.value[0],
);
const extraBetsOptions = computed<IToggleOption[]>(() => {
  // Deep-copy each option so mutations never bleed back into the BUTTON_OPTIONS constant
  const options: IToggleOption[] = BUTTON_OPTIONS.map((opt) => ({ ...opt }));

  // Populate from activeProfileBets
  activeProfileBets.value.forEach((bet) => {
    const option = options.find((opt) => opt.value === bet.extraType);
    if (option) {
      option.selectedTeam = [{ stageId: bet.stageId, team: bet.team }];
      if (bet.extraType === EXTRA_BETS_VALUES.TOP_SCORER || bet.extraType === EXTRA_BETS_VALUES.BEST_PLAYER) {
        option.selectedPlayer = bet.player;
      }
    }
  });

  return options;
});

// ------ Rules banner ------
const BANNER_STORAGE_KEY = 'extra-bets-rules-banner-dismissed';
const isDashboardBannerDismissed = ref(localStorage.getItem(BANNER_STORAGE_KEY) === 'true');

function dismissBanner() {
  isDashboardBannerDismissed.value = true;
  localStorage.setItem(BANNER_STORAGE_KEY, 'true');
}
// ------ Functions ------

function handleCloseLoginModal() {
  isLoginModalOpen.value = false;
}

function onPlayerClickFail(previousPlayer: IPlayer | null) {
  currentSelectedToggle.value.selectedPlayer = previousPlayer;
}

function onSelectToggle(option: IToggleOption) {
  selectedToggle.value = option;
}

function onTeamClickFail(previousTeam: ISelectedTeamEntry[]) {
  currentSelectedToggle.value.selectedTeam = previousTeam;
}
</script>
<style lang="scss" scoped>
.outer {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  align-items: center;
  justify-content: space-between;
  padding: var(--l-spacing) 160px;

  @media (width <= 768px) {
    padding: var(--xxl-spacing) var(--s-spacing);
  }
}

.active-banner {
  position: relative;
  display: flex;
  gap: var(--xs-spacing);
  padding: var(--s-spacing) var(--xxl-spacing);
  margin-bottom: var(--l-spacing);
  color: var(--bolao-c-grey2);
  text-align: center;
  background-color: var(--bolao-c-blue5);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);
}

.rules-banner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--s-spacing) var(--xxl-spacing);
  margin-bottom: var(--l-spacing);
  color: var(--bolao-c-grey2);
  background-color: var(--bolao-c-blue5);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);

  h3 {
    font-size: var(--s-font-size);
    text-align: center;
  }
}

.rules-banner-link {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-blue1);
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: var(--bolao-c-blue1-l1);
    text-decoration: underline;
  }

  .pi {
    font-size: 0.7em;
  }
}

.banner-dismiss {
  position: absolute;
  top: 50%;
  right: var(--s-spacing);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 50%;
  opacity: 0.6;
  transform: translateY(-50%);
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  .pi {
    font-size: var(--xs-font-size);
    color: var(--bolao-c-grey2);
  }
}

.buttons-outer {
  display: flex;
  flex-wrap: wrap;
  gap: var(--m-spacing);
  justify-content: center;
}

.skeleton {
  height: 200px !important;
}
</style>
