<template>
  <div class="bets-feed">
    <!-- Outcome summary cards / filter buttons -->
    <div
      class="outcome-cards"
      role="toolbar"
      :aria-label="t('bets.filterLabel')"
    >
      <button
        v-for="card in outcomeCards"
        :key="card.hitLevel"
        class="outcome-card"
        :class="[
          `outcome-card--${card.hitLevel}`,
          {
            'is-selected': activeFilter === card.hitLevel,
            'is-dimmed': activeFilter !== null && activeFilter !== card.hitLevel,
          },
        ]"
        :aria-pressed="activeFilter === card.hitLevel"
        @click="toggleFilter(card.hitLevel)"
      >
        <i :class="`pi ${card.icon}`" />
        <span class="outcome-card__count">{{ card.count }}</span>
        <span class="outcome-card__label">{{ t(card.label) }}</span>
        <span class="outcome-card__pts">+{{ card.points }}pts</span>
      </button>
    </div>

    <!-- Unified bet list -->
    <div
      v-if="visibleBets.length > 0"
      class="bet-list"
      role="list"
      aria-live="polite"
    >
      <div
        v-for="bet in visibleBets"
        :key="bet.id"
        class="bet-row"
        :class="[`bet-row--${bet.hitLevel}`, { 'bet-row--self': bet.isActiveUser }]"
        role="listitem"
      >
        <span
          class="bet-row__chip"
          :class="`bet-row__chip--${bet.hitLevel}`"
        >
          <i :class="`pi ${OUTCOME_ICONS[bet.hitLevel]}`" />
        </span>
        <div class="bet-row__name">
          <NameTag
            :user="bet.user"
            :is-clickable="true"
          />
        </div>
        <span
          class="bet-row__connector"
          aria-hidden="true"
        />
        <span class="bet-row__score">{{ bet.scoreHome }} × {{ bet.scoreAway }}</span>
      </div>
    </div>
    <p
      v-else
      class="no-results"
    >
      {{ t('bets.noResults') }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IBet } from '@/stores/matches.types';

import NameTag from '@/components/NameTag.vue';
import { HIT_LEVELS, HIT_LEVELS_LABELS, HIT_LEVELS_POINTS, type THitLevel } from '@/constants/bets';

export interface BetWithOutcome extends IBet {
  hitLevel: THitLevel;
  isActiveUser: boolean;
}

const props = defineProps<{
  bets: BetWithOutcome[];
}>();

const { t } = useI18n();

const activeFilter = ref<null | THitLevel>(null);

const OUTCOME_ICONS: Record<THitLevel, string> = {
  [HIT_LEVELS.exactScore]: 'pi-trophy',
  [HIT_LEVELS.miss]: 'pi-times-circle',
  [HIT_LEVELS.oneScore]: 'pi-verified',
  [HIT_LEVELS.winnerOnly]: 'pi-check-circle',
};

const outcomeCards = computed(() => [
  {
    count: props.bets.filter((b) => b.hitLevel === HIT_LEVELS.exactScore).length,
    hitLevel: HIT_LEVELS.exactScore,
    icon: 'pi-trophy',
    label: HIT_LEVELS_LABELS[HIT_LEVELS.exactScore],
    points: HIT_LEVELS_POINTS[HIT_LEVELS.exactScore],
  },
  {
    count: props.bets.filter((b) => b.hitLevel === HIT_LEVELS.oneScore).length,
    hitLevel: HIT_LEVELS.oneScore,
    icon: 'pi-verified',
    label: HIT_LEVELS_LABELS[HIT_LEVELS.oneScore],
    points: HIT_LEVELS_POINTS[HIT_LEVELS.oneScore],
  },
  {
    count: props.bets.filter((b) => b.hitLevel === HIT_LEVELS.winnerOnly).length,
    hitLevel: HIT_LEVELS.winnerOnly,
    icon: 'pi-check-circle',
    label: HIT_LEVELS_LABELS[HIT_LEVELS.winnerOnly],
    points: HIT_LEVELS_POINTS[HIT_LEVELS.winnerOnly],
  },
  {
    count: props.bets.filter((b) => b.hitLevel === HIT_LEVELS.miss).length,
    hitLevel: HIT_LEVELS.miss,
    icon: 'pi-times-circle',
    label: HIT_LEVELS_LABELS[HIT_LEVELS.miss],
    points: HIT_LEVELS_POINTS[HIT_LEVELS.miss],
  },
]);

const visibleBets = computed(() => {
  if (!activeFilter.value) return props.bets;
  return props.bets.filter((b) => b.hitLevel === activeFilter.value);
});

function toggleFilter(level: THitLevel) {
  activeFilter.value = activeFilter.value === level ? null : level;
}
</script>

<style lang="scss" scoped>
.bets-feed {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.outcome-cards {
  display: flex;
  gap: var(--l-spacing);
  padding: var(--s-spacing);

  @media (width <= 768px) {
    gap: var(--xs-spacing);
  }
}

.outcome-card {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--xxs-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--m-spacing) var(--xs-spacing) 0 var(--xs-spacing);
  overflow: hidden;
  color: var(--bolao-c-white);
  cursor: pointer;
  background: color-mix(in srgb, var(--outcome-color) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--outcome-color) 25%, transparent);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 6px rgb(0 0 0 / 8%);
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease,
    transform 0.15s ease;

  @media (width <= 768px) {
    padding: var(--m-spacing) var(--xxs-spacing) 0 var(--xxs-spacing);
  }

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 0;
    height: 6px;
    pointer-events: none;
    content: '';
    background: var(--outcome-color);
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }

  .pi {
    position: relative;
    z-index: 1;
    font-size: var(--l-font-size);
    color: color-mix(in srgb, var(--outcome-color) 65%, var(--bolao-c-white) 35%);
    transition: transform 0.2s ease;
  }

  &.is-selected {
    background: color-mix(in srgb, var(--outcome-color) 22%, transparent);
    border-color: color-mix(in srgb, var(--outcome-color) 60%, transparent);
    box-shadow: 0 2px 10px color-mix(in srgb, var(--outcome-color) 30%, transparent);
  }

  &.is-dimmed {
    opacity: 0.35;
  }

  &:hover:not(.is-dimmed) {
    background: color-mix(in srgb, var(--outcome-color) 18%, transparent);
    border-color: color-mix(in srgb, var(--outcome-color) 45%, transparent);
    transform: translateY(-1px);

    .pi {
      transform: scale(1.15);
    }
  }

  &:active {
    transform: scale(0.97);
  }

  &--exact {
    --outcome-color: var(--bolao-c-gold);
  }

  &--oneScore {
    --outcome-color: var(--bolao-c-mint);
  }

  &--winnerOnly {
    --outcome-color: var(--color-anchor);
  }

  &--miss {
    --outcome-color: var(--bolao-c-red);
  }
}

.outcome-card__count {
  position: relative;
  z-index: 1;
  font-size: var(--l-font-size);
  font-weight: 700;
  line-height: 1;
  color: color-mix(in srgb, var(--outcome-color) 65%, var(--bolao-c-white) 35%);
}

.outcome-card__label {
  position: relative;
  z-index: 1;
  font-size: var(--xxs-font-size);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (width <= 768px) {
    display: none;
  }
}

.outcome-card__pts {
  position: relative;
  z-index: 1;
  font-size: var(--xs-font-size);
  color: var(--bolao-c-white);
}

.bet-list {
  overflow-y: auto;
}

.bet-row {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  padding: var(--xs-spacing) var(--s-spacing);
  border-bottom: 1px solid color-mix(in srgb, var(--color-contrast) 8%, transparent);
  transition: background 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &.bet-row--self {
    background: color-mix(in srgb, var(--color-main) 10%, transparent);
  }

  &:hover {
    background: color-mix(in srgb, var(--color-main) 5%, transparent);
  }
}

.bet-row__strip {
  width: 3px;
  min-width: 3px;
  min-height: 24px;
  margin-right: var(--s-spacing);
  border-radius: 2px;

  .bet-row--exact & {
    background: var(--bolao-c-gold);
  }

  .bet-row--oneScore & {
    background: var(--bolao-c-mint);
  }

  .bet-row--winnerOnly & {
    background: var(--color-anchor);
  }

  .bet-row--miss & {
    background: var(--bolao-c-red);
  }
}

.bet-row__name {
  flex: 1;
  min-width: 120px;

  @media (width <= 768px) {
    flex: 0 1 auto;
    min-width: 0;
  }
}

.bet-row__connector {
  display: none;

  @media (width <= 768px) {
    display: block;
    flex: 1;
    align-self: center;
    border-bottom: 1px dashed color-mix(in srgb, var(--color-contrast) 25%, transparent);
  }
}

.bet-row__score {
  margin: 0 var(--s-spacing);
  font-size: var(--s-font-size);
  font-weight: 600;
  color: var(--bolao-c-white);
  white-space: nowrap;
}

.bet-row__chip {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  min-width: 28px;
  height: 28px;
  border-radius: 50%;

  .pi {
    font-size: var(--xs-font-size);
  }

  &--exact {
    color: var(--bolao-c-gold);
    background: color-mix(in srgb, var(--bolao-c-gold) 18%, transparent);
  }

  &--oneScore {
    color: var(--bolao-c-mint);
    background: color-mix(in srgb, var(--bolao-c-mint) 18%, transparent);
  }

  &--winnerOnly {
    color: var(--color-anchor);
    background: color-mix(in srgb, var(--color-anchor) 18%, transparent);
  }

  &--miss {
    color: var(--bolao-c-red);
    background: color-mix(in srgb, var(--bolao-c-red) 18%, transparent);
  }
}

.no-results {
  padding: var(--xl-spacing);
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey1-t2);
  text-align: center;
}
</style>
