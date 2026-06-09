<template>
  <PrimeDialog
    v-model:visible="isVisible"
    dismissable-mask
    modal
    :draggable="false"
    :style="{ width: '480px' }"
    :breakpoints="{ '768px': '92vw' }"
    :pt="{ header: { style: 'padding-bottom: 0' } }"
  >
    <template #header>
      <div class="modal-header">
        <template v-if="player">
          <img
            class="header-flag"
            :src="`https://assets.omegafox.me/copa/countries_flags/${player.team.isoCode.toLowerCase()}.png`"
            :alt="`${player.team.name} Flag`"
          />
          <div class="header-titles">
            <span class="header-label">{{ t(`extraBets.${extraTypeKey}`) }}</span>
            <h3 class="header-name">{{ player.name }}</h3>
            <span class="header-sub">{{ locale === 'pt-BR' ? player.team.name : player.team.nameEn }}</span>
          </div>
        </template>
        <template v-else-if="team">
          <img
            class="header-flag"
            :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
            :alt="`${team.name} Flag`"
          />
          <div class="header-titles">
            <span class="header-label">{{ t(`extraBets.${extraTypeKey}`) }}</span>
            <h3 class="header-name">{{ locale === 'pt-BR' ? team.name : team.nameEn }}</h3>
          </div>
        </template>
      </div>
    </template>

    <div class="bets-count">
      <span class="count-number">{{ bets.length }}</span>
      <span class="count-label">{{ t('extraBetsDetailsModal.bets', bets.length) }}</span>
    </div>

    <ul
      v-if="bets.length"
      class="bets-list"
    >
      <li
        v-for="bet in bets"
        :key="bet.id"
        class="bet-item"
        :class="{ 'bet-item--inactive': !bet.user.isActive }"
      >
        <i class="pi pi-user bet-icon" />
        <NameTag
          :user="bet.user"
          :isClickable="true"
        />
      </li>
    </ul>
    <p
      v-else
      class="empty-state"
    >
      {{ t('extraBetsDetailsModal.empty') }}
    </p>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IExtraBet } from '@/stores/extraBet.types';
import type { IPlayer, ITeam } from '@/stores/teams.types';

import NameTag from '@/components/NameTag.vue';
import { useScrollLock } from '@/composables/useScrollLock';
import { EXTRA_BETS_VALUES } from '@/constants/bets';

const props = defineProps<{
  bets: IExtraBet[];
  extraType: number;
  handleCloseModal: () => void;
  isOpen: boolean;
  player?: IPlayer;
  team?: ITeam;
}>();

const { locale, t } = useI18n();

const isVisible = ref(false);

const extraTypeKey = computed(() => {
  switch (props.extraType) {
    case EXTRA_BETS_VALUES.BEST_PLAYER:
      return 'bestPlayer';
    case EXTRA_BETS_VALUES.CHAMPION:
      return 'champion';
    case EXTRA_BETS_VALUES.DEFENSE:
      return 'bestDefense';
    case EXTRA_BETS_VALUES.OFFENSE:
      return 'bestOffense';
    case EXTRA_BETS_VALUES.TOP_SCORER:
      return 'topScorer';
    default:
      return 'champion';
  }
});

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  },
  { immediate: true },
);

const { lock, unlock } = useScrollLock();

watch(isVisible, (newValue) => {
  if (newValue) lock();
  else unlock();
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>

<style scoped lang="scss">
.modal-header {
  display: flex;
  gap: var(--m-spacing);
  align-items: center;
}

.header-flag {
  width: 56px;
  height: auto;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px rgb(0 0 0 / 25%);
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-label {
  font-size: var(--xs-font-size);
  font-weight: 500;
  color: var(--bolao-c-grey3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.header-name {
  margin: 0;
  font-size: var(--l-font-size);
  font-weight: 700;
  line-height: 1.2;
  color: var(--bolao-c-grey1);
}

.header-sub {
  font-size: var(--xs-font-size);
  color: var(--bolao-c-grey3);
}

.bets-count {
  display: flex;
  gap: var(--xs-spacing);
  align-items: baseline;
  padding: var(--m-spacing) 0 var(--s-spacing);
  margin-bottom: var(--s-spacing);
  border-bottom: 1px solid var(--bolao-c-blue3);
}

.count-number {
  font-size: var(--xxl-font-size);
  font-weight: 700;
  line-height: 1;
  color: var(--bolao-c-blue1);
}

.count-label {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey3);
}

.bets-list {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  max-height: 380px;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  list-style: none;
}

.bet-item {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  padding: var(--s-spacing) var(--m-spacing);
  background-color: var(--bolao-c-blue4);
  border-radius: var(--border-radius);
  transition: background-color 0.15s ease;

  &--inactive {
    opacity: 0.45;
  }
}

.bet-icon {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey3);
}

.empty-state {
  padding: var(--xl-spacing) 0;
  font-size: var(--m-font-size);
  color: var(--bolao-c-grey4);
  text-align: center;
}
</style>
