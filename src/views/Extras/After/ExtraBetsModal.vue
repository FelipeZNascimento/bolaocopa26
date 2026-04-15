<template>
  <PrimeDialog
    v-if="team || player"
    v-model:visible="isVisible"
    dismissableMask
    modal
    :draggable="false"
    :style="{ width: '1024px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
    contentClass="content-class"
  >
    <template #header>
      <div v-if="team" class="teams-outer">
        <img
          :src="`https://assets.omegafox.me/copa/countries_flags/${team.team.isoCode.toLowerCase()}.png`"
          :alt="`${team.team.name} Shield`"
        />
        <p>{{ player ? player.name : team.team.name }}</p>
      </div>
    </template>
    <div class="bets-grid">
      <div
        v-for="bet in bets.sort((a, b) => a.user.nickname.localeCompare(b.user.nickname))"
        :key="bet.id"
        class="bet-item"
      >
        <NameTag :isClickable="true" :user="bet.user" />
      </div>
    </div>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { TEXTRA_BETS_VALUES } from '@/constants/bets';
import type { IExtraBet } from '@/stores/extraBet.types';
import type { IPlayer, ITeam } from '@/stores/teams.types';

import NameTag from '@/components/NameTag.vue';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
  player: IPlayer | null;
  selectedBetType: TEXTRA_BETS_VALUES;
  team: null | { bets: IExtraBet[]; team: ITeam };
}>();

// ------ Refs ------
const isVisible = ref(false);

// ------ Computed ------

const bets = computed(() => {
  if (!props.team) {
    return [];
  }

  return props.team.bets.filter((bet) => bet.extraType === props.selectedBetType);
});

// ------ Watches ------
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      isVisible.value = true;
    }
  },
);

watch(isVisible, (newValue) => {
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>
<style lang="scss" scoped>
.teams-outer {
  display: flex;
  width: 100%;
  height: 60px;
  align-items: center;
  justify-content: center;
  gap: var(--m-spacing);
  font-size: var(--l-font-size);
  font-weight: bold;
  padding-bottom: var(--s-spacing);
  border-bottom: 1px solid var(--color-contrast);

  img {
    height: 100%;
  }
}

.team-column {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.bets-outer {
  display: flex;
  overflow-x: hidden !important;
}

.content-class {
  padding: 0 !important;
  overflow-x: hidden !important;
}

.bets-grid {
  columns: 4 200px;
  column-gap: var(--m-spacing);
  padding: var(--m-spacing);

  @media (max-width: 900px) {
    columns: 3 200px;
  }

  @media (max-width: 700px) {
    columns: 2 200px;
  }

  @media (max-width: 500px) {
    columns: 1 200px;
  }
}

.bet-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  width: 200px;
  flex-shrink: 0;
  break-inside: avoid;
  margin-bottom: var(--s-spacing);

  p {
    margin: 0;
  }
}
</style>
