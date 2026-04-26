<template>
  <PaginatorComponent />
  <div class="outer">
    <div class="ranking-outer">
      <RankingTable column-config="complete" row-spacing-config="normal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PaginatorComponent from "@/components/PaginatorComponent.vue";
import RankingTable from "@/components/Ranking/RankingTable.vue";
</script>
<style lang="scss" scoped>
.outer {
  display: flex;
  flex-direction: column;
  gap: var(--xxl-spacing);
  justify-content: center;
  width: 100%;
  height: calc(100vh - var(--paginator-height) - var(--navbar-height));
  padding: 0;
  overflow-y: auto;

  @media (max-width: 1024px) {
    height: calc(100vh - var(--paginator-height) - var(--navbar-height-mobile));
  }
}

.ranking-outer {
  flex: 1;
  align-items: center;
  min-height: 0;
  padding-bottom: var(--xl-spacing);
  background-color: var(--bolao-c-blue4);
  border-radius: var(--border-radius);
  box-shadow: var(--drop-shadow);
  overflow: hidden;
}
</style>
