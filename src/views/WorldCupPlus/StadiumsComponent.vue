<template>
  <div class="items-grid">
    <template v-if="isLoading">
      <WorldCupLandscapeStickerComponent
        v-for="i in 16"
        :key="i"
        loading
      />
    </template>

    <WorldCupLandscapeStickerComponent
      v-for="stadium in stadiums.filter((s) => s.id !== 9)"
      v-else
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
        {{ stadium.city }}
      </template>

      <template #overlay>
        <strong class="overlay-name">{{ stadium.name }}</strong>
        <span class="overlay-sub">
          <img
            :src="`https://assets.omegafox.me/copa/countries_flags/${stadium.isoCode.toLowerCase()}.png`"
            :alt="`${locale === 'pt-BR' ? stadium.country : stadium.countryEn} Flag`"
            class="overlay-flag"
          />
          {{ locale === 'pt-BR' ? stadium.country : stadium.countryEn }}
        </span>
      </template>

      <template #back>
        <div class="back-header">
          <img
            :src="`https://assets.omegafox.me/copa/countries_flags/${stadium.isoCode.toLowerCase()}.png`"
            :alt="`${locale === 'pt-BR' ? stadium.country : stadium.countryEn} Flag`"
            class="back-flag"
          />
          <span class="back-city">{{ stadium.city }}</span>
        </div>
        <div class="back-info">
          <strong class="back-name">{{ stadium.name }}</strong>
          <div class="back-row">
            <i class="pi pi-map-marker" />
            <span>{{ locale === 'pt-BR' ? stadium.country : stadium.countryEn }}</span>
          </div>
          <div class="back-row">
            <i class="pi pi-map-marker" />
            <span>{{ stadium.geoLatitude }}, {{ stadium.geoLongitude }}</span>
          </div>

          <div class="back-row">
            <i class="pi pi-users" />
            <span>{{ stadium.capacity.toLocaleString(locale) }}</span>
          </div>
          <PrimeButton
            rel="noopener noreferrer"
            class="link-row"
            icon="pi pi-search-plus"
            :label="t('common.seeMore')"
            @click="(event: MouseEvent) => onStadiumClick(stadium, event)"
          />
        </div>
      </template>
    </WorldCupLandscapeStickerComponent>
  </div>
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
      {{ locale === 'pt-BR' ? lightbox.stadium?.country : lightbox.stadium?.countryEn }} -
      {{ lightbox.stadium?.name }}
    </template>
    <img
      :src="`https://assets.omegafox.me/copa/2026/stadiums/${lightbox.stadium?.id}.png`"
      :alt="lightbox.stadium?.name"
      style="display: block; max-width: 70vw; max-height: 70vh"
    />
  </PrimeDialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { IStadium } from '@/stores/matches.types';

import WorldCupLandscapeStickerComponent from '@/components/WorldCupLandscapeStickerComponent.vue';
import StadiumService from '@/services/stadium';
import { useStadiumsStore } from '@/stores/stadiums';

const stadiumService = new StadiumService();
const stadiumsStore = useStadiumsStore();
const { locale, t } = useI18n();

const lightbox = ref({ stadium: null as IStadium | null, visible: false });
const isLoading = computed(() => stadiumsStore.isLoading);
const stadiums = computed(() => stadiumsStore.stadiums);
const imageErrors = reactive<Record<number, boolean>>({});

function onStadiumClick(stadium: IStadium, event: MouseEvent) {
  openImage(stadium);
  event.stopPropagation();
}
function openImage(stadium: IStadium) {
  lightbox.value = { stadium, visible: true };
}

stadiumService.fetch();
</script>

<style lang="scss" scoped>
.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--l-spacing);
  width: 100%;

  @media (width <= 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--m-spacing);
  }

  @media (width <= 380px) {
    grid-template-columns: 1fr;
  }
}

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
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;
  padding: var(--xs-spacing) var(--s-spacing);
  background: linear-gradient(90deg, var(--sticker-color), var(--sticker-color-dark));
}

.back-flag {
  height: 18px;
  border-radius: 2px;
}

.back-city {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 11px;
  font-weight: 700;
  color: rgb(0 0 0 / 80%);
  text-transform: uppercase;
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
  font-size: var(--xs-font-size);
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
  font-size: 11px;
  font-weight: 600;
  color: #444;

  i {
    font-size: 11px;
    color: var(--sticker-color-dark);
  }
}

.link-row {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  color: #444;
}
</style>
