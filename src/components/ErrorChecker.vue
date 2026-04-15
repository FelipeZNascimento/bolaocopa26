<template>
  <PrimeMessage
    v-show="errorConfiguration"
    class="error-message"
    severity="error"
    variant="outlined"
  >
    Ops, houve um problema de comunicação com o servidor.
    <p>
      Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir, entre em contato com os
      administradores do Bolão.
    </p>
    <p>{{ errorConfiguration }}</p>
  </PrimeMessage>
  <PrimeMessage
    v-show="errorMatches"
    class="error-message"
    severity="error"
    variant="outlined"
  >
    Ops, houve um problema de comunicação com o servidor para buscar as partidas.
    <p>
      Certifique-se de que sua conexão está estável e tente novamente. Se o erro persistir, entre em contato com os
      administradores do Bolão.
    </p>
    <p>{{ errorMatches }}</p>
  </PrimeMessage>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import { useConfigurationStore } from '@/stores/configuration';
import { useMatchesStore } from '@/stores/matches';

const configurationStore = useConfigurationStore();
const matchesStore = useMatchesStore();

const errorConfiguration = computed(() => configurationStore.error);
const errorMatches = computed(() => matchesStore.error);
</script>
<style lang="scss" scoped>
.error-message {
  width: 90%;
  margin: var(--xl-spacing);
}
</style>
