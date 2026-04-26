<template>
  <div
    v-if="activeProfile"
    class="ribbon"
    :class="{
      'gold-bg': hitLevel === HIT_LEVELS.exactScore,
      'green-bg': hitLevel === HIT_LEVELS.oneScore,
      'blue-bg': hitLevel === HIT_LEVELS.winnerOnly,
      'red-bg': hitLevel === HIT_LEVELS.miss,
      'grey-bg': hitLevel === null,
    }"
  >
    <div
      v-if="hitLevel === null"
      v-tooltip.top="'Sem aposta'"
      style="width: 100%; text-align: center"
    >
      <i v-show="hitLevel === null" class="pi pi-circle" />
    </div>
    <!-- <div v-else v-tooltip.top="HIT_LEVELS_LABELS[hitLevel]" style="width: 100%; text-align: center">
      {{ HIT_LEVELS_POINTS[hitLevel] }}
    </div> -->
    <div v-else>
      <i
        v-show="hitLevel === HIT_LEVELS.exactScore"
        v-tooltip.top="HIT_LEVELS_LABELS[hitLevel]"
        class="pi pi-trophy"
      />
      <i
        v-show="hitLevel === HIT_LEVELS.oneScore"
        v-tooltip.top="HIT_LEVELS_LABELS[hitLevel]"
        class="pi pi-verified"
      />
      <i
        v-show="hitLevel === HIT_LEVELS.winnerOnly"
        v-tooltip.top="HIT_LEVELS_LABELS[hitLevel]"
        class="pi pi-check-circle"
      />
      <i
        v-show="hitLevel === HIT_LEVELS.miss"
        v-tooltip.top="HIT_LEVELS_LABELS[hitLevel]"
        class="pi pi-times-circle"
      />
      <i
        v-show="hitLevel === null"
        v-tooltip.top="HIT_LEVELS_LABELS[hitLevel]"
        class="pi pi-circle"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";

import { HIT_LEVELS, HIT_LEVELS_LABELS, type HitLevel } from "@/constants/bets";
import { useActiveProfileStore } from "@/stores/activeProfile";

withDefaults(
  defineProps<{
    hitLevel?: HitLevel | null;
  }>(),
  {
    hitLevel: null,
  },
);

// ------ Initialization ------
const activeProfileStore = useActiveProfileStore();

// ------ Computed Properties ------
const activeProfile = computed(() => {
  return activeProfileStore.activeProfile;
});
</script>
<style lang="scss" scoped>
.ribbon {
  /* control the folded part */
  --f: 0.2em;
  /* control the cutout */
  --r: 0.4em;

  // font-size: var(--s-font-size);
  color: #fff;
  position: absolute;
  right: 4px;
  top: calc(-1 * var(--f));
  padding-top: var(--s-spacing);
  border: solid #0000;
  border-width: 0 calc(2 * var(--f)) var(--r) 0;
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100%
    0 / calc(2 * var(--f)) var(--f) no-repeat border-box;
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
  width: 36px;
  height: 44px;
  text-align: center;

  .pi {
    font-size: var(--l-font-size);
  }

  @media (max-width: 1023px) {
    height: 40px;

    i {
      font-size: var(--xs-font-size);
    }
  }
}

.gold-bg {
  --c: var(--bolao-c-gold-l2);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100%
    0 / calc(2 * var(--f)) var(--f) no-repeat border-box;
  background-color: var(--c);
  color: var(--bolao-c-gold-d2);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent 20%,
      rgba(255, 255, 255, 0.6) 50%,
      transparent 80%
    );
    animation: gold-shine 3s ease-in-out infinite;
    pointer-events: none;
    clip-path: inherit;
  }
}

@keyframes gold-shine {
  0% {
    transform: translateX(-150%) rotate(30deg);
  }
  100% {
    transform: translateX(150%) rotate(30deg);
  }
}

.green-bg {
  --c: var(--bolao-c-green-l3);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100%
    0 / calc(2 * var(--f)) var(--f) no-repeat border-box;
  background-color: var(--c);
  color: var(--bolao-c-green-d1);
}

.orange-bg {
  --c: var(--bolao-c-orange);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100%
    0 / calc(2 * var(--f)) var(--f) no-repeat border-box;
  background-color: var(--c);
}

.blue-bg {
  --c: var(--bolao-c-blue-l2);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100%
    0 / calc(2 * var(--f)) var(--f) no-repeat border-box;
  background-color: var(--c);
  color: var(--bolao-c-blue-d2);
}

.white-bg {
  --c: var(--bolao-c-white);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100%
    0 / calc(2 * var(--f)) var(--f) no-repeat border-box;
  background-color: var(--c);
  color: var(--bolao-c-black);
}

.red-bg {
  --c: var(--bolao-c-red);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100%
    0 / calc(2 * var(--f)) var(--f) no-repeat border-box;
  background-color: var(--c);
  color: var(--bolao-c-red-l3);
}

.grey-bg {
  --c: var(--bolao-c-grey4);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100%
    0 / calc(2 * var(--f)) var(--f) no-repeat border-box;
  background-color: var(--c);
}
</style>
