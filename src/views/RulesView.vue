<template>
  <div class="outer-rules">
    <h1>Regras</h1>
    <RulesSubscription />
    <RulesScores />
    <RulesBetting />
    <RulesExtras />
    <RulesPrize />
    <RulesFAQ />
  </div>
</template>
<script setup lang="ts">
import RulesBetting from '@/views/Rules/RulesBetting.vue';
import RulesExtras from '@/views/Rules/RulesExtras.vue';
import RulesFAQ from '@/views/Rules/RulesFAQ.vue';
import RulesPrize from '@/views/Rules/RulesPrize.vue';
import RulesScores from '@/views/Rules/RulesScores.vue';
import RulesSubscription from '@/views/Rules/RulesSubscription.vue';
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
