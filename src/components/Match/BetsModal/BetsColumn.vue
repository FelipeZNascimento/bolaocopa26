<template>
  <div
    class="bets-column"
    :class="{
      'green-bg': isExactColumn,
      'blue-bg': isOneScoreColumn,
      'orange-bg': isWinnerOnlyColumn,
      'red-bg': isMissColumn,
    }"
  >
    <p class="bets-column-header">
      {{ HIT_LEVELS_LABELS[props.hitLevel] }}
    </p>
    <!-- Render active user bet first -->
    <div v-for="bet in activeUserBet" :key="bet.id" class="bets-line active">
      <NameTag :is-clickable="true" :user="bet.user" :is-short="isMobile" />
      <div class="scores">{{ bet.scoreHome }} x {{ bet.scoreAway }}</div>
    </div>
    <!-- Render remaining bets -->
    <div v-for="bet in bets" :key="bet.id" class="bets-line">
      <NameTag :is-clickable="true" :user="bet.user" :is-short="isMobile" />
      <div class="scores">{{ bet.scoreHome }} x {{ bet.scoreAway }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";

import type { IBet } from "@/stores/matches.types";

import NameTag from "@/components/NameTag.vue";
import { HIT_LEVELS_LABELS, type HitLevel } from "@/constants/bets";
import { useViewport } from "@/services/viewport";

const props = defineProps<{
  activeUserBet: IBet[];
  bets: IBet[];
  hitLevel: HitLevel;
}>();

// ------ Initialization ------
const { isMobile } = useViewport();

// ------ Computed Properties ------
const isExactColumn = computed(() => props.hitLevel === "exact");
const isOneScoreColumn = computed(() => props.hitLevel === "oneScore");
const isWinnerOnlyColumn = computed(() => props.hitLevel === "winnerOnly");
const isMissColumn = computed(() => props.hitLevel === "miss");
</script>

<style lang="scss" scoped>
.bets-column {
  display: flex;
  flex: 1 0 0;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-width: 0;
  border: 1px solid var(--bolao-c-grey1-t1);

  // padding: var(--xs-spacing);
}

.active {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--bolao-c-white) 20%, transparent) 0%,
    color-mix(in srgb, var(--bolao-c-white) 10%, transparent) 75%,
    transparent 100%
  );
  box-shadow: inset 3px 0 0 var(--bolao-c-white);

  .scores {
    font-weight: bold;
    color: var(--bolao-c-white);
  }
}

.green-bg {
  background-color: var(--bolao-c-green-t2);
}

.blue-bg {
  background-color: var(--bolao-c-blue-t2);
}

.orange-bg {
  background-color: var(--bolao-c-orange-t2);
}

.red-bg {
  background-color: var(--bolao-c-red-t2);
}

.bets-column-header {
  width: 100%;
  padding: var(--s-spacing) 0;
  font-size: var(--m-font-size);
  font-weight: bold;
  text-align: center;
  background-color: rgb(255 255 255 / 10%);

  @media (width <= 1280px) {
    font-size: var(--s-font-size);
  }

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
}

.bets-line {
  display: flex;
  width: 100%;
  padding: var(--xxs-spacing) var(--s-spacing);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (width <= 768px) {
    align-items: center;
    flex-direction: column;
  }
}

.scores {
  flex: 1;
  text-align: right;
  border-bottom: 1px solid rgb(255 255 255 / 10%);

  @media (width <= 768px) {
    text-align: center;
    font-size: var(--xs-font-size);
    width: 100%;
  }
}
</style>
