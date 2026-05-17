<template>
  <div class="clipboard-wrapper">
    <span
      ref="textRef"
      class="clipboard-text"
      title="Clique para copiar"
      @click="copyText"
      >{{ text }}</span
    >
  </div>
  <PrimeButton
    :icon="copied ? 'pi pi-check' : 'pi pi-copy'"
    :severity="copied ? 'success' : 'secondary'"
    variant="text"
    rounded
    :aria-label="copied ? 'Copiado!' : 'Copiar'"
    @click="copyText"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ text: string }>();

const copied = ref(false);
const textRef = ref<HTMLElement | null>(null);

async function copyText() {
  const selection = window.getSelection();
  if (selection && textRef.value) {
    const range = document.createRange();
    range.selectNodeContents(textRef.value);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  await navigator.clipboard.writeText(props.text);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 5000);
}
</script>

<style scoped>
.clipboard-wrapper {
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;
  max-width: 100%;
}

.clipboard-text {
  font-family: monospace;
  word-break: break-all;
  cursor: pointer;
  user-select: all;
  border: 1px dashed var(--p-text-muted-color);
  transition: color 0.2s;

  &:hover {
    color: var(--p-primary-color);
  }
}
</style>
