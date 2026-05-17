<template>
  <div class="ranking-widget">
    <div class="table-wrapper">
      <RankingTable
        column-config="compact"
        row-spacing-config="small"
        :is-full-page="false"
      />
    </div>
    <RouterLink
      to="/ranking"
      class="see-all-link"
    >
      {{ t('home.ranking.seeAll') }}
      <i class="pi pi-arrow-right" />
    </RouterLink>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

import RankingTable from '@/components/Ranking/RankingTable.vue';

const { t } = useI18n();
</script>

<style lang="scss" scoped>
.ranking-widget {
  display: flex;
  flex-direction: column;
  height: 420px;
}

.table-wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.see-all-link {
  display: flex;
  flex-shrink: 0;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--xs-spacing);
  font-size: var(--s-font-size);
  color: var(--bolao-c-blue1);
  border-radius: 6px;
  transition: color 0.15s ease;

  &:hover {
    color: var(--bolao-c-sky);
    text-decoration: none;
  }
}
</style>
