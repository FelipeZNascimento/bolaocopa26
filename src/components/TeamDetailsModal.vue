<template>
  <PrimeDialog
    v-if="team"
    v-model:visible="isVisible"
    dismissableMask
    modal
    :draggable="false"
    :style="{ width: '900px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <div class="header-container" :style="{ '--team-color-1': team.colors[0], '--team-color-2': team.colors[1] }">
        <div class="header-background"></div>
        <div class="header-content-wrapper">
          <div class="header-left">
            <img
              :src="`https://assets.omegafox.me/copa/countries_crests/${team.abbreviationEn.toLowerCase()}.png`"
              :alt="`${team.name} Crest`"
              class="team-crest"
            />
            <div class="team-info">
              <h2 class="team-name">{{ team.name }}</h2>
              <p class="team-name-en">{{ team.nameEn }}</p>
              <p class="team-name-en">{{ team.confederation.abbreviation }}</p>
            </div>
          </div>
          <div class="header-right">
            <img
              :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
              :alt="`${team.name} Flag`"
              class="team-flag"
            />
          </div>
        </div>
      </div>
    </template>

    <div class="players-container">
      <p>Técnico: <HoverablePlayerName v-if="coach" :player="coach" /></p>
      <h3 class="players-title">Jogadores ({{ sortedPlayers.length }})</h3>
      <div class="players-grid">
        <div v-for="player in sortedPlayers" :key="player.id" class="player-card">
          <div class="player-number">{{ player.number }}</div>
          <div class="player-info">
            <div class="player-name"><HoverablePlayerName v-if="player" :player="player" /></div>
            <div class="player-details">
              <span class="player-position">{{ player.position.abbreviation }}</span>
              <span class="player-club">{{ player.club.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { ITeam } from '@/stores/teams.types';

import HoverablePlayerName from '@/components/HoverablePlayerName.vue';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
  team: ITeam | null;
}>();

// ------ Refs ------
const isVisible = ref(false);

// ------ Computed ------
const coach = computed(() => {
  if (!props.team) return null;
  const coachPlayer = props.team.players.find((player) => player.position.id === 1);
  return coachPlayer ? coachPlayer : null;
});

const sortedPlayers = computed(() => {
  if (!props.team) return [];
  return [...props.team.players].filter((player) => player.position.id !== 1).sort((a, b) => a.number - b.number);
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
.header-container {
  position: relative;
  width: 100%;
  margin-right: var(--s-spacing);
  overflow: hidden;
  border-radius: var(--border-radius);
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, var(--team-color-2) 0%, var(--team-color-1) 100%);
  opacity: 0.6;
  z-index: 0;
}

.header-content-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--l-spacing);
  gap: var(--xl-spacing);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
}
.team-flag {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: var(--border-radius);
  padding: var(--s-spacing);
  box-shadow: var(--drop-shadow);
  flex-shrink: 0;
}

.team-crest {
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: white;
  border-radius: var(--border-radius);
  padding: var(--s-spacing);
  box-shadow: var(--drop-shadow);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--l-spacing);
  flex: 1;

  .team-info {
    display: flex;
    flex-direction: column;
    gap: var(--xs-spacing);

    .team-name {
      margin: 0;
      font-size: var(--xxl-font-size);
      font-weight: 700;
      color: var(--color-contrast);
      line-height: var(--xxl-spacing);
    }

    .team-name-en {
      margin: 0;
      font-size: var(--l-font-size);
      color: var(--bolao-c-grey1-t2);
      font-weight: 500;
    }
  }
}

.header-right {
  display: flex;
  gap: var(--m-spacing);
  align-items: center;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
}

.info-badge {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  background: var(--color-background);
  padding: var(--m-spacing);
  border-radius: var(--border-radius);
  border: 2px solid var(--color-border);
  min-width: 100px;
  box-shadow: var(--drop-shadow);
  height: 100%;

  .badge-label {
    font-size: var(--s-font-size);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--bolao-c-grey1-t2);
    font-weight: 600;
  }

  .badge-value {
    font-size: var(--xl-font-size);
    font-weight: 700;
    color: var(--color-contrast);
  }
}

.players-container {
  // padding: var(--m-spacing) 0;
}

.players-title {
  margin: 0 0 var(--l-spacing) 0;
  font-size: var(--l-font-size);
  color: var(--color-contrast);
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--m-spacing);
}

.player-card {
  display: flex;
  align-items: center;
  gap: var(--m-spacing);
  padding: var(--m-spacing);
  border-radius: var(--border-radius);
  background: color-mix(in srgb, var(--color-contrast) 5%, transparent);
  transition: all 0.2s ease;

  &:hover {
    background: color-mix(in srgb, var(--color-contrast) 10%, transparent);
    transform: translateX(4px);
  }

  .player-number {
    font-size: var(--l-font-size);
    font-weight: bold;
    color: var(--bolao-c-blue);
    min-width: 40px;
    text-align: center;
  }

  .player-info {
    flex: 1;

    .player-name {
      font-weight: 600;
      font-size: var(--m-font-size);
      margin-bottom: var(--xs-spacing);
    }

    .player-details {
      display: flex;
      gap: var(--m-spacing);
      font-size: var(--s-font-size);
      color: var(--bolao-c-grey1-t2);

      .player-position {
        font-weight: 600;
        color: var(--bolao-c-orange);
      }
    }
  }
}
</style>
