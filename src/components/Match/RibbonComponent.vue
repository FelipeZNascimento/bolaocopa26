<template>
  <Transition name="ribbon">
    <div
      v-if="activeProfile"
      :key="hitLevel ?? 'none'"
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
        v-tooltip.top="t('hitLevels.noBet')"
        style="width: 100%; text-align: center"
      >
        <i
          v-show="hitLevel === null"
          class="pi pi-circle"
        />
      </div>
      <div v-else>
        <i
          v-show="hitLevel === HIT_LEVELS.exactScore"
          v-tooltip.top="t(HIT_LEVELS_LABELS[HIT_LEVELS.exactScore], { points: props.points })"
          class="pi pi-trophy"
        />
        <i
          v-show="hitLevel === HIT_LEVELS.oneScore"
          v-tooltip.top="t(HIT_LEVELS_LABELS[HIT_LEVELS.oneScore], { points: props.points })"
          class="pi pi-verified"
        />
        <i
          v-show="hitLevel === HIT_LEVELS.winnerOnly"
          v-tooltip.top="t(HIT_LEVELS_LABELS[HIT_LEVELS.winnerOnly], { points: props.points })"
          class="pi pi-check-circle"
        />
        <i
          v-show="hitLevel === HIT_LEVELS.miss"
          v-tooltip.top="t(HIT_LEVELS_LABELS[HIT_LEVELS.miss], { points: props.points })"
          class="pi pi-times-circle"
        />
        <i
          v-show="hitLevel === null"
          v-tooltip.top="t('hitLevels.noBet')"
          class="pi pi-circle"
        />
      </div>
    </div>
  </Transition>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { HIT_LEVELS, HIT_LEVELS_LABELS, type THitLevel } from '@/constants/bets';
import { useActiveProfileStore } from '@/stores/activeProfile';

const props = withDefaults(
  defineProps<{
    hitLevel?: null | THitLevel;
    points: null | number;
  }>(),
  { hitLevel: null },
);

const { t } = useI18n();

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

  position: absolute;
  top: calc(-1 * var(--f));
  right: 4px;
  z-index: 999; // Above match box-shadow
  width: 36px;
  height: 44px;
  padding-top: var(--s-spacing);

  color: #fff;
  text-align: center;
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: #bf4d28;
  border: solid #0000;
  border-width: 0 calc(2 * var(--f)) var(--r) 0;
  border-radius: var(--f) var(--f) 0 0;
  box-shadow: 0 0 15px 1px #0006;
  clip-path: polygon(
    100% 0,
    0 0,
    0 calc(100% - var(--r)),
    calc(50% - var(--f)) 100%,
    calc(100% - 2 * var(--f)) calc(100% - var(--r)),
    calc(100% - 2 * var(--f)) var(--f),
    100% var(--f)
  );

  .pi {
    font-size: var(--l-font-size);
  }

  @media (width <= 1023px) {
    width: 30px;
    height: 35px;

    .pi {
      font-size: var(--s-font-size);
    }
  }
}

.gold-bg {
  --c: var(--bolao-c-gold-l2);

  color: var(--bolao-c-gold-d2);
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);

  &::before {
    position: absolute;
    inset: 0;
    pointer-events: none;
    content: '';
    background: linear-gradient(90deg, transparent 20%, rgb(255 255 255 / 60%) 50%, transparent 80%);
    clip-path: inherit;
    animation: gold-shine 3s ease-in-out infinite;
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

  color: var(--bolao-c-green-d1);
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.orange-bg {
  --c: var(--bolao-c-orange);

  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.blue-bg {
  --c: var(--bolao-c-blue-l2);

  color: var(--bolao-c-blue-d2);
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.white-bg {
  --c: var(--bolao-c-white);

  color: var(--bolao-c-black);
  background: radial-gradient(50% 100% at bottom, #0005 98%, #0000 101%) 100% 0 / calc(2 * var(--f)) var(--f) no-repeat
    border-box;
  background-color: var(--c);
}

.red-bg {
  --c: var(--bolao-c-red);

  color: var(--bolao-c-red-l3);
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

.ribbon-enter-active,
.ribbon-leave-active {
  transform-origin: top center;
}

@media (prefers-reduced-motion: no-preference) {
  @keyframes ribbon-roll-up {
    0% {
      opacity: 1;
      transform: perspective(200px) rotateX(0deg);
    }

    10% {
      transform: perspective(200px) rotateX(10deg);
    }

    100% {
      opacity: 0;
      transform: perspective(200px) rotateX(-95deg);
    }
  }

  @keyframes ribbon-roll-down {
    0% {
      opacity: 0;
      transform: perspective(200px) rotateX(-95deg);
    }

    26% {
      opacity: 1;
      transform: perspective(200px) rotateX(32deg);
    }

    44% {
      transform: perspective(200px) rotateX(-18deg);
    }

    60% {
      transform: perspective(200px) rotateX(9deg);
    }

    74% {
      transform: perspective(200px) rotateX(-4deg);
    }

    86% {
      transform: perspective(200px) rotateX(1.5deg);
    }

    100% {
      opacity: 1;
      transform: perspective(200px) rotateX(0deg);
    }
  }

  .ribbon-enter-active {
    animation: ribbon-roll-down 1.8s linear;
  }

  .ribbon-leave-active {
    animation: ribbon-roll-up 1.2s cubic-bezier(0.4, 0, 0.95, 0.6);
  }
}
</style>
