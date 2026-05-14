<template>
  <span
    class="badge"
    :class="isOnline ? 'badgeOnline' : 'badgeOffline'"
  />
</template>

<script setup lang="ts">
defineProps<{
  isOnline: boolean;
}>();
</script>

<style scoped lang="scss">
%badge {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.badge {
  @extend %badge;
}

.badgeOnline {
  @extend %badge;

  position: relative;
  background-color: var(--bolao-c-mint);

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    width: 8px;
    height: 8px;
    content: '';
    border: 1px solid var(--bolao-c-mint);
    border-radius: 50%;
    animation: ripple 2s infinite ease-in-out;
  }
}

.badgeOffline {
  @extend %badge;

  background-color: var(--bolao-c-grey3);
  opacity: 0.4;
}

@keyframes ripple {
  0% {
    opacity: 0.8;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(2.5);
  }
}
</style>
