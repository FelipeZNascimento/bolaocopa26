<template>
  <div
    v-if="activeProfile && hitLevel"
    class="ribbon"
    :class="{
      'green-bg': hitLevel === HIT_LEVELS.exactScore,
      'blue-bg': hitLevel === HIT_LEVELS.oneScore,
      'white-bg': hitLevel === HIT_LEVELS.winnerOnly,
      'red-bg': hitLevel === HIT_LEVELS.miss,
      'grey-bg': hitLevel === null,
    }"
  >
    <!-- <i v-show="hitLevel === HIT_LEVELS.exactScore" v-tooltip.top="'Na mosca'" class="pi pi-bullseye"></i> -->
    <i v-show="hitLevel === HIT_LEVELS.exactScore" v-tooltip.top="'Na mosca'" class="pi pi-star-fill"></i>
    <i
      v-show="hitLevel === HIT_LEVELS.oneScore"
      v-tooltip.top="'Vencedor e 1/2 placar'"
      class="pi pi-star-half-fill"
    ></i>
    <i v-show="hitLevel === HIT_LEVELS.winnerOnly" v-tooltip.top="'Vencedor'" class="pi pi-star-half"></i>
    <i v-show="hitLevel === HIT_LEVELS.miss" v-tooltip.top="'Erroooou!'" class="pi pi-times"></i>
    <i v-show="hitLevel === null" v-tooltip.top="'Sem apostas'" class="pi pi-times"></i>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';

import { HIT_LEVELS, type HitLevel } from '@/constants/bets';
import { useActiveProfileStore } from '@/stores/activeProfile';

defineProps<{
  hitLevel?: HitLevel | null;
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
  --r: 0.4em;
  /* control the cutout */

  font-size: var(--m-font-size);
  font-weight: bold;
  color: #fff;
  position: absolute;
  right: 4px;
  top: calc(-1 * var(--f));
  padding: 0.2em;
  border: solid #0000;
  border-width: 0 calc(2 * var(--f)) var(--r) 0;
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: #bf4d28;
  border-radius: var(--f) var(--f) 0 0;
  clip-path: polygon(
    100% 0,
    0 0,
    0 calc(100% - var(--r)),
    calc(50% - var(--f)) 100%,
    calc(100% - 2 * var(--f)) calc(100% - var(--r)),
    calc(100% - 2 * var(--f)) var(--f),
    100% var(--f)
  );
  z-index: 1;
  box-shadow: 0 0 15px 1px #0006;

  @media (max-width: 1023px) {
    height: 30px;
    right: 0px;
    padding: 0 0.2em;

    i {
      font-size: var(--xs-font-size);
    }
  }
}

.green-bg {
  --c: var(--bolao-c-green);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
  color: var(--bolao-c-gold);
}

.orange-bg {
  --c: var(--bolao-c-orange);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.blue-bg {
  --c: var(--bolao-c-blue);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
  color: var(--bolao-c-gold);
}

.white-bg {
  --c: var(--bolao-c-blue);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
  color: var(--bolao-c-white);
}

.red-bg {
  --c: var(--bolao-c-red);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.grey-bg {
  --c: var(--bolao-c-grey4);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}
</style>
