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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
}

.skeleton-match-line {
  height: 60px !important;
  width: 100% !important;
}
</style>
