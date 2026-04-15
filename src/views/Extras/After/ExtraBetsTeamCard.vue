<template>
  <!-- Render of extra bets -->
  <div
    v-if="extraBets && extraBets.length > 0"
    style="display: flex; gap: 20px; flex-wrap: wrap"
  >
    <div
      v-for="extraBet in extraBets"
      :key="extraBet.id"
      class="bets-card"
    >
      <div class="top-text">
        {{ EXTRA_BETS_LABELS[extraBet.extraType] }}
      </div>
      <div class="image-container">
        <img
          :src="`https://assets.omegafox.me/copa/countries_flags/${extraBet.team.isoCode.toLowerCase()}.png`"
          :alt="`${extraBet.team.name} Shield`"
        >
      </div>
      <div class="bottom-text">
        <HoverablePlayerName
          v-if="extraBet.player"
          :player="extraBet.player"
        />
        <ClickableTeamName
          v-else
          :team="extraBet.team"
        />
      </div>
    </div>
  </div>
  <!-- Render of results for extra bets -->
  <div
    v-else-if="results && results.length > 0"
    style="display: flex; gap: 20px; flex-wrap: wrap"
  >
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
          >
        </div>
        <div class="bottom-text">
          <HoverablePlayerName
            v-if="value.player"
            :player="value.player"
          />
          <ClickableTeamName
            v-else
            :team="value.team"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { IExtraBet, IExtraResults } from '@/stores/extraBet.types';

import ClickableTeamName from '@/components/ClickableTeamName.vue';
import HoverablePlayerName from '@/components/HoverablePlayerName.vue';
import { EXTRA_BETS_LABELS } from '@/constants/bets';

defineProps<{
  extraBets?: IExtraBet[];
  results?: IExtraResults[];
}>();
</script>

<style lang="scss" scoped>
.bets-card {
  width: 160px;
  border-radius: var(--border-radius);
  background: color-mix(in srgb, var(--vt-c-indigo) 50%, transparent);
  color: white;
  box-shadow: var(--drop-shadow);
  display: flex;
  flex-direction: column;

  .top-text {
    text-align: center;
    font-size: var(--m-font-size);
    padding: 4px;
  }

  .image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .bottom-text {
    text-align: center;
    font-size: var(--m-font-size);
    padding: 4px;
  }
}
</style>
