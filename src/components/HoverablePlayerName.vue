<template>
  <span
    class="player-name-hover"
    :style="{ textAlign: textAlign }"
    @mouseenter="(e) => showPlayerSticker(e, player)"
    @mouseleave="hidePlayerSticker"
  >
    <i class="pi pi-window-maximize" />
    {{ player.name }}
  </span>
  <!-- Panini Sticker Popover -->
  <PrimePopover
    ref="playerPopover"
    class="player-sticker-popover"
    @mouseenter="onPopoverMouseEnter"
    @mouseleave="onPopoverMouseLeave"
  >
    <div class="player-sticker-wrapper">
      <PlayerStickerComponent :player="selectedPlayer" />
    </div>
  </PrimePopover>
</template>
<script setup lang="ts">
import { ref } from 'vue';

import type { IPlayer } from '@/stores/teams.types';

import PlayerStickerComponent from '@/components/PlayerStickerComponent.vue';
defineProps<{
  player: IPlayer;
  textAlign?: 'left' | 'right';
}>();

// ------ Refs ------
const playerPopover = ref();
const selectedPlayer = ref<IPlayer | null>(null);
const hideTimeout = ref<null | number>(null);
const isPopoverHovered = ref(false);

function clearHideTimeout() {
  if (hideTimeout.value !== null) {
    clearTimeout(hideTimeout.value);
    hideTimeout.value = null;
  }
}

function hidePlayerSticker() {
  scheduleHidePlayerSticker();
}

function onPopoverMouseEnter() {
  isPopoverHovered.value = true;
  clearHideTimeout();
}

function onPopoverMouseLeave() {
  isPopoverHovered.value = false;
  scheduleHidePlayerSticker();
}

function scheduleHidePlayerSticker() {
  clearHideTimeout();
  hideTimeout.value = window.setTimeout(() => {
    playerPopover.value?.hide();
    selectedPlayer.value = null;
    hideTimeout.value = null;
  }, 200);
}

function showPlayerSticker(event: MouseEvent, player: IPlayer) {
  clearHideTimeout();
  // Don't update if user is actively hovering over the popover
  if (isPopoverHovered.value) {
    return;
  }
  // Ensure popover is mounted and event has a valid target
  if (!playerPopover.value || !event.target) {
    return;
  }
  selectedPlayer.value = player;
  playerPopover.value?.show(event);
}
</script>
<style lang="scss" scoped>
.player-name-hover {
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--bolao-c-gold);
    text-decoration-style: solid;
  }

  i {
    font-size: var(--xs-font-size);
  }
}

.player-sticker-wrapper {
  width: 200px;
}

:deep(.player-sticker-popover) {
  .p-popover {
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: 0 10px 40px rgb(0 0 0 / 50%);
  }
}
</style>
