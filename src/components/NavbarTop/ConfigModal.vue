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
    <template #footer />
  </PrimeDialog>
</template>
<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';

import type { IUser } from '@/stores/activeProfile.types';
import type { TRankingPosition, TRankingPositionValue, TTheme, TThemeValue } from '@/stores/configuration.types';

import { useViewport } from '@/services/viewport';
import { useConfigurationStore } from '@/stores/configuration';

const props = defineProps<{
  activeProfile: IUser | null;
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const isVisible = ref(false);
const themeLocalObj = ref();
const rankingPositionLocalObj = ref();

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
const { isMobile } = useViewport();

// ------ Computed Properties ------
const rankingPosition = computed(() => configurationStore.rankingPosition);
const theme = computed(() => configurationStore.theme);

// ------ Functions  ------
function handleRankingPositionConfig(newOption: TRankingPositionValue) {
  configurationStore.setRankingPosition(newOption);
}

function handleThemeConfig(newOption: TThemeValue) {
  configurationStore.setTheme(newOption);
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
  gap: var(--m-spacing);
  justify-content: center;
  width: 100%;
}

.button-group {
  display: flex;
  align-items: center;
  justify-content: center;
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
