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
      <template #header><h2>Pontuação</h2></template>
      <p class="subtitle">Como funciona</p>
      <p>Cada jogo tem três possíveis resultados de aposta:</p>
      <p class="padded">
        <span style="font-weight: bold; color: var(--bolao-c-gold-l2)">Acerto Total:</span> acertou o placar completo.
      </p>
      <p class="padded">
        <span style="font-weight: bold; color: var(--bolao-c-green-l3)">Acerto Parcial:</span> acertou o vencedor do
        jogo e o número de gols de apenas uma das equipes.
      </p>
      <p class="padded">
        <span style="font-weight: bold; color: var(--bolao-c-blue-l2)">Acerto Mínimo:</span> acertou apenas o vencedor
        do jogo, mas errou o número de gols das duas equipes.
      </p>
      <p class="padded">
        <span style="font-weight: bold; color: var(--bolao-c-red-l2)">Erro:</span> errou o vencedor da partida.
      </p>
      <PrimeDivider />
      <p class="subtitle">Pontuação por fase</p>
      <PrimeDataTable
        :value="scoresData"
        striped-rows
        show-gridlines
        scrollable
        class="scores-table"
      >
        <PrimeColumn
          field="fase"
          header="Fase"
          class="column"
        />
        <PrimeColumn
          field="numJogos"
          header="Nº de Jogos"
          class="column"
        />
        <PrimeColumn
          field="acertoTotal"
          header="Acerto Total"
          class="column"
          style="color: var(--bolao-c-gold-l2)"
        />
        <PrimeColumn
          field="acertoParcial"
          header="Acerto Parcial"
          class="column"
          style="color: var(--bolao-c-green-l3)"
        />
        <PrimeColumn
          field="acertoMinimo"
          header="Acerto Mínimo"
          class="column"
          style="color: var(--bolao-c-blue-l2)"
        />
      </PrimeDataTable>
      <p style="margin-top: var(--m-spacing); font-size: var(--s-font-size); font-weight: bold">
        ● <span style="font-weight: bold; color: var(--bolao-c-red-l2)">Erros</span> valem sempre 0 (zero) pontos.
      </p>
      <p>
        ● <span style="font-weight: bold">Empate</span> pode ser
        <span style="color: var(--bolao-c-gold-l2)">Acerto Total</span>,
        <span style="color: var(--bolao-c-blue-l2)">Acerto Mínimo</span> ou
        <span style="color: var(--bolao-c-red-l2)">Erro</span> - mas nunca
        <span style="color: var(--bolao-c-green-l3)">Acerto Parcial</span>.
      </p>
      <p>
        ● No mata-mata (a partir dos 16 Avos de Final), o resultado que vale para pontuação é aquele ao final do tempo
        extra (se houver). Resultados de disputa por
        <span style="font-weight: bold">pênaltis não são considerados</span>.
      </p>
      <PrimeDivider />
      <p
        class="subtitle"
        style="padding-bottom: var(--s-spacing)"
      >
        Exemplos
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
          header="Aposta"
          class="column"
        />
        <PrimeColumn
          header="Pontos"
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
          header="Aposta"
          class="column"
        />
        <PrimeColumn
          header="Pontos"
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
import { useRulesPanel } from '@/composables/useRulesPanel';

const { isOpen, panelPt } = useRulesPanel('pontuacao');
import MatchComponent from '@/components/Match/MatchComponent.vue';

import { firstExample, secondExample } from './examples';
const scoresData = [
  { acertoMinimo: '4 pt', acertoParcial: '6 pts', acertoTotal: '10 pts', fase: 'Fase de Grupos', numJogos: 72 },
  { acertoMinimo: '6 pts', acertoParcial: '9 pts', acertoTotal: '15 pts', fase: '16 Avos de Final', numJogos: 16 },
  { acertoMinimo: '8 pts', acertoParcial: '12 pts', acertoTotal: '20 pts', fase: 'Oitavas de Final', numJogos: 8 },
  { acertoMinimo: '12 pts', acertoParcial: '18 pts', acertoTotal: '30 pts', fase: 'Quartas de Final', numJogos: 4 },
  { acertoMinimo: '16 pts', acertoParcial: '24 pts', acertoTotal: '40 pts', fase: 'Semifinais', numJogos: 2 },
  { acertoMinimo: '8 pts', acertoParcial: '12 pts', acertoTotal: '20 pts', fase: 'Disputa de 3º lugar', numJogos: 1 },
  { acertoMinimo: '20 pts', acertoParcial: '30 pts', acertoTotal: '50 pts', fase: 'Final', numJogos: 1 },
];

const firstExampleData = [
  {
    aposta: 'Brasil 2 x 1 Argentina',
    pontos: `<span style="color: var(--bolao-c-gold-l2); font-weight: bold">10 pts (Acerto Total)</span>`,
  },
  {
    aposta: 'Brasil 3 x 1 Argentina',
    pontos: `<span style="color: var(--bolao-c-blue-l2); font-weight: bold">6 pts (Acerto Parcial)</span>`,
  },
  {
    aposta: 'Brasil 1 x 1 Argentina',
    pontos: `<span style="color: var(--bolao-c-green-l3); font-weight: bold">4 pts (Acerto Mínimo)</span>`,
  },
  {
    aposta: 'Brasil 0 x 2 Argentina',
    pontos: `<span style="color: var(--bolao-c-red-l2); font-weight: bold">0 pts (Erro)</span>`,
  },
];

const secondExampleData = [
  {
    aposta: 'Inglaterra 1 x 1 Alemanha',
    pontos: `<span style="color: var(--bolao-c-gold-l2); font-weight: bold">10 pts (Acerto Total)</span>`,
  },
  {
    aposta: 'Inglaterra 2 x 2 Alemanha',
    pontos: `<span style="color: var(--bolao-c-green-l3); font-weight: bold">4 pts (Acerto Mínimo)</span>`,
  },
  {
    aposta: 'Inglaterra 1 x 0 Alemanha',
    pontos: `<span style="color: var(--bolao-c-red-l2); font-weight: bold">0 pts (Erro)</span>`,
  },
];
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
