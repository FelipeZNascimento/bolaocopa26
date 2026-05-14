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
      <template #header><h2>Premiação</h2></template>
      <p class="subtitle">Distribuição de Prêmios</p>
      <p>
        10% do valor arrecadado será destinado a custos do bolão (domínio, hospedagem e desenvolvimento do site), mais
        R$ 200,00 em prêmios adicionais descritos abaixo. O restante será distribuído entre os colocados conforme as
        tabelas abaixo:
      </p>
      <PrimeDataTable
        :value="prizeDistributionShort"
        show-gridlines
        scrollable
        class="bets-table"
      >
        <template #header>Até 114 Participantes</template>
        <PrimeColumn
          field="position"
          header="Colocação"
          class="column"
        />
        <PrimeColumn
          field="percentage"
          header="% da Arrecadação"
          class="column"
        />
      </PrimeDataTable>
      <PrimeDataTable
        :value="prizeDistributionLong"
        show-gridlines
        scrollable
        class="bets-table"
      >
        <template #header>115+ Participantes</template>
        <PrimeColumn
          field="position"
          header="Colocação"
          class="column"
        />
        <PrimeColumn
          field="percentage"
          header="% da Arrecadação"
          class="column"
        />
      </PrimeDataTable>
      <PrimeDivider />
      <p class="subtitle">Prêmios Adicionais</p>
      <p>● 1º colocado após os 72 jogos da fase de grupos (sem apostas extras): devolução da inscrição (R$100,00).</p>
      <p>● 1º colocado geral ao fim de todos os jogos (sem apostas extras): devolução da inscrição (R$100,00).</p>
      <PrimeDivider />
      <p class="subtitle">Critério de Desempate</p>
      <p class="padded">1. Maior número de pontos conquistados;</p>
      <p class="padded">2. Maior número de <span style="color: var(--bolao-c-gold-l2)">acertos totais</span>;</p>
      <p class="padded">3. Aposta extra no campeão correta;</p>
      <p class="padded">4. Maior número de <span style="color: var(--bolao-c-green-l3)">acertos parciais</span>;</p>
      <p class="padded">5. Aposta extra no artilheiro correta;</p>
      <p class="padded">6. Aposta extra no melhor jogador correta;</p>
      <p class="padded">7. Sorteio.</p>
    </PrimePanel>
  </div>
</template>
<script setup lang="ts">
import { useRulesPanel } from '@/composables/useRulesPanel';

const { isOpen, panelPt } = useRulesPanel('premiacao');
const prizeDistributionShort = [
  { percentage: '45%', position: '1º Lugar' },
  { percentage: '25%', position: '2º Lugar' },
  { percentage: '15%', position: '3º Lugar' },
  { percentage: '10%', position: '4º Lugar' },
  { percentage: '5%', position: '5º Lugar' },
];

const prizeDistributionLong = [
  { percentage: '35%', position: '1º Lugar' },
  { percentage: '20%', position: '2º Lugar' },
  { percentage: '15%', position: '3º Lugar' },
  { percentage: '9%', position: '4º Lugar' },
  { percentage: '6%', position: '5º Lugar' },
  { percentage: '5%', position: '6º Lugar' },
  { percentage: '4%', position: '7º Lugar' },
  { percentage: '3%', position: '8º Lugar' },
  { percentage: '2%', position: '9º Lugar' },
  { percentage: '1%', position: '10º Lugar' },
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
