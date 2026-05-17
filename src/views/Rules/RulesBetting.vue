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
      <template #header
        ><h2>{{ t('rules.betting.title') }}</h2></template
      >

      <p>{{ t('rules.betting.rule1') }}</p>
      <p>{{ t('rules.betting.rule2') }}</p>
      <p>{{ t('rules.betting.rule3') }}</p>
      <PrimeDivider />
      <p>
        <i18n-t
          keypath="rules.betting.emailFallback"
          tag="span"
        >
          <template #emailLink>
            <a href="mailto:bolao@omegafox.me">{{ t('rules.betting.emailLinkLabel') }}</a> (bolao@omegafox.me)
          </template>
        </i18n-t>
      </p>
    </PrimePanel>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useRulesPanel } from '@/composables/useRulesPanel';

const { isOpen, panelPt } = useRulesPanel('apostas');
const { t } = useI18n();
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
