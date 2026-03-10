<template>
  <PrimeDialog
    dismissableMask
    modal
    v-model:visible="isVisible"
    :draggable="false"
    position="right"
    :style="{ width: '500px' }"
    :breakpoints="{ '1280px': '75vw', '575px': '90vw' }"
  >
    <template #header>
      <h2>Configurações</h2>
    </template>
    <h2>Tema</h2>
    <div class="button-group">
      <div class="label">Tema</div>
      <PrimeSelectButton
        fluid
        :allowEmpty="false"
        class="buttons"
        v-model="themeLocalObj"
        :options="themeOptions"
        optionLabel="label"
        dataKey="label"
        size="small"
        @click="() => handleThemeConfig(themeLocalObj.value)"
      />
    </div>
    <PrimeDivider />
    <h2>Resultados</h2>
    <div class="button-group">
      <div class="label">Mostrar</div>
      <PrimeSelectButton
        fluid
        :allowEmpty="false"
        class="buttons"
        v-model="gamesViewLocalObj"
        :options="gamesViewOptions"
        optionLabel="label"
        dataKey="label"
        size="small"
        @click="() => handleGamesViewConfig(gamesViewLocalObj.value)"
      />
    </div>
    <PrimeDivider />

    <h2>Ranking</h2>
    <div class="button-group" v-if="!isMobile">
      <div class="label">Posição</div>
      <PrimeSelectButton
        fluid
        :allowEmpty="false"
        class="buttons"
        v-model="rankingPositionLocalObj"
        :options="rankingPositionOptions"
        optionLabel="label"
        dataKey="label"
        size="small"
        @click="() => handleRankingPositionConfig(rankingPositionLocalObj.value)"
      />
    </div>
    <div class="button-group">
      <div class="label">Espaçamento</div>
      <PrimeSelectButton
        fluid
        :allowEmpty="false"
        class="buttons"
        v-model="rowSpacingLocalObj"
        :options="rowSpacingOptions"
        optionLabel="label"
        dataKey="label"
        size="small"
        @click="() => handleRowSpacingConfig(rowSpacingLocalObj.value)"
      />
    </div>
    <div class="button-group">
      <div class="label">Modo</div>
      <PrimeSelectButton
        fluid
        :allowEmpty="false"
        class="buttons"
        v-model="columnLocalObj"
        :options="columnOptions"
        optionLabel="label"
        dataKey="label"
        size="small"
        @click="() => handleColumnConfig(columnLocalObj.value)"
      />
    </div>
    <PrimeDivider />
    <h2>Preferências</h2>
    <div class="button-group">
      <div class="label">Favoritos ({{ favoritesCount }})</div>
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
    <template #footer> </template>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { isMobile } from '@basitcodeenv/vue3-device-detect';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';

import type { IUser } from '@/stores/activeProfile.types';
import type {
  TColumn,
  TColumnsValue,
  TGamesView,
  TGamesViewValue,
  TRankingPosition,
  TRankingPositionValue,
  TRowSpacing,
  TRowSpacingValue,
  TTheme,
  TThemeValue,
} from '@/stores/configuration.types';

import FavoritesService from '@/services/favorites';
import { useConfigurationStore } from '@/stores/configuration';
import { useNotificationStore } from '@/stores/notification';
import { useRankingStore } from '@/stores/ranking';

const props = defineProps<{
  activeProfile: IUser | null;
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const isVisible = ref(false);
const themeLocalObj = ref();
const gamesViewLocalObj = ref();
const rankingPositionLocalObj = ref();
const rowSpacingLocalObj = ref();
const columnLocalObj = ref();
const favoritesCount = ref(0);

const themeOptions = ref<TTheme[]>([
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' },
]);
const rankingPositionOptions = ref<TRankingPosition[]>([
  { label: 'Sempre ativo', value: 'active' },
  { label: 'Modal (menu)', value: 'modal' },
]);
const gamesViewOptions = ref<TGamesView[]>([
  { label: 'Grid', value: 'grid' },
  { label: 'Linhas', value: 'lines' },
]);
const rowSpacingOptions = ref<TRowSpacing[]>([
  { label: 'Pequeno', value: 'small' },
  { label: 'Grande', value: 'normal' },
]);
const columnOptions = ref<TColumn[]>([
  { label: 'Compacto', value: 'compact' },
  { label: 'Completo', value: 'complete' },
]);

// ------ Initialization ------
const rankingStore = useRankingStore();
const configurationStore = useConfigurationStore();
const favoritesService = new FavoritesService();
const notificationStore = useNotificationStore();

onMounted(() => {
  loadFavoritesCount();
});

// ------ Computed Properties ------
const rankingPosition = computed(() => configurationStore.rankingPosition);
const columnConfig = computed(() => rankingStore.columnsOption);
const rowSpacingConfig = computed(() => rankingStore.rowSpacing);
const theme = computed(() => configurationStore.theme);
const gamesView = computed(() => configurationStore.gamesView);

// ------ Functions  ------
function handleClearFavorites() {
  console.log('Clearing all favorites, current count:', favoritesCount.value);
  if (favoritesCount.value > 0 && props.activeProfile) {
    favoritesService.clearAllFavorites(props.activeProfile.id);
    loadFavoritesCount();
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('favorites-cleared'));
  }
  notificationStore.success('Todos os favoritos foram removidos');
}

function handleColumnConfig(newOption: TColumnsValue) {
  rankingStore.setColumnsOption(newOption);
}

function handleGamesViewConfig(newOption: TGamesViewValue) {
  configurationStore.setGamesView(newOption);
}

function handleRankingPositionConfig(newOption: TRankingPositionValue) {
  configurationStore.setRankingPosition(newOption);
}

function handleRowSpacingConfig(newOption: TRowSpacingValue) {
  rankingStore.setRowSpacing(newOption);
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
watchEffect(
  () => (gamesViewLocalObj.value = gamesViewOptions.value.find((option) => option.value === gamesView.value)),
);

watchEffect(() => (themeLocalObj.value = themeOptions.value.find((option) => option.value === theme.value)));

watchEffect(
  () =>
    (rankingPositionLocalObj.value = rankingPositionOptions.value.find(
      (option) => option.value === rankingPosition.value,
    )),
);

watchEffect(
  () => (rowSpacingLocalObj.value = rowSpacingOptions.value.find((option) => option.value === rowSpacingConfig.value)),
);

watchEffect(() => (columnLocalObj.value = columnOptions.value.find((option) => option.value === columnConfig.value)));

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
