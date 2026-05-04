<template>
  <div
    v-if="player"
    class="panini-sticker"
    :style="{ '--team-gradient': `linear-gradient(90deg, ${player.team.colors || '#FFD700'})` }"
  >
    <div
      class="sticker-header"
      :style="{ background: `linear-gradient(90deg, ${player.team.colors || '#FFD700'})` }"
    >
      <div class="sticker-country">
        <img
          class="sticker-flag"
          :src="`https://assets.omegafox.me/copa/countries_flags/${player.team.isoCode.toLowerCase()}.png`"
          :alt="player.team.name"
        />
        {{ player.team.name }}
      </div>
    </div>
    <div class="sticker-photo">
      <div
        v-if="isLoadingImage && player.fifa.pictureId"
        class="loading-spinner"
      >
        <i
          class="pi pi-spin pi-spinner"
          style="font-size: var(--xl-font-size)"
        />
      </div>
      <img
        v-if="player.fifa.pictureId"
        :src="`https://digitalhub.fifa.com/transform/${player.fifa.pictureId.toLowerCase()}/`"
        :alt="player.name"
        @load="isLoadingImage = false"
        @error="handleImageError"
      />
      <div
        v-else
        class="placeholder-photo"
      >
        <i class="pi pi-user" />
        <span>Sem Foto</span>
      </div>
    </div>
    <div class="sticker-info">
      <div
        class="sticker-number"
        :style="{ color: player.team.colors[0], backgroundColor: player.team.colors[1] }"
      >
        {{ player.number }}
      </div>
      <div class="sticker-name">
        {{ player.name }}
      </div>
      <div class="sticker-position">
        {{ player.position.description }}
      </div>
      <div class="sticker-details">
        <div class="detail-item">
          <i class="pi pi-calendar" />
          <span>{{ formatBirthDate(player.dateOfBirth) }}</span>
        </div>
        <div class="detail-item">
          <i class="pi pi-arrows-v" />
          <span>{{ player.height }} cm</span>
        </div>
        <div class="detail-item">
          <i class="pi pi-shield" />
          <span>{{ player.club.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import type { IPlayer } from '@/stores/teams.types';

defineProps<{
  player: IPlayer | null;
}>();

// ------ Refs ------
const isLoadingImage = ref(true);

// ------ Functions ------
function formatBirthDate(dateString: string): string {
  const date = new Date(dateString);
  const age = new Date().getFullYear() - date.getFullYear();
  return `${age} anos`;
}

function handleImageError(e: Event) {
  isLoadingImage.value = false;
  const target = e.target as HTMLImageElement;
  target.style.display = 'none';
}
</script>

<style lang="scss" scoped>
.panini-sticker {
  position: relative;
  width: 220px;
  padding: 6px;
  overflow: hidden;
  border-radius: var(--border-radius);
  box-shadow:
    0 4px 8px rgb(0 0 0 / 20%),
    0 0 20px rgb(255 215 0 / 30%);

  &::before {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    content: '';
    background: var(--team-gradient, linear-gradient(90deg, #ffd700 0%, #ffed4e 100%));
    border-radius: var(--border-radius);
  }

  &::after {
    position: absolute;
    top: -50%;
    left: -50%;
    z-index: -1;
    width: 200%;
    height: 200%;
    pointer-events: none;
    content: '';
    background: linear-gradient(90deg, transparent 30%, rgb(255 255 255 / 40%) 50%, transparent 70%);
    border-radius: var(--border-radius);
    animation: shimmer 3s infinite;
  }
}

.sticker-header {
  position: relative;
  padding: var(--s-spacing);
  overflow: hidden;
  font-weight: bold;
  color: white;
  text-align: center;
  text-shadow: 0 2px 8px rgb(0 0 0 / 50%);
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);

  &::after {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    content: '';
    background: linear-gradient(to bottom, rgb(0 0 0 / 30%) 0%, transparent 100%);
  }

  &::before {
    position: absolute;
    top: -50%;
    left: -50%;
    z-index: 1;
    width: 200%;
    height: 200%;
    content: '';
    background: linear-gradient(90deg, transparent 30%, rgb(255 255 255 / 15%) 50%, transparent 70%);
    animation: shimmer 3s infinite;
  }
}

.sticker-country {
  position: relative;
  z-index: 2;
  display: flex;
  gap: var(--l-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--xs-spacing) var(--s-spacing);
  font-size: var(--s-font-size);
  line-height: var(--m-font-size);
  text-transform: uppercase;
  letter-spacing: 1px;
  background: rgb(0 0 0 / 15%);
  border-radius: var(--border-radius);
  backdrop-filter: blur(4px);
}

.sticker-photo {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 150px;
  overflow: hidden;
  background: linear-gradient(to bottom, transparent 0%, #f5f5f5 100%);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
    filter: contrast(1.05) saturate(1.1);
  }
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 10;
  color: var(--bolao-c-grey4);
  transform: translate(-50%, -50%);
}

.placeholder-photo {
  display: flex;
  flex-direction: column;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--bolao-c-grey4);

  i {
    font-size: 48px;
  }

  span {
    font-size: var(--s-font-size);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.sticker-info {
  position: relative;
  padding: var(--m-spacing);
  background: white;
  border-bottom-right-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
}

.sticker-number {
  position: absolute;
  top: -20px;
  right: var(--m-spacing);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: var(--l-font-size);
  font-weight: bold;

  // background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgb(0 0 0 / 20%);
}

.sticker-name {
  padding-right: 50px;
  margin-bottom: var(--xs-spacing);
  font-size: var(--m-font-size);
  font-weight: bold;
  line-height: var(--m-font-size);
  color: var(--bolao-c-black);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sticker-position {
  margin-bottom: var(--s-spacing);
  font-size: var(--s-font-size);
  font-weight: 600;
  color: var(--bolao-c-grey5);
}

.sticker-details {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  font-size: var(--s-font-size);
  color: #555;
}

.detail-item {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;

  i {
    font-size: 0.8rem;
    color: var(--bolao-c-gold);
  }

  span {
    font-size: 0.85rem;
  }
}

.sticker-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--xxs-spacing);
  color: var(--bolao-c-black);
  background: linear-gradient(to bottom, #f5f5f5 0%, #e0e0e0 100%);
  border-top: 1px solid #ddd;
  border-bottom-right-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
}

.sticker-flag {
  width: auto;
  height: 24px;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 20%));
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%);
  }

  100% {
    transform: translateX(100%) translateY(100%);
  }
}
</style>
