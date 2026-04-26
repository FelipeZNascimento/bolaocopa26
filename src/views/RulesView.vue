<template>
  <div class="outer-rules">
    <h1>Regras</h1>
    <div
      style="
        display: flex;
        flex-wrap: wrap;
        gap: var(--m-spacing);
        justify-content: center;
      "
    >
      <PrimeButton
        v-for="(button, index) in buttonOptions"
        :key="index"
        :label="button"
        severity="contrast"
        @click="selectedButton = button"
      />
    </div>
    <!-- <RulesSubscription v-if="selectedButton === 'Inscrição'" />
    <RulesScores v-else-if="selectedButton === 'Pontuação'" />
    <RulesBetting v-else-if="selectedButton === 'Apostas'" />
    <RulesExtras v-else-if="selectedButton === 'Extras'" />
    <RulesPrize v-else /> -->
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

// import RulesBetting from './Rules/RulesBetting.vue';
// import RulesExtras from './Rules/RulesExtras.vue';
// import RulesPrize from './Rules/RulesPrize.vue';
// import RulesScores from './Rules/RulesScores.vue';
// import RulesSubscription from './Rules/RulesSubscription.vue';

type RulesToggle =
  | "Apostas"
  | "Extras"
  | "Inscrição"
  | "Pontuação"
  | "Premiação";
// ------ Refs ------
const selectedButton = ref<RulesToggle>("Inscrição");
const buttonOptions = ref<RulesToggle[]>([
  "Inscrição",
  "Pontuação",
  "Apostas",
  "Extras",
  "Premiação",
]);
</script>
<style lang="scss" scoped>
.outer-rules {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--m-spacing);
  align-items: center;
  justify-content: space-between;
  padding: var(--l-spacing) 160px;

  @media (width <= 768px) {
    padding: var(--xxl-spacing) var(--s-spacing);
  }
}
</style>
