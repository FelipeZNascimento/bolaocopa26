<template>
  <div
    class="ps-sticker"
    :class="{ 'ps-sticker--loading': loading }"
    :style="{
      '--ps-c1': player?.team.colors?.[0] ?? '#FFD700',
      '--ps-c2': player?.team.colors?.[1] ?? player?.team.colors?.[0] ?? '#FFD700',
    }"
  >
    <template v-if="loading">
      <PrimeSkeleton class="ps-sticker__skel-header" />
      <PrimeSkeleton class="ps-sticker__skel-photo" />
      <div class="ps-sticker__info">
        <PrimeSkeleton class="ps-sticker__skel-name" />
        <PrimeSkeleton class="ps-sticker__skel-sub" />
        <PrimeSkeleton class="ps-sticker__skel-detail" />
      </div>
    </template>

    <template v-else-if="player">
      <div
        class="ps-sticker__header"
        :style="{
          background: `linear-gradient(90deg, ${player.team.colors?.[0] ?? '#FFD700'}, ${player.team.colors?.[1] ?? player.team.colors?.[0] ?? '#FFD700'})`,
        }"
      >
        <img
          class="ps-sticker__flag"
          :src="`https://assets.omegafox.me/copa/countries_flags/${player.team.isoCode.toLowerCase()}.png`"
          :alt="player.team.name"
        />
        <span class="ps-sticker__team-name">{{ locale === 'pt-BR' ? player.team.name : player.team.nameEn }}</span>
        <span class="ps-sticker__number">{{ player.number }}</span>
      </div>

      <div class="ps-sticker__photo">
        <div
          v-if="isLoadingImage && player.fifa.pictureId"
          class="ps-sticker__spinner"
        >
          <i class="pi pi-spin pi-spinner" />
        </div>
        <img
          v-if="player.fifa.pictureId && !imageError"
          class="ps-sticker__img"
          :src="`https://digitalhub.fifa.com/transform/${player.fifa.pictureId.toLowerCase()}/`"
          :alt="player.name"
          @load="isLoadingImage = false"
          @error="handleImageError"
        />
        <div
          v-if="!player.fifa.pictureId || imageError"
          class="ps-sticker__fallback"
        >
          <i class="pi pi-user" />
          <span>{{ t('players.noPhoto') }}</span>
        </div>
      </div>

      <div class="ps-sticker__info">
        <span class="ps-sticker__name">{{ player.name }}</span>
        <span class="ps-sticker__position">{{
          locale === 'pt-BR' ? player.position.description : player.position.descriptionEn
        }}</span>
        <div class="ps-sticker__details">
          <div class="ps-sticker__detail-row">
            <i class="pi pi-shield" />
            <span>{{ player.club.name }}</span>
          </div>
          <div class="ps-sticker__detail-row">
            <i class="pi pi-calendar" />
            <span>{{ playerAge }} {{ t('players.years') }}</span>
          </div>
          <div class="ps-sticker__detail-row">
            <i class="pi pi-arrows-v" />
            <span>{{ player.height }} cm</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IPlayer } from '@/stores/teams.types';

const props = defineProps<{
  loading?: boolean;
  player: IPlayer | null;
}>();

const { locale, t } = useI18n();

const isLoadingImage = ref(true);
const imageError = ref(false);

watch(
  () => props.player?.id,
  () => {
    isLoadingImage.value = true;
    imageError.value = false;
  },
);

const playerAge = computed(() => {
  if (!props.player) return '';
  const birth = new Date(props.player.dateOfBirth);
  return new Date().getFullYear() - birth.getFullYear();
});

function handleImageError() {
  isLoadingImage.value = false;
  imageError.value = true;
}
</script>

<style lang="scss" scoped>
.ps-sticker {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 4px;
  overflow: hidden;
  box-shadow:
    0 6px 16px rgb(0 0 0 / 35%),
    0 0 24px rgb(from var(--ps-c1) r g b / 25%);

  &--loading {
    pointer-events: none;
    box-shadow: none;

    &::before,
    &::after {
      display: none;
    }
  }

  &::before {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    content: '';
    background: linear-gradient(160deg, var(--ps-c1), var(--ps-c2) 50%, var(--ps-c1));
  }
}

@media (prefers-reduced-motion: no-preference) {
  .ps-sticker::after {
    position: absolute;
    top: -50%;
    left: -50%;
    z-index: 3;
    width: 200%;
    height: 200%;
    pointer-events: none;
    content: '';
    background: linear-gradient(90deg, transparent 30%, rgb(255 255 255 / 15%) 50%, transparent 70%);
    animation: shimmer 3s infinite;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%);
  }

  100% {
    transform: translateX(100%) translateY(100%);
  }
}

.ps-sticker__skel-header {
  height: 40px;
}

.ps-sticker__skel-photo {
  height: 150px;
}

.ps-sticker__skel-name {
  height: 14px;
  margin-bottom: var(--xxs-spacing);
}

.ps-sticker__skel-sub {
  width: 70%;
  height: 11px;
  margin-bottom: var(--xxs-spacing);
}

.ps-sticker__skel-detail {
  height: 11px;
}

.ps-sticker__header {
  position: relative;
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  padding: var(--xs-spacing) var(--s-spacing);
  overflow: hidden;
  font-size: var(--xs-font-size);
  font-weight: 700;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 4px rgb(0 0 0 / 60%);
}

.ps-sticker__flag {
  width: auto;
  height: 16px;
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 30%));
}

.ps-sticker__team-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ps-sticker__number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: var(--xs-font-size);
  font-weight: 800;
  color: rgb(0 0 0 / 70%);
  background: rgb(255 255 255 / 85%);
  border-radius: 50%;
}

.ps-sticker__photo {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 150px;
  overflow: hidden;
  background-color: #d4d0c8;
}

.ps-sticker__spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  color: var(--bolao-c-grey5);
  transform: translate(-50%, -50%);
}

.ps-sticker__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  filter: contrast(1.05) saturate(1.1);
}

.ps-sticker__fallback {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--bolao-c-grey5);

  i {
    font-size: 40px;
  }

  span {
    font-size: var(--xs-font-size);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
}

.ps-sticker__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--xxs-spacing);
  padding: var(--s-spacing);
  background-color: var(--bolao-c-white-d1);
}

.ps-sticker__name {
  font-size: var(--xs-font-size);
  font-weight: 800;
  line-height: 1.2;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.ps-sticker__position {
  font-size: 10px;
  font-weight: 600;
  color: var(--bolao-c-grey5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ps-sticker__details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: var(--xxs-spacing);
}

.ps-sticker__detail-row {
  display: flex;
  gap: var(--xxs-spacing);
  align-items: center;
  overflow: hidden;
  font-size: 10px;
  color: var(--bolao-c-grey5);

  i {
    font-size: 9px;
    color: var(--bolao-c-gold);
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
