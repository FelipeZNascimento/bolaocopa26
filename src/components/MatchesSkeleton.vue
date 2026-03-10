<template>
  <span
    :class="{
      'outer-skeleton-line': view === 'lines',
      'outer-skeleton-grid': view === 'grid',
    }"
  >
    <PrimeSkeleton
      v-for="index in 16"
      :key="index"
      :class="{
        'skeleton-match-line': view === 'lines',
        'skeleton-match-grid': view === 'grid',
      }"
    />
  </span>
</template>
<script lang="ts" setup>
defineProps<{
  view: 'grid' | 'lines';
}>();
</script>
<style lang="scss" scoped>
.outer-skeleton-line {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

.outer-skeleton-grid {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--m-spacing);
  align-items: flex-start;
  justify-content: center;
}

.skeleton-match-line {
  height: 60px !important;
  width: 100% !important;
}

.skeleton-match-grid {
  height: 150px !important;

  @media (max-width: 1023px) {
    width: 170px !important;
  }

  @media (min-width: 1024px) {
    width: 250px !important;
  }
}
</style>
