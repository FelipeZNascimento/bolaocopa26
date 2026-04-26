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
  min-height: 160px;
  overflow: hidden;
  border-radius: var(--border-radius);

  @media (width <= 768px) {
    min-height: auto;
    margin-right: 0;
  }
}

.header-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(
    135deg,
    var(--team-color-2) 0%,
    var(--team-color-1) 100%
  );
  opacity: 0.75;

  @media (width <= 768px) {
    opacity: 0.85;
  }
}

.header-content-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  gap: var(--xl-spacing);
  align-items: center;
  justify-content: space-between;
  padding: var(--l-spacing);

  @media (width <= 768px) {
    flex-direction: column;
    gap: var(--l-spacing);
    align-items: center;
    padding: var(--l-spacing) var(--m-spacing);
    text-align: center;
  }
}

.header-flag {
  flex-shrink: 0;
  height: 40px;
  padding: var(--s-spacing);
  object-fit: contain;
  border-radius: var(--border-radius);

  @media (width <= 768px) {
    height: 40px;
  }
}

.team-flag {
  flex-shrink: 0;
  height: 120px;
  padding: var(--s-spacing);
  object-fit: contain;
  border-radius: var(--border-radius);

  @media (width <= 768px) {
    height: 60px;
  }
}

.team-crest {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  padding: var(--s-spacing);
  object-fit: contain;
  background: rgb(255 255 255 / 80%);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);

  @media (width <= 768px) {
    width: 100px;
    height: 100px;
  }
}

.header-left {
  display: flex;
  flex: 1;
  gap: var(--l-spacing);
  align-items: center;

  @media (width <= 768px) {
    flex-direction: column;
    gap: var(--m-spacing);
    width: 100%;
  }

  .team-info {
    display: flex;
    flex-direction: column;
    gap: var(--xs-spacing);

    @media (width <= 768px) {
      gap: 0;
    }

    .team-name {
      margin: 0;
      font-size: var(--xxl-font-size);
      font-weight: 700;
      line-height: 1.2;
      color: var(--color-contrast);
      text-shadow: 0 2px 4px rgb(0 0 0 / 10%);

      @media (width <= 768px) {
        font-size: var(--l-font-size);
        line-height: 1.3;
      }
    }

    .team-name-en {
      margin: 0;
      font-size: var(--l-font-size);
      font-weight: 500;
      color: var(--color-contrast);
      opacity: 0.85;

      @media (width <= 768px) {
        font-size: var(--m-font-size);
      }
    }
  }
}

.header-right {
  display: flex;
  gap: var(--m-spacing);
  align-items: center;

  @media (width <= 768px) {
    justify-content: center;
    width: 100%;
  }
}

.info-badge {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  min-width: 100px;
  height: 100%;
  padding: var(--m-spacing);
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--drop-shadow);

  .badge-label {
    font-size: var(--s-font-size);
    font-weight: 600;
    color: var(--bolao-c-grey1-t2);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .badge-value {
    font-size: var(--xl-font-size);
    font-weight: 700;
    color: var(--color-contrast);
  }
}

.players-container {
  // padding: var(--m-spacing) 0;

  @media (width <= 768px) {
    p {
      font-size: var(--s-font-size);
    }
  }
}

.players-title {
  margin: 0 0 var(--l-spacing) 0;
  font-size: var(--l-font-size);
  color: var(--color-contrast);

  @media (width <= 768px) {
    margin: 0 0 var(--m-spacing) 0;
    font-size: var(--m-font-size);
  }
}

.players-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--m-spacing);

  @media (width <= 768px) {
    grid-template-columns: 1fr;
    gap: var(--s-spacing);
  }
}

.player-card {
  display: flex;
  gap: var(--m-spacing);
  align-items: center;
  padding: var(--m-spacing);
  background: color-mix(in srgb, var(--color-contrast) 5%, transparent);
  border-radius: var(--border-radius);
  transition: all 0.2s ease;

  @media (width <= 768px) {
    gap: var(--s-spacing);
    padding: var(--s-spacing) var(--m-spacing);
  }

  &:hover {
    background: color-mix(in srgb, var(--color-contrast) 10%, transparent);
    transform: translateX(4px);
  }

  @media (width <= 768px) {
    &:hover {
      transform: none;
    }
  }

  .player-number {
    min-width: 40px;
    font-size: var(--l-font-size);
    font-weight: bold;
    color: var(--bolao-c-blue);
    text-align: center;

    @media (width <= 768px) {
      min-width: 32px;
      font-size: var(--m-font-size);
    }
  }

  .player-info {
    flex: 1;

    .player-name {
      margin-bottom: var(--xs-spacing);
      font-size: var(--m-font-size);
      font-weight: 600;
    }

    .player-details {
      display: flex;
      flex-wrap: wrap;
      gap: var(--m-spacing);
      font-size: var(--s-font-size);
      color: var(--bolao-c-grey1-t2);

      @media (width <= 768px) {
        gap: var(--s-spacing);
        font-size: var(--xs-font-size);
      }

      .player-position {
        font-weight: 600;
        color: var(--bolao-c-orange);
      }

      .player-club {
        @media (width <= 768px) {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>
