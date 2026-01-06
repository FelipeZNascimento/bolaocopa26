<template>
  <PrimePanel style="width: 100%" header="Premiação" toggleable>
    <p>
      Do valor total recolhido das inscrições, <span style="font-weight: bold">10%</span> será revertido ao pagamento de
      custos de manutenção do portal de apostas (servidor, domínio, etc..).
    </p>
    <p style="padding-bottom: var(--l-spacing)">
      O restante (<span style="font-weight: bold">90%</span>) será divido entre os melhores colocados no ranking geral
      após o Super Bowl, segundo as seguintes porcentagens:
    </p>
    <PrimeDataTable showGridlines rowHover :value="tableScores">
      <PrimeColumn field="text" header="Colocação"></PrimeColumn>
      <PrimeColumn field="value" header="Porcentagem do Total" style="font-weight: bold"> </PrimeColumn>
    </PrimeDataTable>
    <h2 style="padding-top: var(--l-spacing)">O jogador com maior número de pontos será o vencedor.</h2>
  </PrimePanel>
  <PrimePanel style="width: 100%" header="Critérios de Desempate" toggleable>
    <h3>1. Acertos completos (na mosca)</h3>
    <h3>2. Acertos parciais (no vencedor)</h3>
    <h3>3. Número de semanas vencidas durante a temporada</h3>
    <h3>4. Sorteio</h3>
  </PrimePanel>
</template>
<script setup lang="ts">
const tableScores = [
  {
    text: '1o Lugar',
    value: '50%',
  },
  {
    text: '2o Lugar',
    value: '20%',
  },
  {
    text: '3o Lugar',
    value: '15%',
  },
  {
    text: '4o Lugar',
    value: '10%',
  },
  {
    text: '5o Lugar',
    value: '5%',
  },
];
</script>
<style lang="scss" scoped></style>
