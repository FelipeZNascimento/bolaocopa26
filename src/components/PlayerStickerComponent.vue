<template>
  <div
    v-if="player"
    class="panini-sticker"
    :style="{ '--team-gradient': `linear-gradient(90deg, ${player.team.colors || '#FFD700'})` }"
  >
    <div class="sticker-header" :style="{ background: `linear-gradient(90deg, ${player.team.colors || '#FFD700'})` }">
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
      <img
        :src="`https://digitalhub.fifa.com/transform/${player.fifa.pictureId.toLowerCase()}/`"
        :alt="player.name"
        @error="(e) => ((e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x250?text=No+Photo')"
      />
    </div>
    <div class="sticker-info">
      <div class="sticker-number" :style="{ color: player.team.colors[0], backgroundColor: player.team.colors[1] }">
        {{ player.number }}
      </div>
      <div class="sticker-name">{{ player.name }}</div>
      <div class="sticker-position">{{ player.position.description }}</div>
      <div class="sticker-details">
        <div class="detail-item">
          <i class="pi pi-calendar"></i>
          <span>{{ formatBirthDate(player.dateOfBirth) }}</span>
        </div>
        <div class="detail-item">
          <i class="pi pi-arrows-v"></i>
          <span>{{ player.height }} cm</span>
        </div>
        <div class="detail-item">
          <i class="pi pi-shield"></i>
          <span>{{ player.club.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IPlayer } from '@/stores/matches.types';

defineProps<{
  player: IPlayer | null;
}>();

// ------ Functions ------
function formatBirthDate(dateString: string): string {
  const date = new Date(dateString);
  const age = new Date().getFullYear() - date.getFullYear();
  return `${age} anos`;
}
</script>

<style lang="scss" scoped>
.panini-sticker {
  width: 220px;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(255, 215, 0, 0.3);
  position: relative;
  padding: 6px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--team-gradient, linear-gradient(90deg, #ffd700 0%, #ffed4e 100%));
    border-radius: var(--border-radius);
    z-index: -1;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(90deg, transparent 30%, rgba(255, 255, 255, 0.4) 50%, transparent 70%);
    animation: shimmer 3s infinite;
    z-index: -1;
    border-radius: var(--border-radius);
    pointer-events: none;
  }
}

.sticker-header {
  padding: var(--s-spacing);
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  text-align: center;
  color: white;
  font-weight: bold;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, transparent 100%);
    pointer-events: none;
    z-index: 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(90deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%);
    animation: shimmer 3s infinite;
    z-index: 1;
  }
}

.sticker-country {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--l-spacing);

  font-size: var(--s-font-size);
  line-height: var(--m-font-size);
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  z-index: 2;
  padding: var(--xs-spacing) var(--s-spacing);
  border-radius: var(--border-radius);
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.15);
}

.sticker-photo {
  width: 100%;
  height: 150px;
  background: linear-gradient(to bottom, transparent 0%, #f5f5f5 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  position: relative;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: top;
    filter: contrast(1.05) saturate(1.1);
  }
}

.sticker-info {
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  padding: var(--m-spacing);
  background: white;
  position: relative;
}

.sticker-number {
  position: absolute;
  top: -20px;
  right: var(--m-spacing);
  // background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  font-size: var(--l-font-size);
  font-weight: bold;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid white;
}

.sticker-name {
  font-size: var(--m-font-size);
  font-weight: bold;
  color: var(--bolao-c-black);
  margin-bottom: var(--xs-spacing);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-right: 50px;
  line-height: var(--m-font-size);
}

.sticker-position {
  font-size: var(--s-font-size);
  color: var(--bolao-c-grey5);
  font-weight: 600;
  margin-bottom: var(--s-spacing);
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
  align-items: center;
  gap: var(--s-spacing);

  i {
    color: var(--bolao-c-gold);
    font-size: 0.8rem;
  }

  span {
    font-size: 0.85rem;
  }
}

.sticker-footer {
  padding: var(--xxs-spacing);
  background: linear-gradient(to bottom, #f5f5f5 0%, #e0e0e0 100%);
  border-bottom-right-radius: var(--border-radius);
  border-bottom-left-radius: var(--border-radius);
  color: var(--bolao-c-black);
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #ddd;
}

.sticker-flag {
  height: 24px;
  width: auto;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
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
