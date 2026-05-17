<template>
  <div
    id="premiacao"
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
        ><h2>{{ t('rules.prize.title') }}</h2></template
      >
      <p class="subtitle">{{ t('rules.prize.distributionSubtitle') }}</p>
      <p>{{ t('rules.prize.distributionIntro') }}</p>
      <PrimeDataTable
        :value="prizeDistributionShort"
        show-gridlines
        scrollable
        class="bets-table"
      >
        <template #header>{{ t('rules.prize.upTo114') }}</template>
        <PrimeColumn
          field="position"
          :header="t('rules.prize.tableHeaders.position')"
          class="column"
        />
        <PrimeColumn
          field="percentage"
          :header="t('rules.prize.tableHeaders.percentage')"
          class="column"
        />
      </PrimeDataTable>
      <PrimeDataTable
        :value="prizeDistributionLong"
        show-gridlines
        scrollable
        class="bets-table"
      >
        <template #header>{{ t('rules.prize.plus115') }}</template>
        <PrimeColumn
          field="position"
          :header="t('rules.prize.tableHeaders.position')"
          class="column"
        />
        <PrimeColumn
          field="percentage"
          :header="t('rules.prize.tableHeaders.percentage')"
          class="column"
        />
      </PrimeDataTable>
      <PrimeDivider />
      <p class="subtitle">{{ t('rules.prize.additionalSubtitle') }}</p>
      <p>{{ t('rules.prize.additional1') }}</p>
      <p>{{ t('rules.prize.additional2') }}</p>
      <PrimeDivider />
      <p class="subtitle">{{ t('rules.prize.tiebreakSubtitle') }}</p>
      <p class="padded">{{ t('rules.prize.tiebreak1') }}</p>
      <p class="padded">
        <i18n-t
          keypath="rules.prize.tiebreak2"
          tag="span"
        >
          <template #highlight><span style="color: var(--bolao-c-gold-l2)"></span></template>
        </i18n-t>
      </p>
      <p class="padded">{{ t('rules.prize.tiebreak3') }}</p>
      <p class="padded">
        <i18n-t
          keypath="rules.prize.tiebreak4"
          tag="span"
        >
          <template #highlight><span style="color: var(--bolao-c-green-l3)"></span></template>
        </i18n-t>
      </p>
      <p class="padded">{{ t('rules.prize.tiebreak5') }}</p>
      <p class="padded">{{ t('rules.prize.tiebreak6') }}</p>
      <p class="padded">{{ t('rules.prize.tiebreak7') }}</p>
    </PrimePanel>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useRulesPanel } from '@/composables/useRulesPanel';

const { isOpen, panelPt } = useRulesPanel('premiacao');
const { t, tm } = useI18n();

const prizeDistributionShort = tm('rules.prize.shortData') as { percentage: string; position: string }[];
const prizeDistributionLong = tm('rules.prize.longData') as { percentage: string; position: string }[];
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
