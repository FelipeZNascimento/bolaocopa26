<template>
  <PrimeDialog
    dismissableMask
    modal
    :breakpoints="{ '1024': '75vw', '575px': '95vw' }"
    v-model:visible="isVisible"
    :draggable="false"
    position="top"
    contentClass="content-class"
  >
    <template #header>
      <h2>Ranking</h2>
    </template>
    <RankingComponent isModal />
  </PrimeDialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';

import RankingComponent from './RankingComponent.vue';

const props = defineProps<{
  handleCloseModal: () => void;
  isOpen: boolean;
}>();

// ------ Refs ------
const isVisible = ref(false);

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
<style>
.input {
  padding-bottom: var(--m-spacing);
}

.buttons-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: var(--m-spacing);
}

.signup-button {
  width: 100%;
}

.content-class {
  padding: 0 !important;
  overflow-x: hidden !important;
}
</style>
