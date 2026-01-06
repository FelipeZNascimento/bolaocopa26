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
        v-model="resultsViewLocalObj"
        :options="resultsViewOptions"
        optionLabel="label"
        dataKey="label"
        size="small"
        @click="() => handleResultsViewConfig(resultsViewLocalObj.value)"
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
    <template #footer> </template>
  </PrimeDialog>
</template>
<script setup lang="ts">
import { isMobile } from '@basitcodeenv/vue3-device-detect';
import { computed, ref, watch, watchEffect } from 'vue';

import type {
  TColumn,
  TColumnsValue,
  TRankingPosition,
  TRankingPositionValue,
  TResultsView,
  TResultsViewValue,
  TRowSpacing,
  TRowSpacingValue,
  TTheme,
  TThemeValue,
} from '@/stores/configuration.types';

import { useConfigurationStore } from '@/stores/configuration';
import { useRankingStore } from '@/stores/ranking';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const isVisible = ref(false);
const themeLocalObj = ref();
const resultsViewLocalObj = ref();
const rankingPositionLocalObj = ref();
const rowSpacingLocalObj = ref();
const columnLocalObj = ref();
const themeOptions = ref<TTheme[]>([
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' },
]);
const rankingPositionOptions = ref<TRankingPosition[]>([
  { label: 'Sempre ativo', value: 'active' },
  { label: 'Modal (menu)', value: 'modal' },
]);
const resultsViewOptions = ref<TResultsView[]>([
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

// ------ Computed Properties ------
const rankingPosition = computed(() => configurationStore.rankingPosition);
const columnConfig = computed(() => rankingStore.columnsOption);
const rowSpacingConfig = computed(() => rankingStore.rowSpacing);
const theme = computed(() => configurationStore.theme);
const resultsView = computed(() => configurationStore.resultsView);

// ------ Functions  ------
function handleColumnConfig(newOption: TColumnsValue) {
  rankingStore.setColumnsOption(newOption);
}

function handleRankingPositionConfig(newOption: TRankingPositionValue) {
  configurationStore.setRankingPosition(newOption);
}

function handleResultsViewConfig(newOption: TResultsViewValue) {
  configurationStore.setResultsView(newOption);
}

function handleRowSpacingConfig(newOption: TRowSpacingValue) {
  rankingStore.setRowSpacing(newOption);
}

function handleThemeConfig(newOption: TThemeValue) {
  configurationStore.setTheme(newOption);
}

// ------ Watch Effect Properties ------
watchEffect(
  () => (resultsViewLocalObj.value = resultsViewOptions.value.find((option) => option.value === resultsView.value)),
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
