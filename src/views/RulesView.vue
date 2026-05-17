<template>
  <div class="outer-rules">
    <h1>{{ t('rules.title') }}</h1>
    <RulesSubscription />
    <RulesScores />
    <RulesBetting />
    <RulesExtras />
    <RulesPrize />
    <h2 style="padding-top: var(--l-spacing)">{{ t('rules.faq') }}</h2>
    <RulesFAQ />
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import RulesBetting from '@/views/Rules/RulesBetting.vue';
import RulesExtras from '@/views/Rules/RulesExtras.vue';
import RulesFAQ from '@/views/Rules/RulesFAQ.vue';
import RulesPrize from '@/views/Rules/RulesPrize.vue';
import RulesScores from '@/views/Rules/RulesScores.vue';
import RulesSubscription from '@/views/Rules/RulesSubscription.vue';

const { t } = useI18n();
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
