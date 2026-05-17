<template>
  <div class="welcome-widget">
    <img
      src="/logo-desktop.png"
      alt="Copa 2026 Logo"
      class="logo"
    />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.welcome-widget {
  height: 100%;
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius);
}
</style>
