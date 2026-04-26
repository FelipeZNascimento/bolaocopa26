<template>
  <span class="outer-skeleton-line">
    <PrimeSkeleton
      v-for="index in 16"
      :key="index"
      class="skeleton-match-line"
    />
  </span>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
.outer-skeleton-line {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  width: 100%;
}

.skeleton-match-line {
  width: 100% !important;
  height: 60px !important;
}
</style>
