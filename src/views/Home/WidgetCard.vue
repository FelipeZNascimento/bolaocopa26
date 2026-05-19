<template>
  <div
    class="widget-card"
    :class="{
      'is-dragging': isDragging,
      'is-drag-over': isDragOver,
    }"
    :data-widget-id="widgetId"
    @dragover.prevent="emit('dragover')"
    @dragleave="emit('dragleave')"
    @drop.prevent="emit('drop')"
  >
    <div
      class="drag-handle"
      draggable="true"
      role="button"
      :aria-label="'Reordenar widget'"
      @dragstart.stop="emit('dragstart')"
      @dragend.stop="emit('dragend')"
    >
      <i
        class="pi pi-bars drag-icon"
        @touchstart.passive="emit('handleTouchStart', $event)"
      />
      <span class="widget-title">{{ title }}</span>
    </div>
    <div class="widget-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  isDragging: boolean;
  isDragOver: boolean;
  title: string;
  widgetId: string;
}>();

const emit = defineEmits<{
  dragend: [];
  dragleave: [];
  dragover: [];
  dragstart: [];
  drop: [];
  handleTouchStart: [event: TouchEvent];
}>();
</script>

<style lang="scss" scoped>
.widget-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--bolao-c-blue4);
  border: 2px solid transparent;
  border-radius: var(--border-radius);
  box-shadow: var(--drop-shadow);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &.is-dragging {
    opacity: 0.4;
    transform: scale(0.97);
  }

  &.is-drag-over {
    border-color: var(--bolao-c-gold);
    box-shadow:
      0 0 0 3px var(--bolao-c-gold-t1),
      var(--drop-shadow);
  }
}

.drag-handle {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
  justify-content: flex-start;
  padding: var(--s-spacing) var(--m-spacing);
  color: var(--bolao-c-grey4);
  cursor: grab;
  user-select: none;
  background-color: var(--bolao-c-blue5);
  border-bottom: 1px solid var(--bolao-c-blue3);
  border-radius: 6px;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: var(--bolao-c-grey1);
    background-color: var(--bolao-c-blue3);
  }

  &:active {
    cursor: grabbing;
  }
}

.drag-icon {
  touch-action: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  @media (width <= 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: var(--s-font-size);
    color: var(--bolao-c-grey2);
    background-color: var(--bolao-c-blue3);
    border: 1px solid var(--bolao-c-blue1-t2);
    border-radius: 8px;
    transition:
      background-color 0.15s ease,
      transform 0.15s ease;

    &:active {
      background-color: var(--bolao-c-blue1-t2);
      transform: scale(0.93);
    }
  }
}

.widget-title {
  font-size: var(--s-font-size);
  font-weight: 600;
  color: var(--bolao-c-grey3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.widget-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: var(--m-spacing);
}
</style>
