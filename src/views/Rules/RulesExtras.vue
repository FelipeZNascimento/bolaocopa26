<template>
  <PrimePanel style="width: 100%" header="Apostas Extras" toggleable>
    <p>
      Apostas específicas sobre o campeão de cada divisão, de cada conferência e o vencedor do Super Bowl. Essas apostas
      ficarão habilitadas até
      <span style="font-weight: bold">{{ formatDate() }}</span
      >.
    </p>
    <p>
      Você pode fazer suas Apostas Extras pelo menu "Extras" (ou
      <RouterLink to="/extras">clique aqui</RouterLink>).
    </p>
  </PrimePanel>
  <PrimePanel style="width: 100%" header="Quanto vale uma Aposta Extra" toggleable>
    <p style="padding-bottom: var(--l-spacing)">
      Ao longo da temporada, as apostas mudam de valor. Quanto mais importante uma partida, mais pontos tem uma aposta
      correta.
    </p>
    <PrimeDataTable showGridlines rowHover :value="tableScores">
      <PrimeColumn field="text" header="Fase"></PrimeColumn>
      <PrimeColumn field="value" header="Pontos" style="font-weight: bold"> </PrimeColumn>
    </PrimeDataTable>
  </PrimePanel>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import { useClockStore } from '@/stores/clock';
import { useConfigurationStore } from '@/stores/configuration';

const clockStore = useClockStore();
const configurationStore = useConfigurationStore();

const seasonStart = computed(() => configurationStore.seasonStart);

function formatDate() {
  if (!seasonStart.value) {
    return '';
  }

  return `${clockStore.formattedDate(seasonStart.value)}, ${clockStore.formattedTime(seasonStart.value)}`;
}

const tableScores = [
  {
    text: 'Wild Card',
    value: '10',
  },
  {
    text: 'Campeão de Divisão',
    value: '20',
  },
  {
    text: 'Campeão de Conferência',
    value: '50',
  },
  {
    text: 'Vencedor Super Bowl',
    value: '100',
  },
];
</script>
<style lang="scss" scoped></style>
