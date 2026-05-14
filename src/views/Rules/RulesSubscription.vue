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
      <template #header><h2>Inscrições</h2></template>
      <p>● As inscrições estão abertas até 10/06/2026, às 23h59, horário de Brasília.</p>
      <p>● Após fazer o cadastro, sua participação estará condicionada ao pagamento da inscrição:</p>
      <div
        class="pix-container"
        style="display: flex; width: 100%"
      >
        <div class="pix-section">
          <h3>PIX QR Code</h3>
          <img
            src="https://assets.omegafox.me/copa/misc/qr-code.png"
            height="200"
          />
        </div>
        <div class="pix-section">
          <h3>PIX Copia &amp; Cola</h3>
          <ClipboardText
            text="00020126580014BR.GOV.BCB.PIX0136395.825.028-945204000053039865802BR5925Nelson Gimenez da Motta6009Sao Paulo62070503***6304"
          />
        </div>
        <div class="pix-section">
          <h3>PIX Info</h3>
          <p class="padded"><span style="font-weight: bold">Valor</span>: R$100,00</p>
          <p class="padded">395.825.028-94</p>
          <p class="padded">Nelson Gimenez da Motta</p>
        </div>
      </div>

      <p style="padding-top: var(--s-spacing)">● Após pagamento, envie o comprovante para um dos contatos abaixo:</p>
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
        ● O usuário será liberado para realizar as apostas somente
        <span style="font-weight: bold">após a confirmação da transferência</span>.
      </p>
    </PrimePanel>
  </div>
</template>
<script setup lang="ts">
import ClipboardText from '@/components/ClipboardText.vue';
import { useRulesPanel } from '@/composables/useRulesPanel';

const { isOpen, panelPt } = useRulesPanel('inscricoes');
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

.pix-container {
  display: flex;
  gap: var(--l-spacing);
  justify-content: space-around;
  width: 100%;
  padding: var(--l-spacing);
  background-color: var(--bolao-c-black-t1);

  @media (width <= 768px) {
    flex-direction: column;
  }

  .pix-section {
    flex: 1;
    font-size: var(--s-font-size);
    text-align: center;
  }
}

i {
  margin-right: var(--s-spacing);
}
</style>
