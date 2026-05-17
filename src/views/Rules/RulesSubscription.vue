<template>
  <div
    id="inscricoes"
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
        ><h2>{{ t('rules.subscription.title') }}</h2></template
      >
      <p>{{ t('rules.subscription.deadline') }}</p>
      <p>{{ t('rules.subscription.paymentRequired') }}</p>
      <div
        class="payments-container"
        style=""
      >
        <div class="payment-section">
          <h3>🇧🇷 {{ t('rules.subscription.pixQrCode') }}</h3>
          <img
            src="https://assets.omegafox.me/copa/misc/qr-code.png"
            height="200"
          />
        </div>
        <div class="payment-section">
          <h3>🇧🇷 {{ t('rules.subscription.pixCopyPaste') }}</h3>
          <ClipboardText
            text="00020126580014BR.GOV.BCB.PIX0136395.825.028-945204000053039865802BR5925Nelson Gimenez da Motta6009Sao Paulo62070503***6304"
          />
        </div>
        <div class="payment-section">
          <h3>🇧🇷 {{ t('rules.subscription.pixInfo') }}</h3>
          <p class="padded">
            <span style="font-weight: bold">{{ t('rules.subscription.pixValue') }}</span
            >: R$100,00
          </p>
          <p class="padded">395.825.028-94</p>
          <p class="padded">Nelson Gimenez da Motta</p>
        </div>
        <div class="payment-section">
          <h3>🇵🇹 {{ t('rules.subscription.mbWayInfo') }}</h3>
          <p class="padded">
            <span style="font-weight: bold">{{ t('rules.subscription.pixValue') }}</span
            >: €20.00
          </p>
          <p class="padded">916 166 514</p>
          <p class="padded">Felipe Zanon do Nascimento</p>
        </div>
        <div class="payment-section">
          <h3>🌏 {{ t('rules.subscription.payPalInfo') }}</h3>
          <p class="padded">
            <span style="font-weight: bold">{{ t('rules.subscription.pixValue') }}</span
            >: €20.00
          </p>
          <p class="padded">
            <span style="font-weight: bold">{{ t('rules.subscription.pixValue') }}</span
            >: $25.00
          </p>
          <p class="padded">felipe@omegafox.me</p>
        </div>
      </div>

      <p style="padding-top: var(--s-spacing)">{{ t('rules.subscription.sendProof') }}</p>
      <p class="padded">Nelson Gimenez da Motta:</p>
      <p class="double-padded">
        <i class="pi pi-envelope"></i> <a href="mailto:ngm.motta@gmail.com">ngm.motta@gmail.com</a>
      </p>
      <p class="double-padded">
        <i class="pi pi-whatsapp"></i>
        <a
          href="https://wa.me/5511966031088"
          target="_blank"
          >+55 (11) 96603-1088</a
        >
      </p>
      <p class="double-padded">
        <i class="pi pi-telegram"></i>
        <a
          href="https://t.me/NelsonMotta"
          target="_blank"
          >@NelsonMotta</a
        >
      </p>

      <p class="padded">Felipe Zanon do Nascimento:</p>

      <p class="double-padded">
        <i class="pi pi-envelope"></i> <a href="mailto:sharpion.k@gmail.com">sharpion.k@gmail.com</a>
      </p>
      <p class="double-padded">
        <i class="pi pi-whatsapp"></i>
        <a
          href="https://wa.me/351916166514"
          target="_blank"
          >+351 916 166 514</a
        >
      </p>
      <p class="double-padded">
        <i class="pi pi-telegram"></i>
        <a
          href="https://t.me/FelipeZanon"
          target="_blank"
          >@FelipeZanon</a
        >
      </p>
      <p style="padding-top: var(--s-spacing)">
        {{ t('rules.subscription.activationNote') }}
        <span style="font-weight: bold">{{ t('rules.subscription.activationNoteHighlight') }}</span
        >{{ t('rules.subscription.activationNoteSuffix') }}
      </p>
    </PrimePanel>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import ClipboardText from '@/components/ClipboardText.vue';
import { useRulesPanel } from '@/composables/useRulesPanel';

const { isOpen, panelPt } = useRulesPanel('inscricoes');
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

.payments-container {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--l-spacing);
  width: 100%;
  padding: var(--l-spacing);
  background-color: var(--bolao-c-black-t1);

  @media (width <= 768px) {
    grid-template-columns: 1fr;
  }

  .payment-section {
    padding: var(--m-spacing);
    font-size: var(--s-font-size);
    text-align: center;
    background-color: var(--bolao-c-grey5-t1);
    border-radius: var(--border-radius);
    box-shadow: 0 4px 12px rgb(0 0 0 / 55%);

    h3 {
      padding-bottom: var(--s-spacing);
      font-weight: bold;
    }
  }
}

i {
  margin-right: var(--s-spacing);
}
</style>
