<template>
  <div
    class="wc-sticker"
    :class="{ 'wc-sticker--loading': loading }"
    :style="{
      '--sticker-color': color,
      '--sticker-color-dark': colorDark,
      '--sticker-text-color': textColor,
    }"
  >
    <template v-if="loading">
      <PrimeSkeleton class="skel-header" />
      <PrimeSkeleton class="skel-photo" />
      <div class="wc-sticker__info">
        <PrimeSkeleton class="skel-name" />
        <PrimeSkeleton class="skel-sub" />
        <PrimeSkeleton class="skel-cap" />
      </div>
    </template>

    <template v-else>
      <div class="wc-sticker__header">
        <slot name="header" />
      </div>
      <div class="wc-sticker__photo">
        <slot name="photo" />
      </div>
      <div class="wc-sticker__info">
        <slot name="info" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  color?: string;
  colorDark?: string;
  loading?: boolean;
  textColor?: string;
}

withDefaults(defineProps<Props>(), {
  color: 'var(--bolao-c-gold)',
  colorDark: 'var(--bolao-c-gold-d2)',
  loading: false,
  textColor: 'rgb(0 0 0 / 80%)',
});
</script>

<style lang="scss" scoped>
.wc-sticker {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 4px;
  overflow: hidden;
  border-radius: 12px;
  box-shadow:
    0 6px 16px rgb(0 0 0 / 35%),
    0 0 24px rgb(from var(--sticker-color) r g b / 20%);

  &::before {
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    content: '';
    background: linear-gradient(160deg, var(--sticker-color), var(--sticker-color-dark) 50%, var(--sticker-color));
    border-radius: 12px;
  }

  &::after {
    position: absolute;
    top: -50%;
    left: -50%;
    z-index: 3;
    width: 200%;
    height: 200%;
    pointer-events: none;
    content: '';
    background: linear-gradient(90deg, transparent 30%, rgb(255 255 255 / 25%) 50%, transparent 70%);
  }

  @media (prefers-reduced-motion: no-preference) {
    &::after {
      animation: shimmer 3s infinite;
    }
  }
}

.wc-sticker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--xs-spacing) var(--s-spacing);
  overflow: hidden;
  font-size: var(--xs-font-size);
  font-weight: 700;
  color: var(--sticker-text-color);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: linear-gradient(90deg, var(--sticker-color), var(--sticker-color-dark));
  border-top-left-radius: 9px;
  border-top-right-radius: 9px;
}

.wc-sticker__photo {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 130px;
  overflow: hidden;
  background-color: #d4d0c8;
}

.wc-sticker__info {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  padding: var(--s-spacing);
  background-color: var(--bolao-c-white-d1);
  border-bottom-right-radius: 9px;
  border-bottom-left-radius: 9px;
}

.wc-sticker--loading {
  box-shadow: none;

  &::before,
  &::after {
    display: none;
  }

  .wc-sticker__info {
    border-radius: 0;
  }
}

.skel-header {
  height: 36px !important;
  border-radius: 0 !important;
}

.skel-photo {
  height: 130px !important;
  border-radius: 0 !important;
}

.skel-name {
  width: 80% !important;
  height: 14px !important;
}

.skel-sub {
  width: 55% !important;
  height: 11px !important;
}

.skel-cap {
  width: 45% !important;
  height: 11px !important;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%);
  }

  100% {
    transform: translateX(100%) translateY(100%);
  }
}
</style>
