<template>
  <div style="min-width: 100px">
    <div
      v-if="title"
      style="font-size: var(--xs-font-size); text-align: center"
    >
      {{ t(title) }}
    </div>
    <div
      class="team-card"
      :class="{ selected: isSelected, clickable: !!handleClick }"
      @click="!isLoading && handleClick?.(team)"
    >
      <span
        v-if="counter !== undefined"
        class="counter-badge"
        >{{ counter }}</span
      >
      <!-- Overlay spinner when updating -->
      <div
        v-if="isLoading"
        class="update-overlay"
      ></div>
      <div class="flag-container">
        <img
          :src="`https://assets.omegafox.me/copa/countries_flags/${team.isoCode.toLowerCase()}.png`"
          :alt="`${locale === 'pt-BR' ? team.name : team.nameEn} Flag`"
          class="team-flag"
        />
      </div>
      <div class="team-name">
        {{ locale === 'pt-BR' ? team.name : team.nameEn }}
      </div>
      <div
        v-if="seeMore"
        class="see-more"
      >
        <i class="pi pi-plus-circle" />
        {{ t('common.seeMore') }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { ITeam } from '@/stores/teams.types';

defineProps<{
  counter?: number;
  handleClick?: (team: ITeam) => void;
  isLoading: boolean;
  isSelected?: boolean;
  seeMore?: boolean;
  team: ITeam;
  title?: string;
}>();

const { locale, t } = useI18n();
</script>
<style lang="scss" scoped>
.update-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0 0 0 / 30%);
  border-radius: var(--border-radius);
  backdrop-filter: blur(2px);
}

.team-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  min-height: 100px;
  padding: 0;
  overflow: hidden;
  background: linear-gradient(150deg, var(--bolao-c-blue3-t3) 0%, var(--bolao-c-blue5-t2) 60%);
  border: 2px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);
  box-shadow: 0 3px 8px rgb(0 0 0 / 25%);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  // Diagonal shimmer line
  &::before {
    position: absolute;
    inset: 0;
    pointer-events: none;
    content: '';
    background: linear-gradient(135deg, rgb(255 255 255 / 6%) 25%, transparent 25%);
  }

  &.clickable {
    cursor: pointer;

    &:hover {
      border-color: var(--bolao-c-blue1);
      box-shadow: 0 6px 16px rgb(0 0 0 / 35%);
      transform: translateY(-3px) scale(1.02);
    }

    &:active {
      transform: scale(0.97);
    }
  }

  &.selected {
    background: linear-gradient(150deg, var(--bolao-c-blue2) 0%, var(--bolao-c-blue4) 60%);
    border-color: var(--bolao-c-gold);
    box-shadow:
      0 0 0 3px var(--bolao-c-gold-t1),
      0 4px 12px rgb(0 0 0 / 30%);

    .team-name {
      color: var(--bolao-c-gold);
    }
  }

  @media (width <= 768px) {
    min-height: 75px;
  }
}

.flag-container {
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding-top: var(--s-spacing);
}

.team-flag {
  width: 64px;
  height: 40px;
  object-fit: cover;
  border-radius: 3px;
  filter: drop-shadow(0 2px 6px rgb(0 0 0 / 40%));

  @media (width <= 768px) {
    width: 44px;
    height: 28px;
  }
}

.team-name {
  width: 100%;
  padding: var(--xxs-spacing) var(--xs-spacing) var(--xs-spacing);
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--xs-font-size);
  font-weight: 700;
  line-height: 1.2;
  color: var(--bolao-c-grey1);
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.04em;

  // white-space: nowrap;

  @media (width <= 768px) {
    font-size: 9px;
    letter-spacing: 0.02em;
  }
}

.see-more {
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  margin: var(--xs-spacing) 0;
  color: var(--color-contrast);

  @media (width <= 768px) {
    font-size: var(--xxs-font-size);

    i {
      font-size: var(--xs-font-size);
    }
  }
}

.counter-badge {
  position: absolute;
  top: var(--xs-spacing);
  left: var(--xs-spacing);
  z-index: 1;
  min-width: 1.4rem;
  padding: 0 var(--xxs-spacing);
  font-size: var(--xs-font-size);
  font-weight: 700;
  line-height: 1.4rem;
  color: var(--bolao-c-white);
  text-align: center;
  background-color: var(--bolao-c-blue1);
  border-radius: 999px;
}
</style>
