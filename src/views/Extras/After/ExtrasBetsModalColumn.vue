<template>
  <div class="bets-column" :class="{ 'green-bg': isCorrect }">
    <p class="bets-column-header">{{ title }} ({{ users.length }})</p>
    <div class="bets-line" v-for="(user, index) in users" :key="index">
      <IconAndName v-if="!isMobile" :color="user.color" :name="user.name" :icon="user.icon" />
      <span v-else>{{ user.name }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isMobile } from '@basitcodeenv/vue3-device-detect';

import type { IUser } from '@/stores/activeProfile.types';

import IconAndName from '@/components/IconAndName.vue';

defineProps<{
  isCorrect: boolean;
  title: string;
  users: Pick<IUser, 'color' | 'icon' | 'id' | 'name'>[];
}>();

// ------ Computed Properties ------
</script>

<style lang="scss" scoped>
.bets-column {
  display: flex;
  flex: 1 0 0;
  min-width: 0;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  border: 1px solid var(--bolao-c-grey1-t1);
  padding: var(--xs-spacing);
}

.green-bg {
  background-color: var(--bolao-c-green-t1);
}

.bets-column-header {
  text-align: center;
  width: 100%;
  font-size: var(--m-font-size);
  font-weight: bold;
}

.bets-line {
  display: flex;
  padding: var(--xxs-spacing) 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}
</style>
