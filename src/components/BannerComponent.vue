<template>
  <div class="active-banner">
    <template
      v-for="(item, i) in items"
      :key="i"
    >
      <h3
        v-if="item.type === 'title'"
        style="font-weight: bold"
      >
        {{ t(item.key) }}
      </h3>
      <RouterLink
        v-else-if="item.type === 'link'"
        :to="item.route"
        >{{ t(item.key) }}</RouterLink
      >
      <span v-else>
        <i
          v-if="item.icon"
          :class="item.icon"
        />
        {{ t(item.key) }}
      </span>
    </template>
    <button
      v-if="dismissKey"
      class="banner-dismiss"
      :aria-label="$t('common.dismiss')"
      @click="dismissBanner"
    >
      <i class="pi pi-times" />
    </button>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

export type BannerItem =
  | { icon?: string; key: string; type: 'description' }
  | { key: string; route: string; type: 'link' }
  | { key: string; type: 'title' };

const props = defineProps<{
  dismissKey?: string;
  items: BannerItem[];
}>();

const emit = defineEmits<{ dismissed: [] }>();

const { t } = useI18n();

function dismissBanner() {
  if (!props.dismissKey) return;
  localStorage.setItem(props.dismissKey, 'true');
  emit('dismissed');
}
</script>
<style lang="scss" scoped>
.active-banner {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  padding: var(--s-spacing) var(--xxl-spacing);
  margin-bottom: var(--l-spacing);
  color: var(--bolao-c-grey2);
  text-align: center;
  background-color: var(--bolao-c-blue5);
  border: 1px solid var(--bolao-c-blue3);
  border-radius: var(--border-radius);
}

.banner-dismiss {
  position: absolute;
  top: 50%;
  right: var(--s-spacing);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 50%;
  opacity: 0.6;
  transform: translateY(-50%);
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  .pi {
    font-size: var(--xs-font-size);
    color: var(--bolao-c-grey2);
  }
}
</style>
