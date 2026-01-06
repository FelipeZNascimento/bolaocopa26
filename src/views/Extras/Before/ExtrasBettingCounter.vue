<template>
  <div
    v-if="!isMobileOnly"
    class="outer-extras-counter"
    :class="alignment === 'left' ? 'left-aligned' : 'right-aligned'"
  >
    <h3>{{ conference }}</h3>
    <p class="counter-line">
      <span> <i class="pi pi-crown icon" style="color: var(--bolao-c-gold)"></i> North </span>
      <span v-if="selectedDivisionChampions.North" class="logo">
        <img
          :src="`/team_logos/${selectedDivisionChampions.North.id}.gif`"
          :alt="`${selectedDivisionChampions.North.name} Shield`"
        />
      </span>
      <span v-else class="icon"><i class="pi pi-times"></i></span>
    </p>
    <p class="counter-line">
      <span> <i class="pi pi-crown icon" style="color: var(--bolao-c-gold)"></i> East </span>
      <span v-if="selectedDivisionChampions.East" class="logo">
        <img
          :src="`/team_logos/${selectedDivisionChampions.East.id}.gif`"
          :alt="`${selectedDivisionChampions.East.name} Shield`"
        />
      </span>
      <span v-else class="icon"><i class="pi pi-times"></i></span>
    </p>
    <p class="counter-line">
      <span> <i class="pi pi-crown icon" style="color: var(--bolao-c-gold)"></i> South </span>
      <span v-if="selectedDivisionChampions.South" class="logo">
        <img
          :src="`/team_logos/${selectedDivisionChampions.South.id}.gif`"
          :alt="`${selectedDivisionChampions.South.name} Shield`"
        />
      </span>
      <span v-else class="icon"><i class="pi pi-times"></i></span>
    </p>
    <p class="counter-line">
      <span><i class="pi pi-crown icon" style="color: var(--bolao-c-gold)"></i> West </span>
      <span v-if="selectedDivisionChampions.West" class="logo">
        <img
          :src="`/team_logos/${selectedDivisionChampions.West.id}.gif`"
          :alt="`${selectedDivisionChampions.West.name} Shield`"
        />
      </span>
      <span v-else class="icon"><i class="pi pi-times"></i></span>
    </p>
    <PrimeDivider />
    <h3>Wild Cards</h3>
    <p class="counter-line">
      <span v-for="team in selectedWildcards" :key="team.id" class="logo">
        <img :src="`/team_logos/${team.id}.gif`" :alt="`${team.name} Shield`" />
      </span>
      <span v-for="(_, index) in 3 - selectedWildcards.length" :key="index" class="icon">
        <i class="pi pi-times"></i>
      </span>
    </p>
    <PrimeDivider />
    <h3>{{ conference }} Champion</h3>
    <p class="counter-line">
      <i class="pi pi-crown icon" style="color: var(--bolao-c-gold)"></i>
      <span v-if="selectedConferenceChampion" class="logo">
        <img
          :src="`/team_logos/${selectedConferenceChampion.id}.gif`"
          :alt="`${selectedConferenceChampion.name} Shield`"
        />
      </span>
      <span v-else class="icon"><i class="pi pi-times"></i></span>
    </p>
    <PrimeDivider />
    <h3>Super Bowl</h3>
    <p class="counter-line">
      <i class="pi pi-crown icon" style="color: var(--bolao-c-gold)"></i>
      <span v-if="selectedSuperBowlWinner" class="logo">
        <img :src="`/team_logos/${selectedSuperBowlWinner.id}.gif`" :alt="`${selectedSuperBowlWinner.name} Shield`" />
      </span>
      <span v-else class="icon"><i class="pi pi-times"></i></span>
    </p>
    <PrimeDivider />
    <PrimeKnob v-model="progressPercentage" :size="50" valueTemplate="{value}%" :valueColor="knobColor" readonly />
  </div>
  <div v-else class="mobile-knobs-outer" :class="alignment === 'left' ? 'left-aligned' : 'right-aligned'">
    <h3 style="text-align: center">{{ conference }}</h3>
    <PrimeKnob v-model="progressPercentage" :size="40" valueTemplate="{value}%" :valueColor="knobColor" readonly />
  </div>
</template>

<script setup lang="ts">
import { isMobileOnly } from '@basitcodeenv/vue3-device-detect';
import { computed } from 'vue';

import type { TExtrasTeam, TSelectedDivisionChampions } from '@/stores/extraBet.types';
import type { TConference } from '@/stores/matches.types';

const props = defineProps<{
  alignment: 'left' | 'right';
  conference: TConference;
  selectedConferenceChampion: null | TExtrasTeam;
  selectedDivisionChampions: TSelectedDivisionChampions;
  selectedSuperBowlWinner: null | TExtrasTeam;
  selectedWildcards: TExtrasTeam[];
}>();

const knobColor = computed(() => {
  if (progressPercentage.value < 33) {
    return 'red';
  } else if (progressPercentage.value < 66) {
    return 'gold';
  } else if (progressPercentage.value < 95) {
    return 'darkcyan';
  } else {
    return 'lime';
  }
});

const progressPercentage = computed(() => {
  const maxPicks = 9;
  let totalPicks = props.selectedWildcards.length;

  if (props.selectedDivisionChampions.North) {
    totalPicks++;
  }
  if (props.selectedDivisionChampions.East) {
    totalPicks++;
  }
  if (props.selectedDivisionChampions.South) {
    totalPicks++;
  }
  if (props.selectedDivisionChampions.West) {
    totalPicks++;
  }

  if (props.selectedConferenceChampion) {
    totalPicks++;
  }

  if (props.selectedSuperBowlWinner) {
    totalPicks++;
  }

  if (totalPicks === 0) {
    return 0;
  }

  return Math.round((100 * totalPicks) / maxPicks);
});
</script>

<style lang="scss">
.outer-extras-counter {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--vt-c-indigo);
  color: white;
  padding: var(--s-spacing);
  font-size: var(--xs-font-size);
  text-align: center;

  // .p-knob-value {
  //   stroke: var(--bolao-c-mint);
  // }
}

.left-aligned {
  left: 0;
  border-bottom-right-radius: 12px;
  border-top-right-radius: 12px;
}

.right-aligned {
  right: 0;
  border-bottom-left-radius: 12px;
  border-top-left-radius: 12px;
}

.counter-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  height: 50px;

  .logo {
    width: 40px;

    img {
      width: 40px;
    }
  }

  .icon {
    width: 40px;
  }
}

.mobile-knobs-outer {
  position: fixed;
  top: 100px;
  background-color: var(--vt-c-indigo);
  padding: var(--s-spacing);
}
</style>
