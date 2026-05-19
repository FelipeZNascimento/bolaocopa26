<template>
  <div
    id="extras"
    style="width: 100%"
  >
    <PrimePanel
      toggleable
      class="outer"
      :collapsed="!isOpen"
      :pt="panelPt"
      @update:collapsed="(val: boolean) => (isOpen = !val)"
    >
      <template #header
        ><h2>{{ t('rules.extras.title') }}</h2></template
      >
      <p class="subtitle">{{ t('rules.extras.teamSubtitle') }}</p>
      <p>{{ t('rules.extras.teamIntro') }}</p>
      <p>
        <i18n-t
          keypath="rules.extras.teamExclusive"
          tag="span"
        >
          <template #highlight
            ><span style="font-weight: bold">{{ t('rules.extras.teamExclusiveWord') }}</span></template
          >
        </i18n-t>
      </p>
      <PrimeDataTable
        :value="championData"
        show-gridlines
        scrollable
        class="bets-table"
      >
        <PrimeColumn
          field="stage"
          :header="t('rules.extras.tableHeaders.phase')"
          class="column"
        />
        <PrimeColumn
          :header="t('rules.extras.tableHeaders.basePoints')"
          class="column"
          field="points"
        />
      </PrimeDataTable>
      <p>
        <span style="font-weight: bold">{{ t('rules.extras.teamFactorsNew') }}</span>
        {{ t('rules.extras.teamFactors') }}
      </p>
      <p class="padded">{{ t('rules.extras.factor1') }}</p>
      <p class="padded">{{ t('rules.extras.factor2') }}</p>
      <p class="padded">{{ t('rules.extras.factor3') }}</p>
      <PrimeDivider />
      <p class="subtitle">{{ t('rules.extras.othersSubtitle') }}</p>
      <PrimeDataTable
        :value="playerData"
        show-gridlines
        scrollable
        class="bets-table"
      >
        <PrimeColumn
          field="type"
          :header="t('rules.extras.tableHeaders.betType')"
          class="column"
        />
        <PrimeColumn
          :header="t('rules.extras.tableHeaders.points')"
          class="column"
          field="points"
        />
      </PrimeDataTable>
      <p>{{ t('rules.extras.othersNote') }}</p>
      <PrimeDivider />
      <p class="subtitle">{{ t('rules.extras.guideSubtitle') }}</p>
      <PrimeDataTable
        :value="guideData"
        show-gridlines
        scrollable
        class="bets-table"
      >
        <PrimeColumn
          field="type"
          :header="t('rules.extras.tableHeaders.betType')"
          class="column"
        />
        <PrimeColumn
          :header="t('rules.extras.tableHeaders.beforeGroups')"
          class="column"
          field="beforeGroups"
        />
        <PrimeColumn
          :header="t('rules.extras.tableHeaders.beforePlayoffs')"
          class="column"
          field="beforePlayoffs"
        />
        <PrimeColumn
          :header="t('rules.extras.tableHeaders.beforeQuarter')"
          class="column"
          field="beforeQuarter"
        />
      </PrimeDataTable>
    </PrimePanel>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useRulesPanel } from '@/composables/useRulesPanel';

const { isOpen, panelPt } = useRulesPanel('extras');
const { t, tm } = useI18n();

const championData = computed(() => tm('rules.extras.championData') as { points: string; stage: string }[]);
const playerData = computed(() => tm('rules.extras.playerData') as { points: string; type: string }[]);
const guideData = computed(
  () =>
    tm('rules.extras.guideData') as {
      beforeGroups: string;
      beforePlayoffs: string;
      beforeQuarter: string;
      type: string;
    }[],
);
</script>
<style lang="scss" scoped>
.outer {
  width: 100%;
  font-size: var(--m-font-size);

  @media (width <= 768px) {
    font-size: var(--s-font-size);
  }

  p {
    padding-top: var(--xs-spacing);
    line-height: 1.5;
  }

  .padded {
    padding-left: var(--xl-spacing);
  }

  .double-padded {
    padding-left: var(--xxl-spacing);
  }
}

.subtitle {
  padding-top: var(--m-spacing) !important;
  font-weight: bold;
  text-transform: uppercase;
}

.bets-table {
  width: 100%;
  margin-top: var(--m-spacing);

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
}

i {
  margin-right: var(--s-spacing);
}

:deep(.column) {
  font-weight: bold;
  text-align: center;

  @media (width <= 768px) {
    padding: var(--xs-spacing);
  }
}

:deep(.p-datatable-thead > tr > th) {
  color: var(--bolao-c-white-t2);
  background-color: var(--bolao-c-black-t2);
}

:deep(.p-datatable-column-header-content) {
  justify-content: center;
}
</style>
