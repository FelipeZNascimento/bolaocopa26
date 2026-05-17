<template>
  <div
    id="pontuacao"
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
        ><h2>{{ t('rules.scores.title') }}</h2></template
      >
      <p class="subtitle">{{ t('rules.scores.howItWorks') }}</p>
      <p>{{ t('rules.scores.intro') }}</p>
      <p class="padded">
        <span style="font-weight: bold; color: var(--bolao-c-gold-l2)">{{ t('rules.scores.exactScore') }}:</span>
        {{ t('rules.scores.exactScoreDesc') }}
      </p>
      <p class="padded">
        <span style="font-weight: bold; color: var(--bolao-c-green-l3)">{{ t('rules.scores.partialScore') }}:</span>
        {{ t('rules.scores.partialScoreDesc') }}
      </p>
      <p class="padded">
        <span style="font-weight: bold; color: var(--bolao-c-blue-l2)">{{ t('rules.scores.minimumScore') }}:</span>
        {{ t('rules.scores.minimumScoreDesc') }}
      </p>
      <p
        class="padded"
        style="padding-bottom: var(--s-spacing)"
      >
        <span style="font-weight: bold; color: var(--bolao-c-red-l2)">{{ t('rules.scores.miss') }}:</span>
        {{ t('rules.scores.missDesc') }}
      </p>
      <i18n-t
        keypath="rules.scores.drawNote"
        tag="span"
      >
        <template #draw
          ><span style="font-weight: bold">{{ t('rules.scores.drawWord') }}</span></template
        >
        <template #exact
          ><span style="color: var(--bolao-c-gold-l2)">{{ t('rules.scores.exactScore') }}</span></template
        >
        <template #minimum
          ><span style="color: var(--bolao-c-blue-l2)">{{ t('rules.scores.minimumScore') }}</span></template
        >
        <template #miss
          ><span style="color: var(--bolao-c-red-l2)">{{ t('rules.scores.miss') }}</span></template
        >
        <template #partial
          ><span style="color: var(--bolao-c-green-l3)">{{ t('rules.scores.partialScore') }}</span></template
        >
      </i18n-t>
      <PrimeDivider />
      <p class="subtitle">{{ t('rules.scores.scoresByPhase') }}</p>
      <PrimeDataTable
        :value="scoresData"
        striped-rows
        show-gridlines
        scrollable
        class="scores-table"
      >
        <PrimeColumn
          field="fase"
          :header="t('rules.scores.tableHeaders.phase')"
          class="column"
        />
        <PrimeColumn
          field="numJogos"
          :header="t('rules.scores.tableHeaders.numMatches')"
          class="column"
        />
        <PrimeColumn
          field="acertoTotal"
          :header="t('rules.scores.tableHeaders.exactScore')"
          class="column"
          style="color: var(--bolao-c-gold-l2)"
        />
        <PrimeColumn
          field="acertoParcial"
          :header="t('rules.scores.tableHeaders.partialScore')"
          class="column"
          style="color: var(--bolao-c-green-l3)"
        />
        <PrimeColumn
          field="acertoMinimo"
          :header="t('rules.scores.tableHeaders.minimumScore')"
          class="column"
          style="color: var(--bolao-c-blue-l2)"
        />
      </PrimeDataTable>
      <p style="margin-top: var(--m-spacing); font-weight: bold">
        <i18n-t
          keypath="rules.scores.missNote"
          tag="span"
        >
          <template #miss>
            <span style="font-weight: bold; color: var(--bolao-c-red-l2)">{{ t('rules.scores.miss') }}s</span>
          </template>
        </i18n-t>
      </p>
      <p>
        <i18n-t
          keypath="rules.scores.knockoutNote"
          tag="span"
        >
          <template #highlight>
            <span style="font-weight: bold">{{ t('rules.scores.penaltiesHighlight') }}</span>
          </template>
        </i18n-t>
      </p>
      <PrimeDivider />
      <p
        class="subtitle"
        style="padding-bottom: var(--s-spacing)"
      >
        {{ t('rules.scores.examples') }}
      </p>
      <MatchComponent
        :is-demo="true"
        :match="firstExample"
      />
      <PrimeDataTable
        :value="firstExampleData"
        show-gridlines
        scrollable
        class="bets-table"
      >
        <PrimeColumn
          field="aposta"
          :header="t('rules.scores.exampleTableHeaders.bet')"
          class="column"
        />
        <PrimeColumn
          :header="t('rules.scores.exampleTableHeaders.points')"
          class="column"
        >
          <template #body="slotProps">
            <span v-html="slotProps.data.pontos" />
          </template>
        </PrimeColumn>
      </PrimeDataTable>
      <PrimeDivider />
      <MatchComponent
        :is-demo="true"
        :match="secondExample"
      />
      <PrimeDataTable
        :value="secondExampleData"
        show-gridlines
        scrollable
        class="bets-table"
      >
        <PrimeColumn
          field="aposta"
          :header="t('rules.scores.exampleTableHeaders.bet')"
          class="column"
        />
        <PrimeColumn
          :header="t('rules.scores.exampleTableHeaders.points')"
          class="column"
        >
          <template #body="slotProps">
            <span v-html="slotProps.data.pontos" />
          </template>
        </PrimeColumn>
      </PrimeDataTable>
    </PrimePanel>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import MatchComponent from '@/components/Match/MatchComponent.vue';
import { useRulesPanel } from '@/composables/useRulesPanel';

import { firstExample, secondExample } from './examples';

const { isOpen, panelPt } = useRulesPanel('pontuacao');
const { t } = useI18n();

const scoresData = computed(() => [
  {
    acertoMinimo: '4 pt',
    acertoParcial: '6 pts',
    acertoTotal: '10 pts',
    fase: t('rules.scores.phases.groups'),
    numJogos: 72,
  },
  {
    acertoMinimo: '6 pts',
    acertoParcial: '9 pts',
    acertoTotal: '15 pts',
    fase: t('rules.scores.phases.r16'),
    numJogos: 16,
  },
  {
    acertoMinimo: '8 pts',
    acertoParcial: '12 pts',
    acertoTotal: '20 pts',
    fase: t('rules.scores.phases.r8'),
    numJogos: 8,
  },
  {
    acertoMinimo: '12 pts',
    acertoParcial: '18 pts',
    acertoTotal: '30 pts',
    fase: t('rules.scores.phases.qf'),
    numJogos: 4,
  },
  {
    acertoMinimo: '16 pts',
    acertoParcial: '24 pts',
    acertoTotal: '40 pts',
    fase: t('rules.scores.phases.sf'),
    numJogos: 2,
  },
  {
    acertoMinimo: '8 pts',
    acertoParcial: '12 pts',
    acertoTotal: '20 pts',
    fase: t('rules.scores.phases.third'),
    numJogos: 1,
  },
  {
    acertoMinimo: '20 pts',
    acertoParcial: '30 pts',
    acertoTotal: '50 pts',
    fase: t('rules.scores.phases.final'),
    numJogos: 1,
  },
]);

const firstExampleData = computed(() => [
  {
    aposta: t('rules.scores.example1.bet1'),
    pontos: `<span style="color: var(--bolao-c-gold-l2); font-weight: bold">${t('rules.scores.exactScorePoints')}</span>`,
  },
  {
    aposta: t('rules.scores.example1.bet2'),
    pontos: `<span style="color: var(--bolao-c-green-l3); font-weight: bold">${t('rules.scores.partialScorePoints')}</span>`,
  },
  {
    aposta: t('rules.scores.example1.bet3'),
    pontos: `<span style="color: var(--bolao-c-blue-l2); font-weight: bold">${t('rules.scores.minimumScorePoints')}</span>`,
  },
  {
    aposta: t('rules.scores.example1.bet4'),
    pontos: `<span style="color: var(--bolao-c-red-l2); font-weight: bold">${t('rules.scores.missPoints')}</span>`,
  },
]);

const secondExampleData = computed(() => [
  {
    aposta: t('rules.scores.example2.bet1'),
    pontos: `<span style="color: var(--bolao-c-gold-l2); font-weight: bold">${t('rules.scores.exactScorePoints')}</span>`,
  },
  {
    aposta: t('rules.scores.example2.bet2'),
    pontos: `<span style="color: var(--bolao-c-blue-l2); font-weight: bold">${t('rules.scores.minimumScorePoints')}</span>`,
  },
  {
    aposta: t('rules.scores.example2.bet3'),
    pontos: `<span style="color: var(--bolao-c-red-l2); font-weight: bold">${t('rules.scores.missPoints')}</span>`,
  },
]);
</script>
<style lang="scss" scoped>
.outer {
  width: 100%;
  font-size: var(--m-font-size);

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

  @media (width <= 768px) {
    font-size: var(--s-font-size);
  }
}

.subtitle {
  padding-top: var(--m-spacing) !important;
  font-weight: bold;
  text-transform: uppercase;
}

.scores-table,
.bets-table {
  width: 100%;
  margin-top: var(--m-spacing);

  @media (width <= 768px) {
    font-size: var(--xs-font-size);
  }
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

i {
  margin-right: var(--s-spacing);
}
</style>
