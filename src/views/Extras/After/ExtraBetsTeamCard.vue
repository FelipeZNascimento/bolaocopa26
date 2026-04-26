<template>
  <!-- Render of extra bets -->
  <div v-if="extraBets && extraBets.length > 0" class="cards-container">
    <div v-for="extraBet in extraBets" :key="extraBet.id" class="bets-card">
      <div class="top-text">
        {{ EXTRA_BETS_LABELS[extraBet.extraType] }}
      </div>
      <div class="image-container">
        <img
          :src="`https://assets.omegafox.me/copa/countries_flags/${extraBet.team.isoCode.toLowerCase()}.png`"
          :alt="`${extraBet.team.name} Shield`"
        />
      </div>
      <div class="bottom-text">
        <HoverablePlayerName v-if="extraBet.player" :player="extraBet.player" />
        <ClickableTeamName v-else :team="extraBet.team" />
      </div>
    </div>
  </div>
  <!-- Render of results for extra bets -->
  <div v-else-if="results && results.length > 0" class="cards-container">
    <div
      v-for="(extraBetType, index) in results"
      :key="index"
      style="display: flex; flex-direction: column; gap: var(--m-spacing)"
    >
      <div
        v-for="value in extraBetType.results"
        :key="value.extraType"
        class="bets-card"
      >
        <div class="top-text">
          {{ EXTRA_BETS_LABELS[value.extraType] }}
        </div>
        <div class="image-container">
          <img
            :src="`https://assets.omegafox.me/copa/countries_flags/${value.team.isoCode.toLowerCase()}.png`"
            :alt="`${value.team.name} Shield`"
          />
        </div>
        <div class="bottom-text">
          <HoverablePlayerName v-if="value.player" :player="value.player" />
          <ClickableTeamName v-else :team="value.team" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IExtraBet, IExtraResults } from "@/stores/extraBet.types";

import ClickableTeamName from "@/components/ClickableTeamName.vue";
import HoverablePlayerName from "@/components/HoverablePlayerName.vue";
import { EXTRA_BETS_LABELS } from "@/constants/bets";

defineProps<{
  extraBets?: IExtraBet[];
  results?: IExtraResults[];
}>();
</script>

<style lang="scss" scoped>
.cards-container {
  display: flex;
  gap: var(--m-spacing);
  flex-wrap: wrap;
  justify-content: center;
}

.bets-card {
  width: 160px;
  border-radius: var(--border-radius);
  background: color-mix(in srgb, var(--vt-c-indigo) 50%, transparent);
  color: white;
  box-shadow: var(--drop-shadow);
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: var(--m-font-size);

  @media (max-width: 768px) {
    font-size: var(--s-font-size);
    width: 100px;
  }

  .top-text {
    padding: 4px;
    height: 62px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    max-height: 100px;
    height: 100px;
    flex: 0;

    @media (max-width: 768px) {
      height: 50px;
      max-height: 50px;
    }
  }

  img {
    object-fit: contain;
    width: 100%;
    height: 100%;
  }

  .bottom-text {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 4px;
    height: 62px;
  }
}
</style>
