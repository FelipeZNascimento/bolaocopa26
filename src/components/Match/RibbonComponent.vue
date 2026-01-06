<template>
  <div
    v-if="activeProfile && ribbon"
    class="ribbon"
    :class="{
      'green-bg': ribbon === 'BULLSEYE',
      'blue-bg': ribbon === 'HALF',
      'red-bg': ribbon === 'MISS',
      'grey-bg': ribbon === null,
    }"
  >
    <i v-show="ribbon === 'BULLSEYE'" v-tooltip.top="'Na mosca'" class="pi pi-bullseye"></i>
    <i v-show="ribbon === 'HALF'" v-tooltip.top="'Vencedor correto'" class="pi pi-check"></i>
    <i v-show="ribbon === 'MISS'" v-tooltip.top="'Erroooou!'" class="pi pi-times"></i>
    <i v-show="ribbon === null" v-tooltip.top="'Sem apostas'" class="pi pi-times"></i>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import type { Ribbon } from '@/constants/bets';

import { useActiveProfileStore } from '@/stores/activeProfile';

defineProps<{
  ribbon?: Ribbon;
}>();

// ------ Initialization ------
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties ------
const activeProfile = computed(() => {
  return activeProfileStore.activeProfile;
});
</script>
<style lang="scss" scoped>
.ribbon {
  --f: 0.2em;
  /* control the folded part */
  --r: 0.2em;
  /* control the cutout */

  font-size: var(--m-font-size);
  font-weight: bold;
  color: #fff;
  position: absolute;
  left: 2px;
  top: calc(-1 * var(--f));
  padding: 0.2em;
  border: solid #0000;
  border-width: 0 0 var(--r) calc(2 * var(--f));
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: #bf4d28;
  border-radius: var(--f) var(--f) 0 0;
  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - var(--r)),
    calc(50% + var(--f)) 100%,
    calc(2 * var(--f)) calc(100% - var(--r)),
    calc(2 * var(--f)) var(--f),
    0 var(--f)
  );
  z-index: 1;
  box-shadow: 0 0 15px 1px #0006;

  @media (max-width: 1023px) {
    height: 30px;
    left: 0px;
    padding: 0 0.2em;

    i {
      font-size: var(--xs-font-size);
    }
  }
}

.green-bg {
  --c: var(--bolao-c-green);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.blue-bg {
  --c: var(--bolao-c-blue);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.red-bg {
  --c: var(--bolao-c-red);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.grey-bg {
  --c: var(--bolao-c-grey4);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 0 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}
</style>
