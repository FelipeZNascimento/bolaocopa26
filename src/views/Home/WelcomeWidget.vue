<template>
  <div class="welcome-widget">
    <h2 class="headline">{{ t('home.welcome.headline') }}</h2>
    <p class="description">{{ t('home.welcome.description') }}</p>
    <div class="steps">
      <div
        v-for="(step, i) in steps"
        :key="step.label"
        class="step"
      >
        <div class="step-left">
          <div class="step-number">{{ i + 1 }}</div>
          <div
            v-if="i < steps.length - 1"
            class="step-line"
          />
        </div>
        <span class="step-label">{{ t(step.label) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const steps = [
  { label: 'home.welcome.features.champion' },
  { label: 'home.welcome.features.extras' },
  { label: 'home.welcome.features.live' },
  { label: 'home.welcome.features.ranking' },
];
</script>

<style lang="scss" scoped>
.welcome-widget {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  align-items: flex-start;
  height: 100%;
}

.headline {
  font-size: var(--m-font-size);
  font-weight: 700;
  line-height: 1.3;
  color: var(--bolao-c-white);
}

.description {
  font-size: var(--s-font-size);
  line-height: 1.7;
  color: var(--bolao-c-grey2);
}

.steps {
  display: flex;
  flex-direction: column;
}

.step {
  display: flex;
  gap: var(--s-spacing);
  align-items: flex-start;
}

.step-left {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: var(--xxs-font-size);
  font-weight: 700;
  color: var(--bolao-c-white);
  background-color: var(--bolao-c-blue1-t2);
  border: 1.5px solid var(--bolao-c-blue1);
  border-radius: 50%;
}

.step-line {
  flex: 1;
  width: 1.5px;
  min-height: var(--s-spacing);
  margin: 3px 0;
  background-color: var(--bolao-c-blue3);
}

.step-label {
  padding-top: 3px;
  padding-bottom: var(--m-spacing);
  font-size: var(--xs-font-size);
  line-height: 1.4;
  color: var(--bolao-c-grey2);
}
</style>
