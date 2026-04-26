<template>
  <PrimeDialog
    v-if="team"
    v-model:visible="isVisible"
    dismissable-mask
    modal
    :draggable="false"
    :style="{ width: '900px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <img
        :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
        :alt="`${team.name} Flag`"
        class="header-flag"
      />
      <h2>
        {{ team.name }}
      </h2>
    </template>

    <div class="players-container">
      <div
        class="header-container"
        :style="{
          '--team-color-1': team.colors[0],
          '--team-color-2': team.colors[1],
        }"
      >
        <div class="header-background" />
        <div class="header-content-wrapper">
          <div class="header-left">
            <img
              :src="`https://assets.omegafox.me/copa/countries_crests/${team.abbreviationEn.toLowerCase()}.png`"
              :alt="`${team.name} Crest`"
              class="team-crest"
            />
            <div class="team-info">
              <h2 class="team-name">
                {{ team.name }}
              </h2>
              <p class="team-name-en">
                {{ team.nameEn }}
              </p>
              <p class="team-name-en">
                {{ team.confederation.abbreviation }}
              </p>
            </div>
          </div>
          <div class="header-right" v-if="!isMobile">
            <img
              :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
              :alt="`${team.name} Flag`"
              class="team-flag"
            />
          </div>
        </div>
      </div>
      <p>Técnico: <HoverablePlayerName v-if="coach" :player="coach" /></p>
      <h3 class="players-title">Jogadores ({{ sortedPlayers.length }})</h3>
      <div class="players-grid">
        <div
          v-for="player in sortedPlayers"
          :key="player.id"
          class="player-card"
        >
          <div class="player-number">
            {{ player.number }}
          </div>
          <div class="player-info">
            <div class="player-name">
              <HoverablePlayerName v-if="player" :player="player" />
            </div>
            <div class="player-details">
              <span class="player-position">{{
                player.position.abbreviation
              }}</span>
              <span class="player-club">{{ player.club.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import type { ITeam } from "@/stores/teams.types";

import HoverablePlayerName from "@/components/HoverablePlayerName.vue";
import { useViewport } from "@/services/viewport";

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
  team: ITeam | null;
}>();

// ------ Initialization ------
const { isMobile } = useViewport();

// ------ Refs ------
const isVisible = ref(false);

// ------ Computed ------
const coach = computed(() => {
  if (!props.team) return null;
  const coachPlayer = props.team.players.find(
    (player) => player.position.id === 1,
  );
  return coachPlayer ? coachPlayer : null;
});

const sortedPlayers = computed(() => {
  if (!props.team) return [];
  return [...props.team.players]
    .filter((player) => player.position.id !== 1)
    .sort((a, b) => a.number - b.number);
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
  overflow: hidden;
  border-radius: var(--border-radius);
  min-height: 160px;

  @media (max-width: 768px) {
    margin-right: 0;
    min-height: auto;
  }
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    var(--team-color-2) 0%,
    var(--team-color-1) 100%
  );
  opacity: 0.75;
  z-index: 0;

  @media (max-width: 768px) {
    opacity: 0.85;
  }
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
    align-items: center;
    padding: var(--l-spacing) var(--m-spacing);
    gap: var(--l-spacing);
    text-align: center;
  }
}
.header-flag {
  height: 40px;
  object-fit: contain;
  border-radius: var(--border-radius);
  padding: var(--s-spacing);
  flex-shrink: 0;

  @media (max-width: 768px) {
    height: 40px;
  }
}

.team-flag {
  height: 120px;
  object-fit: contain;
  border-radius: var(--border-radius);
  padding: var(--s-spacing);
  flex-shrink: 0;

  @media (max-width: 768px) {
    height: 60px;
  }
}

.team-crest {
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--border-radius);
  padding: var(--s-spacing);
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--l-spacing);
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--m-spacing);
    width: 100%;
  }

  .team-info {
    display: flex;
    flex-direction: column;
    gap: var(--xs-spacing);

    @media (max-width: 768px) {
      gap: 0;
    }

    .team-name {
      margin: 0;
      font-size: var(--xxl-font-size);
      font-weight: 700;
      color: var(--color-contrast);
      line-height: 1.2;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      @media (max-width: 768px) {
        font-size: var(--l-font-size);
        line-height: 1.3;
      }
    }

    .team-name-en {
      margin: 0;
      font-size: var(--l-font-size);
      color: var(--color-contrast);
      font-weight: 500;
      opacity: 0.85;

      @media (max-width: 768px) {
        font-size: var(--m-font-size);
      }
    }
  }
}

.header-right {
  display: flex;
  gap: var(--m-spacing);
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
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

  @media (max-width: 768px) {
    p {
      font-size: var(--s-font-size);
    }
  }
}

.players-title {
  margin: 0 0 var(--l-spacing) 0;
  font-size: var(--l-font-size);
  color: var(--color-contrast);

  @media (max-width: 768px) {
    margin: 0 0 var(--m-spacing) 0;
    font-size: var(--m-font-size);
  }
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--m-spacing);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--s-spacing);
  }
}

.player-card {
  display: flex;
  align-items: center;
  gap: var(--m-spacing);
  padding: var(--m-spacing);
  border-radius: var(--border-radius);
  background: color-mix(in srgb, var(--color-contrast) 5%, transparent);
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    padding: var(--s-spacing) var(--m-spacing);
    gap: var(--s-spacing);
  }

  &:hover {
    background: color-mix(in srgb, var(--color-contrast) 10%, transparent);
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: none;
    }
  }

  .player-number {
    font-size: var(--l-font-size);
    font-weight: bold;
    color: var(--bolao-c-blue);
    min-width: 40px;
    text-align: center;

    @media (max-width: 768px) {
      min-width: 32px;
      font-size: var(--m-font-size);
    }
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
      flex-wrap: wrap;

      @media (max-width: 768px) {
        gap: var(--s-spacing);
        font-size: var(--xs-font-size);
      }

      .player-position {
        font-weight: 600;
        color: var(--bolao-c-orange);
      }

      .player-club {
        @media (max-width: 768px) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
