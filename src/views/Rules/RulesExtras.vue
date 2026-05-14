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
      <template #header><h2>Apostas Extras</h2></template>
      <p class="subtitle">Equipe</p>
      <p>
        Cada participante escolhe uma equipe para apostar. Os pontos ganhos dependem de quão longe essa equipe chegar na
        Copa.
      </p>
      <p>As pontuações extras são <span style="font-weight: bold">exclusivas</span>, ou seja, não se acumulam:</p>
      <PrimeDataTable
        :value="championData"
        show-gridlines
        scrollable
        class="bets-table"
      >
        <PrimeColumn
          field="stage"
          header="Fase"
          class="column"
        />
        <PrimeColumn
          header="Pontos Base"
          class="column"
          field="points"
        />
      </PrimeDataTable>
      <p>
        <span style="font-weight: bold">Novidade:</span> os participantes terão a oportunidade de trocar a aposta extra
        de time. Quanto mais tarde a aposta for alterada, menor o fator de pontuação, mas maior a informação disponível.
        Os fatores abaixo serão aplicados à pontuação base de acordo com o momento em que a aposta extra de time for
        feita:
      </p>
      <p class="padded">• Antes do Início da Copa: 100% → até 11/06/2026, às 16h, horário de Brasília.</p>
      <p class="padded">• Antes do Mata-Mata: 60% → até 28/06/2026, às 16h, horário de Brasília</p>
      <p class="padded">• Antes das Oitavas: 30% → até 04/07/2026, às 14h, horário de Brasília</p>
      <PrimeDivider />
      <p class="subtitle">Jogadores</p>
      <PrimeDataTable
        :value="playerData"
        show-gridlines
        scrollable
        class="bets-table"
      >
        <PrimeColumn
          field="type"
          header="Tipo de Aposta"
          class="column"
        />
        <PrimeColumn
          header="Pontos"
          class="column"
          field="points"
        />
      </PrimeDataTable>
      <p>
        Essas apostas extras não podem ser trocadas ao longo da Copa. Em caso de empate nessas categorias, todos os
        empatados contam para a pontuação extra.
      </p>
      <PrimeDivider />
      <p class="subtitle">Tabela-Guia</p>
      <PrimeDataTable
        :value="guideData"
        show-gridlines
        scrollable
        class="bets-table"
      >
        <PrimeColumn
          field="type"
          header="Tipo de Aposta"
          class="column"
        />
        <PrimeColumn
          header="Antes dos Grupos"
          class="column"
          field="beforeGroups"
        />
        <PrimeColumn
          header="Antes do Mata-Mata"
          class="column"
          field="beforePlayoffs"
        />
        <PrimeColumn
          header="Antes das Oitavas"
          class="column"
          field="beforeQuarter"
        />
      </PrimeDataTable>
    </PrimePanel>
  </div>
</template>
<script setup lang="ts">
import { useRulesPanel } from '@/composables/useRulesPanel';

const { isOpen, panelPt } = useRulesPanel('extras');
const championData = [
  {
    points: '50 pontos',
    stage: 'Campeão',
  },
  {
    points: '30 pontos',
    stage: 'Vice-Campeão',
  },
  {
    points: '20 pontos',
    stage: 'Semifinalista',
  },
  {
    points: '10 pontos',
    stage: 'Quadrifinalista',
  },
  {
    points: '0 pontos',
    stage: 'Eliminado antes das Quartas',
  },
];

const playerData = [
  {
    points: '15 pontos',
    type: 'Artilheiro',
  },
  {
    points: '15 pontos',
    type: 'Melhor Jogador (Bola de Ouro)',
  },
  {
    points: '10 pontos',
    type: 'Melhor Ataque (Grupos)',
  },
  {
    points: '10 pontos',
    type: 'Melhor Defesa (Grupos)',
  },
];

const guideData = [
  {
    beforeGroups: '50 pontos',
    beforePlayoffs: '30 pontos',
    beforeQuarter: '15 pontos',
    type: 'Time Campeão',
  },
  {
    beforeGroups: '30 pontos',
    beforePlayoffs: '18 pontos',
    beforeQuarter: '9 pontos',
    type: 'Time Vice-Campeão',
  },
  {
    beforeGroups: '20 pontos',
    beforePlayoffs: '12 pontos',
    beforeQuarter: '6 pontos',
    type: 'Time Semifinalista',
  },
  {
    beforeGroups: '10 pontos',
    beforePlayoffs: '6 pontos',
    beforeQuarter: '3 pontos',
    type: 'Time Quadrifinalista',
  },
  {
    beforeGroups: '15 pontos',
    beforePlayoffs: '-',
    beforeQuarter: '-',
    type: 'Artilheiro',
  },
  {
    beforeGroups: '15 pontos',
    beforePlayoffs: '-',
    beforeQuarter: '-',
    type: 'Melhor Jogador',
  },
  {
    beforeGroups: '10 pontos',
    beforePlayoffs: '-',
    beforeQuarter: '-',
    type: 'Melhor Ataque (Grupos)',
  },
  {
    beforeGroups: '10 pontos',
    beforePlayoffs: '-',
    beforeQuarter: '-',
    type: 'Melhor Defesa (Grupos)',
  },
];
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
