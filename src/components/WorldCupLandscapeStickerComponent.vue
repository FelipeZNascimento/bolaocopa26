<template>
  <div
    class="ls-sticker"
    :class="{
      'ls-sticker--flippable': flippable,
      'ls-sticker--clickable': clickable && !flippable,
      'ls-sticker--flipped': isFlipped,
      'ls-sticker--loading': loading,
    }"
    :style="{
      perspective: '1000px',
      '--sticker-color': color,
      '--sticker-color-dark': colorDark,
    }"
    @click="handleClick"
  >
    <template v-if="loading">
      <PrimeSkeleton class="skel-card" />
    </template>

    <template v-else>
      <div class="ls-sticker__inner">
        <!-- Front face -->
        <div class="ls-sticker__front">
          <div class="ls-sticker__photo">
            <slot name="photo" />
            <div class="ls-sticker__overlay">
              <slot name="overlay" />
            </div>
          </div>

          <div
            v-if="$slots.badge"
            class="ls-sticker__badge"
          >
            <slot name="badge" />
          </div>

          <div
            v-if="flippable || clickable"
            class="ls-sticker__hint"
          >
            <i :class="flippable ? 'pi pi-sync' : 'pi pi-info-circle'" />
          </div>
        </div>

        <!-- Back face — only rendered for flippable cards -->
        <div
          v-if="flippable"
          class="ls-sticker__back"
          @click.stop="isFlipped = false"
        >
          <slot name="back" />
          <div
            v-if="flippable || clickable"
            class="ls-sticker__hint"
          >
            <i :class="flippable ? 'pi pi-sync' : 'pi pi-info-circle'" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Props {
  clickable?: boolean;
  color?: string;
  colorDark?: string;
  flippable?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  clickable: false,
  color: 'var(--bolao-c-white)',
  colorDark: 'var(--bolao-c-gold)',
  flippable: false,
  loading: false,
});

const emit = defineEmits<{
  click: [];
}>();

const isFlipped = ref(false);

function handleClick() {
  if (props.flippable) {
    isFlipped.value = !isFlipped.value;
  } else if (props.clickable) {
    emit('click');
  }
}
</script>

<style lang="scss" scoped>
.ls-sticker {
  position: relative;
  padding: 4px;
  box-shadow:
    0 6px 16px rgb(0 0 0 / 35%),
    0 0 24px rgb(from var(--sticker-color) r g b / 20%);
  transition: box-shadow 0.28s ease-out;

  &::before {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    content: '';
    background: linear-gradient(160deg, var(--sticker-color), var(--sticker-color-dark) 50%, var(--sticker-color));
  }

  &--flippable,
  &--clickable {
    cursor: pointer;
  }

  &--loading {
    aspect-ratio: 3/2;
    box-shadow: none;

    &::before {
      display: none;
    }
  }
}

.ls-sticker__inner {
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.ls-sticker--flipped .ls-sticker__inner {
  transform: rotateY(180deg);
}

@media (hover: hover) {
  .ls-sticker--flippable:not(.ls-sticker--flipped):hover {
    box-shadow:
      0 16px 36px rgb(0 0 0 / 50%),
      0 0 36px rgb(from var(--sticker-color) r g b / 35%);
  }

  .ls-sticker--flippable:not(.ls-sticker--flipped):hover .ls-sticker__inner {
    transform: rotateY(-6deg) rotateX(2deg) translateY(-3px);
  }

  .ls-sticker--flippable:not(.ls-sticker--flipped):hover .ls-sticker__front::after {
    width: 40px;
    height: 40px;
  }
}

.ls-sticker__front {
  position: relative;
}

.ls-sticker--flippable .ls-sticker__front::after {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  pointer-events: none;
  content: '';
  background: linear-gradient(315deg, transparent 65%, rgb(0 0 0 / 30%) 100%), #f7f5f0;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  transition:
    width 0.28s ease-out,
    height 0.28s ease-out;
}

.ls-sticker--flipped .ls-sticker__front::after {
  width: 0;
  height: 0;
}

.ls-sticker__back {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  background-color: #f7f5f0;
  transform: rotateY(180deg);
  backface-visibility: hidden;
}

.ls-sticker__photo {
  position: relative;
  width: 100%;
  aspect-ratio: 3/2;
  overflow: hidden;
}

.ls-sticker__overlay {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  padding: var(--xxl-spacing) var(--m-spacing) var(--s-spacing);
  background: linear-gradient(to top, rgb(0 0 0 / 80%) 0%, transparent 100%);
}

.ls-sticker__badge {
  position: absolute;
  top: var(--s-spacing);
  left: var(--s-spacing);
  padding: 2px var(--xs-spacing);
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10px;
  font-weight: 700;
  color: rgb(0 0 0 / 80%);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  background: linear-gradient(90deg, var(--sticker-color), var(--sticker-color-dark));
}

.ls-sticker__hint {
  position: absolute;
  top: var(--s-spacing);
  right: var(--s-spacing);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: rgb(255 255 255 / 85%);
  background-color: rgb(0 0 0 / 45%);
  border-radius: 50%;

  i {
    font-size: 11px;
  }
}

.ls-sticker__back-hint {
  position: absolute;
  right: var(--s-spacing);
  bottom: var(--s-spacing);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: rgb(0 0 0 / 30%);

  i {
    font-size: 11px;
  }
}

.skel-card {
  width: 100% !important;
  height: 100% !important;
}

@media (prefers-reduced-motion: no-preference) {
  .ls-sticker--flippable .ls-sticker__hint,
  .ls-sticker--clickable .ls-sticker__hint {
    animation: hint-pulse 1.8s ease-in-out 0.8s 3;
  }
}

@keyframes hint-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}
</style>
