<template>
  <div style="position: relative; display: flex; flex-wrap: wrap; gap: 10px; justify-content: center">
    <!-- Overlay spinner when updating -->
    <div
      v-if="isLoading"
      class="update-overlay"
    >
      <PrimeProgressSpinner
        style="width: 50px; height: 50px"
        strokeWidth="4"
      />
    </div>

    <div class="bets-list">
      <div
        v-for="option in extraBetsOptions"
        :key="option.value"
        class="bet-row"
        :class="{
          'bet-row--active': selectedToggle?.value === option.value,
          'bet-row--correct': isBetFinished(option) && isExtraCorrect(option),
          'bet-row--wrong': isBetFinished(option) && !isExtraCorrect(option),
        }"
        @click="onSelectToggle(option)"
      >
        <span class="bet-radio" />
        <span class="bet-label">
          {{ t(EXTRA_BETS_LABELS[option.value]) }}
          <span v-if="option.value === EXTRA_BETS_VALUES.CHAMPION">*</span>
        </span>
        <div
          v-if="option.selectedTeam?.length"
          class="bet-value"
        >
          <div
            v-for="(entry, index) in option.selectedTeam"
            :key="entry.team.id"
            :class="{ 'bet-value__entry--replaced': index > 0 }"
            class="bet-value__entry"
          >
            <img
              class="bet-flag"
              :src="`https://assets.omegafox.me/copa/countries_flags/${entry.team.isoCode.toLowerCase()}.png`"
              :alt="`${entry.team.name} Flag`"
            />
            {{ locale === 'pt-BR' ? entry.team.name : entry.team.nameEn }}
          </div>
        </div>
        <span
          v-else
          class="bet-empty"
        >
          —
        </span>
        <PrimeButton
          v-if="onChampionChange && option.value === EXTRA_BETS_VALUES.CHAMPION"
          :disabled="isLoading"
          icon="pi pi-pencil"
          severity="secondary"
          size="small"
          @click.stop="onChampionChange"
        />
        <div
          v-if="isBetFinished(option)"
          v-tooltip.top="isExtraCorrect(option) ? 'Congratulations!' : 'Better luck next time'"
          class="bet-result"
          :class="isExtraCorrect(option) ? 'bet-result--correct' : 'bet-result--wrong'"
        >
          <i :class="isExtraCorrect(option) ? 'pi pi-trophy' : 'pi pi-times'" />
        </div>
      </div>
    </div>
  </div>
  <p style="margin-top: 10px; font-size: var(--xs-font-size); color: var(--color-text); text-align: center">
    {{ t('extraBets.championDisclaimer.message1') }}
    {{ t('extraBets.championDisclaimer.message2') }}
    <RouterLink
      to="/regras?section=extras"
      style="font-weight: 600; color: var(--bolao-c-blue1)"
    >
      {{ t('extraBets.championDisclaimer.link') }}
    </RouterLink>
  </p>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { EXTRA_BETS_LABELS, EXTRA_BETS_VALUES } from '@/constants/bets';
import { useExtraBetStore } from '@/stores/extraBet';

import type { IToggleOption } from './extrasView.types';

defineProps<{
  extraBetsOptions: IToggleOption[];
  isLoading: boolean;
  onChampionChange?: () => void;
  onSelectToggle: (option: IToggleOption) => void;
  selectedToggle: IToggleOption;
}>();

// ------ Services & Stores ------
const { locale, t } = useI18n();
const extraBetStore = useExtraBetStore();

// ------ Computed Properties ------
const extraBetsResults = computed(() => extraBetStore.results);

// ------ Functions ------

function isBetFinished(option: IToggleOption) {
  return extraBetsResults.value.find((bet) => bet.extraType === option.value);
}

function isExtraCorrect(option: IToggleOption) {
  // const results = extraBetsResults.value;
  const extraType = extraBetsResults.value.find((bet) => bet.extraType === option.value);
  if (!extraType) return false;

  if (option.value === EXTRA_BETS_VALUES.BEST_PLAYER || option.value === EXTRA_BETS_VALUES.TOP_SCORER) {
    return extraType.results.find((result) => result.player?.id === option.selectedPlayer?.id);
  } else {
    return extraType.results.find(
      (result) => result.team?.id && option.selectedTeam?.some((e) => e.team.id === result.team?.id),
    );
  }
}
</script>
<style lang="scss" scoped>
.update-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius);
  backdrop-filter: blur(2px);
}

.bets-list {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  min-width: 300px;
  border-radius: var(--border-radius);
}

.bet-row {
  display: flex;
  gap: var(--xl-spacing);
  align-items: center;
  justify-content: space-between;
  padding: var(--s-spacing) var(--m-spacing);
  font-size: var(--m-font-size);
  cursor: pointer;
  background-color: var(--bolao-c-blue4);
  border: 2px solid transparent;
  border-radius: var(--border-radius);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;

  &:hover {
    background-color: var(--bolao-c-blue3-t1);
    box-shadow: 0 0 0 3px var(--bolao-c-blue1-t1);
  }

  &:active {
    transform: scale(0.97);
  }

  &:has(button:hover) {
    background-color: var(--bolao-c-blue4);
    box-shadow: none;
  }

  &.bet-row--active:has(button:hover) {
    background-color: var(--bolao-c-blue3-t1);
  }

  &:has(button:active) {
    transform: none;
  }

  &--correct {
    border-color: var(--bolao-c-gold);
    box-shadow: 0 0 0 2px rgb(from var(--bolao-c-gold) r g b / 25%);
    animation: correct-pulse 2.5s ease-in-out infinite;

    .bet-label {
      color: var(--bolao-c-gold-l3);
    }
  }

  &--wrong {
    border-color: var(--bolao-c-red-l1);
  }

  &--active {
    background-color: var(--bolao-c-blue3-t1);
    border-color: var(--bolao-c-blue1);

    .bet-radio::after {
      opacity: 1;
      transform: scale(1);
    }

    .bet-label {
      color: var(--bolao-c-grey1);
    }
  }

  @media (width <= 768px) {
    gap: var(--s-spacing);
    font-size: var(--xs-font-size);
  }
}

.bet-radio {
  position: relative;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: 2px solid var(--bolao-c-grey4);
  border-radius: 50%;
  transition: border-color 0.15s ease;

  &::after {
    position: absolute;
    inset: 2px;
    content: '';
    background-color: var(--bolao-c-blue1);
    border-radius: 50%;
    opacity: 0;
    transform: scale(0.4);
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }

  .bet-row--active & {
    border-color: var(--bolao-c-blue1);
  }

  .bet-row:hover & {
    border-color: var(--bolao-c-grey2);
  }
}

.bet-label {
  flex: 1;
  font-weight: 500;
  color: var(--bolao-c-grey3);
  white-space: nowrap;
}

.bet-value {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  font-weight: 600;
  color: var(--bolao-c-grey1);

  &__entry {
    display: flex;
    gap: 4px;
    align-items: center;

    &--replaced {
      font-size: var(--xs-font-size);
      font-weight: 400;
      color: var(--bolao-c-grey4);
      text-decoration: line-through;
      opacity: 0.6;
    }
  }
}

.bet-flag {
  width: 18px;
  height: auto;
  border-radius: 2px;
}

.bet-empty {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey4);
}

.correctExtra {
  color: var(--bolao-c-mint-l3);
  background-color: var(--bolao-c-green);
  border-color: var(--bolao-c-mint);
}

.bet-result {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;

  &--correct {
    font-size: 14px;
    color: var(--bolao-c-gold-l3);
    background: linear-gradient(135deg, var(--bolao-c-gold-d2), var(--bolao-c-gold));
    box-shadow:
      0 0 10px rgb(from var(--bolao-c-gold) r g b / 50%),
      0 2px 6px rgb(0 0 0 / 30%);
    animation: trophy-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  }

  &--wrong {
    font-size: 11px;
    color: var(--bolao-c-red-l1);
    background-color: rgb(from var(--bolao-c-red-l1) r g b / 15%);
    border: 1px solid rgb(from var(--bolao-c-red-l1) r g b / 30%);
  }
}

@keyframes trophy-pop {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-20deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes correct-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 2px rgb(from var(--bolao-c-gold) r g b / 25%);
  }

  50% {
    box-shadow:
      0 0 0 4px rgb(from var(--bolao-c-gold) r g b / 40%),
      0 0 16px rgb(from var(--bolao-c-gold) r g b / 20%);
  }
}
</style>
