<template>
  <WorldCupLandscapeStickerComponent
    :key="stadium.id"
    flippable
  >
    <template #photo>
      <img
        v-if="!imageErrors[stadium.id]"
        :src="`https://assets.omegafox.me/copa/2026/stadiums/${stadium.id}.png`"
        :alt="stadium.name"
        class="sticker-image"
        loading="lazy"
        @error="imageErrors[stadium.id] = true"
      />
      <div
        v-else
        class="sticker-photo-fallback"
      >
        <i class="pi pi-map-marker" />
      </div>
    </template>

    <template #badge>
      {{ stadium.name }}
    </template>

    <template #overlay>
      <span class="overlay-sub">
        <img
          :src="`https://assets.omegafox.me/copa/countries_flags/${stadium.isoCode.toLowerCase()}.png`"
          :alt="`${locale === 'pt-BR' ? stadium.country : stadium.countryEn} Flag`"
          class="overlay-flag"
        />
        {{ stadium.city }}, {{ locale === 'pt-BR' ? stadium.country : stadium.countryEn }}
      </span>
    </template>

    <template #back>
      <div class="back-header">
        {{ stadium.name }}
      </div>
      <div class="back-info">
        <div class="back-row">
          <img
            :src="`https://assets.omegafox.me/copa/countries_flags/${stadium.isoCode.toLowerCase()}.png`"
            :alt="`${locale === 'pt-BR' ? stadium.country : stadium.countryEn} Flag`"
            class="overlay-flag"
          />
          <span class="back-city">
            {{ stadium.city }}, {{ locale === 'pt-BR' ? stadium.country : stadium.countryEn }}</span
          >
        </div>

        <div class="back-row">
          <i class="pi pi-users" />
          <span>{{ stadium.capacity.toLocaleString(locale) }}</span>
        </div>
        <div class="back-row">
          <i class="pi pi-map-marker" />
          <a
            :href="'https://www.google.com/maps?q=' + stadium.geoLatitude + ',' + stadium.geoLongitude"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Maps
          </a>
        </div>
        <div>
          <PrimeButton
            rel="noopener noreferrer"
            class="link-row"
            icon="pi pi-search-plus"
            :label="t('common.seeMore')"
            size="small"
            @click="(event: MouseEvent) => onStadiumClick(stadium, event)"
          />
        </div>
      </div>
    </template>
  </WorldCupLandscapeStickerComponent>

  <PrimeDialog
    v-model:visible="lightbox.visible"
    dismissable-mask
    modal
    :draggable="false"
    :style="{ maxWidth: '90vw', width: 'fit-content' }"
  >
    <template #header>
      <img
        :src="`https://assets.omegafox.me/copa/countries_flags/${lightbox.stadium?.isoCode.toLowerCase()}.png`"
        :alt="`${locale === 'pt-BR' ? lightbox.stadium?.country : lightbox.stadium?.countryEn} Flag`"
        class="overlay-flag"
      />
      <span class="dialog-header-text">
        {{ locale === 'pt-BR' ? lightbox.stadium?.country : lightbox.stadium?.countryEn }} -
        {{ lightbox.stadium?.name }}
      </span>
    </template>
    <img
      :src="`https://assets.omegafox.me/copa/2026/stadiums/${lightbox.stadium?.id}.png`"
      :alt="lightbox.stadium?.name"
      style="display: block; max-width: 70vw; max-height: 70vh"
    />
  </PrimeDialog>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IStadium } from '@/stores/matches.types';

import WorldCupLandscapeStickerComponent from '@/components/WorldCupLandscapeStickerComponent.vue';

defineProps<{
  stadium: IStadium;
}>();

const { locale, t } = useI18n();
const imageErrors = reactive<Record<number, boolean>>({});
const lightbox = ref({ stadium: null as IStadium | null, visible: false });

function onStadiumClick(stadium: IStadium, event: MouseEvent) {
  openImage(stadium);
  event.stopPropagation();
}

function openImage(stadium: IStadium) {
  lightbox.value = { stadium, visible: true };
}
</script>
<style lang="scss" scoped>
// Front face content
.sticker-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  filter: contrast(1.05) saturate(1.1);
}

.sticker-photo-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #d4d0c8;

  i {
    font-size: 3rem;
    color: #9a9080;
  }
}

.overlay-name {
  display: block;
  font-size: var(--s-font-size);
  font-weight: 800;
  line-height: 1.2;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.overlay-sub {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 11px;
  color: rgb(255 255 255 / 75%);
}

.overlay-flag {
  height: 12px;
  border-radius: 2px;
}

// Back face content
.back-header {
  font-size: var(--xs-font-size);
  font-weight: 700;
  color: rgb(0 0 0 / 80%);
  text-transform: uppercase;

  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  padding: var(--xs-spacing) var(--s-spacing);
  background: linear-gradient(90deg, var(--sticker-color), var(--sticker-color-dark));

  @media (width <= 768px) {
    font-size: var(--xxs-font-size);
  }
}

.back-flag {
  height: 18px;
  border-radius: 2px;
}

.back-city {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--xxs-font-size);
  font-weight: 700;
  color: rgb(0 0 0 / 80%);
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.back-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--xs-spacing);
  justify-content: center;
  padding: var(--s-spacing) var(--m-spacing);
}

.back-name {
  font-size: var(--s-font-size);
  font-weight: 800;
  line-height: 1.2;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.back-row {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: var(--xs-font-size);
  font-weight: 600;
  color: #444;

  i {
    font-size: var(--m-font-size);
    color: var(--sticker-color-dark);
  }
}

.link-row {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: var(--xs-font-size);
  font-weight: 600;
  color: #444;
}

.dialog-header-text {
  margin-left: var(--xs-spacing);
  font-size: var(--m-font-size);
  font-weight: 600;

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
}
</style>
