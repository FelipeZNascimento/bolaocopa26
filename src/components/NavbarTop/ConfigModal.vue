<template>
  <PrimeDialog
    v-model:visible="isVisible"
    dismissable-mask
    modal
    :draggable="false"
    position="center"
    :style="{ width: '500px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h2>Configurações</h2>
    </template>
    <h2>Tema</h2>
    <div class="button-group">
      <div class="label">
        Tema
      </div>
      <PrimeSelectButton
        v-model="themeLocalObj"
        fluid
        :allow-empty="false"
        class="buttons"
        :options="themeOptions"
        option-label="label"
        data-key="label"
        size="small"
        @click="() => handleThemeConfig(themeLocalObj.value)"
      />
    </div>
    <PrimeDivider />
    <h2>Ranking</h2>
    <div
      v-if="!isMobile"
      class="button-group"
    >
      <div class="label">
        Posição
      </div>
      <PrimeSelectButton
        v-model="rankingPositionLocalObj"
        fluid
        :allow-empty="false"
        class="buttons"
        :options="rankingPositionOptions"
        option-label="label"
        data-key="label"
        size="small"
        @click="() => handleRankingPositionConfig(rankingPositionLocalObj.value)"
      />
    </div>
    <PrimeDivider />
    <h2>Preferências</h2>
    <div class="button-group">
      <div class="label">
        Favoritos ({{ favoritesCount }})
      </div>
      <div>
        <PrimeButton
          class="buttons"
          label="Remover Todos"
          severity="danger"
          icon="pi pi-trash"
          @click="handleClearFavorites"
        />
      </div>
    </div>
    <template #footer />
  </PrimeDialog>
</template>
<script setup lang="ts">
import { isMobile } from '@basitcodeenv/vue3-device-detect';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';

import type { IUser } from '@/stores/activeProfile.types';
import type { TRankingPosition, TRankingPositionValue, TTheme, TThemeValue } from '@/stores/configuration.types';

import FavoritesService from '@/services/favorites';
import { useConfigurationStore } from '@/stores/configuration';
import { useNotificationStore } from '@/stores/notification';

const props = defineProps<{
  activeProfile: IUser | null;
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const isVisible = ref(false);
const themeLocalObj = ref();
const rankingPositionLocalObj = ref();
const favoritesCount = ref(0);

const themeOptions = ref<TTheme[]>([
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' },
]);
const rankingPositionOptions = ref<TRankingPosition[]>([
  { label: 'Sempre ativo', value: 'active' },
  { label: 'Escondido', value: 'modal' },
]);

// ------ Initialization ------
const configurationStore = useConfigurationStore();
const favoritesService = new FavoritesService();
const notificationStore = useNotificationStore();

onMounted(() => {
  loadFavoritesCount();
});

// ------ Computed Properties ------
const rankingPosition = computed(() => configurationStore.rankingPosition);
const theme = computed(() => configurationStore.theme);

// ------ Functions  ------
function handleClearFavorites() {
  if (favoritesCount.value > 0 && props.activeProfile) {
    favoritesService.clearAllFavorites(props.activeProfile.id);
    loadFavoritesCount();
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('favorites-cleared'));
  }
  notificationStore.success('Todos os favoritos foram removidos');
}

function handleRankingPositionConfig(newOption: TRankingPositionValue) {
  configurationStore.setRankingPosition(newOption);
}

function handleThemeConfig(newOption: TThemeValue) {
  configurationStore.setTheme(newOption);
}
function loadFavoritesCount() {
  if (props.activeProfile) {
    favoritesCount.value = favoritesService.getFavoritesCount(props.activeProfile.id);
  } else {
    favoritesCount.value = 0;
  }
}

// ------ Watch Effect Properties ------
watchEffect(() => (themeLocalObj.value = themeOptions.value.find((option) => option.value === theme.value)));

watchEffect(
  () =>
    (rankingPositionLocalObj.value = rankingPositionOptions.value.find(
      (option) => option.value === rankingPosition.value,
    )),
);

// ------ Watches ------
watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue) {
      isVisible.value = true;
      loadFavoritesCount();
    }
  },
);

watch(isVisible, async (newValue) => {
  if (!newValue) {
    props.handleCloseModal();
  }
});
</script>
<style scoped>
.input {
  padding-bottom: var(--m-spacing);
}

.buttons-container {
  display: flex;
  justify-content: center;
  gap: var(--m-spacing);
  width: 100%;
}

.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: var(--xxs-spacing) 0;

  .label {
    flex: 2;
  }

  .buttons {
    flex: 3;
  }
}
</style>
