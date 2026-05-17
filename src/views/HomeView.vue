<template>
  <div class="home-view">
    <div
      style="
        padding: var(--s-spacing);
        margin-bottom: var(--l-spacing);
        background-color: var(--bolao-c-blue5);
        border: 1px solid var(--bolao-c-blue3);
        border-radius: var(--border-radius);
      "
    >
      <h3 style="text-align: center">
        {{ $t('home.dashboard') }}
      </h3>
    </div>
    <TransitionGroup
      name="widget"
      tag="div"
      class="widget-grid"
    >
      <WidgetCard
        v-for="widgetId in visibleWidgets"
        :key="widgetId"
        :widget-id="widgetId"
        :title="WIDGET_TITLES[widgetId]"
        :is-dragging="draggedId === widgetId"
        :is-drag-over="dragOverId === widgetId || touchTargetId === widgetId"
        @dragstart="onDragStart(widgetId)"
        @dragend="onDragEnd"
        @dragover="onDragOver(widgetId)"
        @dragleave="onDragLeave"
        @drop="onDrop(widgetId)"
        @handle-touch-start="onTouchStart($event, widgetId)"
      >
        <NextMatchesWidget
          v-if="widgetId === 'next-matches'"
          :matches="nextMatches"
        />
        <LiveMatchesWidget
          v-else-if="widgetId === 'live-matches'"
          :matches="liveMatches"
        />
        <NextMatchBetStatusWidget v-else-if="widgetId === 'betStatus'" />
        <WelcomeWidget v-else-if="widgetId === 'welcome'" />
        <LogoWidget v-else-if="widgetId === 'logo'" />
        <RulesWidget v-else-if="widgetId === 'rules'" />
        <ExtrasWidget v-else-if="widgetId === 'extras'" />
        <RankingWidget v-else-if="widgetId === 'ranking'" />
      </WidgetCard>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { MATCH_STATUS } from '@/constants/match';
import { useMatchesStore } from '@/stores/matches';

import ExtrasWidget from './Home/ExtrasWidget.vue';
import LiveMatchesWidget from './Home/LiveMatchesWidget.vue';
import LogoWidget from './Home/LogoWidget.vue';
import NextMatchBetStatusWidget from './Home/NextMatchBetStatusWidget.vue';
import NextMatchesWidget from './Home/NextMatchesWidget.vue';
import RankingWidget from './Home/RankingWidget.vue';
import RulesWidget from './Home/RulesWidget.vue';
import WelcomeWidget from './Home/WelcomeWidget.vue';
import WidgetCard from './Home/WidgetCard.vue';

type WidgetId = 'betStatus' | 'extras' | 'live-matches' | 'logo' | 'next-matches' | 'ranking' | 'rules' | 'welcome';

const WIDGET_TITLES = computed<Record<WidgetId, string>>(() => ({
  betStatus: t('home.widgets.betStatus'),
  extras: t('home.widgets.extras'),
  'live-matches': t('home.widgets.liveMatches'),
  logo: t('home.widgets.logo'),
  'next-matches': t('home.widgets.nextMatches'),
  ranking: t('home.widgets.ranking'),
  rules: t('home.widgets.rules'),
  welcome: t('home.widgets.welcome'),
}));

const ALL_WIDGET_IDS: WidgetId[] = [
  'logo',
  'welcome',
  'rules',
  'next-matches',
  'live-matches',
  'betStatus',
  'extras',
  'ranking',
];
const STORAGE_KEY = 'home-widget-order';

// ------ Stores ------
const matchesStore = useMatchesStore();
const { t } = useI18n();

// ------ Widget order ------
function loadOrder(): WidgetId[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as WidgetId[];
      const valid = parsed.filter((id) => (ALL_WIDGET_IDS as string[]).includes(id));
      const missing = ALL_WIDGET_IDS.filter((id) => !valid.includes(id));
      return [...valid, ...missing];
    }
  } catch {
    // ignore parse errors
  }
  return [...ALL_WIDGET_IDS];
}

const widgetOrder = ref<WidgetId[]>(loadOrder());

function saveOrder() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgetOrder.value));
}

// ------ Computed ------
const matches = computed(() => matchesStore.matches);

const nextMatches = computed(() =>
  matches.value
    .filter((m) => m.status === MATCH_STATUS.NOT_STARTED)
    .sort((a, b) => parseInt(a.timestamp, 10) - parseInt(b.timestamp, 10))
    .slice(0, 3),
);

const liveMatches = computed(() => matches.value.filter((m) => m.status >= 20));

const visibleWidgets = computed(() =>
  widgetOrder.value.filter((id) => {
    if (id === 'live-matches') return liveMatches.value.length > 0;
    return true;
  }),
);

// ------ Drag & Drop: Desktop ------
const draggedId = ref<null | WidgetId>(null);
const dragOverId = ref<null | WidgetId>(null);

function onDragEnd() {
  draggedId.value = null;
  dragOverId.value = null;
}

function onDragLeave() {
  dragOverId.value = null;
}

function onDragOver(id: WidgetId) {
  if (draggedId.value && draggedId.value !== id) {
    dragOverId.value = id;
  }
}

function onDragStart(id: WidgetId) {
  draggedId.value = id;
}

function onDrop(id: WidgetId) {
  if (draggedId.value && draggedId.value !== id) {
    reorder(draggedId.value, id);
  }
  draggedId.value = null;
  dragOverId.value = null;
}

// ------ Drag & Drop: Mobile / Touch ------
const touchDragId = ref<null | WidgetId>(null);
const touchTargetId = ref<null | WidgetId>(null);

let potentialDragId: null | WidgetId = null;
let touchStartX = 0;
let touchStartY = 0;
let isDragActive = false;

function handleTouchEnd() {
  if (isDragActive && touchDragId.value && touchTargetId.value) {
    reorder(touchDragId.value, touchTargetId.value);
  }
  touchDragId.value = null;
  touchTargetId.value = null;
  potentialDragId = null;
  isDragActive = false;
}

function handleTouchMove(event: TouchEvent) {
  if (!potentialDragId) return;
  const touch = event.touches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Only activate drag after 8px of movement
  if (!isDragActive) {
    if (distance < 8) return;
    isDragActive = true;
    touchDragId.value = potentialDragId;
  }

  event.preventDefault();

  // Find which card is under the finger using bounding rects
  for (const id of visibleWidgets.value) {
    const el = document.querySelector<HTMLElement>(`[data-widget-id="${id}"]`);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (
      touch.clientX >= rect.left &&
      touch.clientX <= rect.right &&
      touch.clientY >= rect.top &&
      touch.clientY <= rect.bottom
    ) {
      touchTargetId.value = id !== touchDragId.value ? id : null;
      return;
    }
  }
  touchTargetId.value = null;
}

function onTouchStart(event: TouchEvent, id: WidgetId) {
  potentialDragId = id;
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  isDragActive = false;
}

// ------ Reorder ------
function reorder(fromId: WidgetId, toId: WidgetId) {
  const newOrder = [...widgetOrder.value];
  const fromIdx = newOrder.indexOf(fromId);
  const toIdx = newOrder.indexOf(toId);
  if (fromIdx === -1 || toIdx === -1) return;
  newOrder.splice(fromIdx, 1);
  newOrder.splice(toIdx, 0, fromId);
  widgetOrder.value = newOrder;
  saveOrder();
}

// ------ Lifecycle ------
onMounted(() => {
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
  document.addEventListener('touchend', handleTouchEnd);
});

onUnmounted(() => {
  document.removeEventListener('touchmove', handleTouchMove);
  document.removeEventListener('touchend', handleTouchEnd);
});
</script>

<style lang="scss" scoped>
.home-view {
  padding: var(--l-spacing);

  @media (width <= 768px) {
    padding: var(--xxl-spacing) var(--s-spacing) var(--s-spacing);
  }
}

.widget-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--l-spacing);
  align-items: stretch;

  @media (width <= 768px) {
    grid-template-columns: 1fr;
    gap: var(--m-spacing);
  }
}

/* Widget transition animations */
.widget-move {
  transition: transform 0.3s ease;
}

.widget-enter-active,
.widget-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.widget-enter-from,
.widget-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
