<template>
  <div
    id="apostas"
    style="width: 100%"
  >
    <PrimePanel
      toggleable
      class="outer"
      :collapsed="!isOpen"
      :pt="panelPt"
      @update:collapsed="(val: boolean) => (isOpen = !val)"
    >
      <template #header><h2>Apostas</h2></template>

      <p>
        ● As apostas poderão ser feitas até o horário de início de cada jogo. Nesse momento, o bloqueio de apostas será
        automático e as apostas de todos os usuários ficarão disponíveis.
      </p>
      <p>● Todos os horários dos jogos obedecem ao fuso horário do usuário.</p>
      <p>● Os resultados dos jogos, os gols e as pontuações serão atualizados, no mínimo, diariamente.</p>
      <PrimeDivider />
      <p>
        Caso o participante não consiga acessar o site do bolão para realizar suas apostas, serão aceitas apostas
        enviadas para o e-mail [E-MAIL] até o horário de início do jogo. Apostas que não estejam claras ou que não
        respeitem o horário serão ignoradas.
      </p>
    </PrimePanel>
  </div>
</template>
<script setup lang="ts">
import { useRulesPanel } from '@/composables/useRulesPanel';

const { isOpen, panelPt } = useRulesPanel('apostas');
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

i {
  margin-right: var(--s-spacing);
}
</style>
