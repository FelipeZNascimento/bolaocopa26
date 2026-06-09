<template>
  <div class="items-grid">
    <template v-if="isLoading">
      <WorldCupLandscapeStickerComponent
        v-for="i in 16"
        :key="i"
        loading
      />
    </template>
    <StadiumStickerComponent
      v-for="stadium in stadiums.filter((s) => s.id !== 9)"
      v-else
      v-bind:key="stadium.id"
      :stadium="stadium"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import StadiumStickerComponent from '@/components/StadiumStickerComponent.vue';
import StadiumService from '@/services/stadium';
import { useStadiumsStore } from '@/stores/stadiums';

const stadiumService = new StadiumService();
const stadiumsStore = useStadiumsStore();
const isLoading = computed(() => stadiumsStore.isLoading);
const stadiums = computed(() => stadiumsStore.stadiums);

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

  @media (width <= 425px) {
    grid-template-columns: 1fr;
  }
}
</style>
