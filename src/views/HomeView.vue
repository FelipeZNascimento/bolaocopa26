<template>
  <div class="home-view">
    <BannerComponent
      v-if="!isDashboardBannerDismissed"
      :items="[
        { key: 'home.dashboard1', type: 'title' },
        { key: 'home.dashboard2', type: 'description', icon: 'pi pi-bars' },
      ]"
      :dismiss-key="BANNER_STORAGE_KEY"
      @dismissed="isDashboardBannerDismissed = true"
    />
    <TransitionGroup
      name="widget"
      tag="div"
      class="widget-grid"
    >
      <WidgetCard
        v-if="isMobile && activeProfile && showPushCard"
        key="push-notifications"
        :draggable="false"
        :is-drag-over="false"
        :is-dragging="false"
        :is-minimized="minimizedWidgets.includes('push-notifications')"
        :title="WIDGET_TITLES['push-notifications']"
        widget-id="push-notifications"
        @toggleMiniMax="onToggleminiMax('push-notifications')"
      >
        <PushNotificationsWidget @done="showPushCard = false" />
      </WidgetCard>
      <!-- Only maximized widgets -->
      <WidgetCard
        v-for="widgetId in visibleWidgets.filter((id) => isMobile || !minimizedWidgets.includes(id))"
        :key="widgetId"
        :widget-id="widgetId"
        :title="WIDGET_TITLES[widgetId]"
        :is-minimized="minimizedWidgets.includes(widgetId)"
        :is-dragging="draggedId === widgetId"
        :is-drag-over="dragOverId === widgetId || touchTargetId === widgetId"
        @dragstart="onDragStart(widgetId)"
        @dragend="onDragEnd"
        @dragover="onDragOver(widgetId)"
        @dragleave="onDragLeave"
        @drop="onDrop(widgetId)"
        @handle-touch-start="onTouchStart($event, widgetId)"
        @toggleMiniMax="onToggleminiMax(widgetId)"
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
        <SocialGroupsWidget v-else-if="widgetId === 'social-groups'" />
        <ExtrasWidget v-else-if="widgetId === 'extras'" />
        <RankingWidget v-else-if="widgetId === 'ranking'" />
        <NewsWidget v-else-if="widgetId === 'news'" />
      </WidgetCard>
      <!-- Only minimized widgets -->
      <div v-if="!isMobile">
        <WidgetCard
          v-for="widgetId in visibleWidgets.filter((id) => minimizedWidgets.includes(id))"
          :key="widgetId"
          :widget-id="widgetId"
          :title="WIDGET_TITLES[widgetId]"
          :is-minimized="true"
          :is-dragging="draggedId === widgetId"
          :is-drag-over="dragOverId === widgetId || touchTargetId === widgetId"
          @dragstart="onDragStart(widgetId)"
          @dragend="onDragEnd"
          @dragover="onDragOver(widgetId)"
          @dragleave="onDragLeave"
          @drop="onDrop(widgetId)"
          @handle-touch-start="onTouchStart($event, widgetId)"
          @toggleMiniMax="onToggleminiMax(widgetId)"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import BannerComponent from '@/components/BannerComponent.vue';
import MatchService from '@/services/match';
import { useViewport } from '@/services/viewport';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useExtraBetStore } from '@/stores/extraBet';
import { useMatchesStore } from '@/stores/matches';

import ExtrasWidget from './Home/ExtrasWidget.vue';
import LiveMatchesWidget from './Home/LiveMatchesWidget.vue';
import LogoWidget from './Home/LogoWidget.vue';
import NewsWidget from './Home/NewsWidget.vue';
import NextMatchBetStatusWidget from './Home/NextMatchBetStatusWidget.vue';
import NextMatchesWidget from './Home/NextMatchesWidget.vue';
import PushNotificationsWidget from './Home/PushNotificationsWidget.vue';
import RankingWidget from './Home/RankingWidget.vue';
import RulesWidget from './Home/RulesWidget.vue';
import SocialGroupsWidget from './Home/SocialGroupsWidget.vue';
import WelcomeWidget from './Home/WelcomeWidget.vue';
import WidgetCard from './Home/WidgetCard.vue';

type WidgetId =
  | 'betStatus'
  | 'extras'
  | 'live-matches'
  | 'logo'
  | 'news'
  | 'next-matches'
  | 'push-notifications'
  | 'ranking'
  | 'rules'
  | 'social-groups'
  | 'welcome';

const WIDGET_TITLES = computed<Record<WidgetId, string>>(() => ({
  betStatus: t('home.widgets.betStatus'),
  extras: t('home.widgets.extras'),
  'live-matches': t('home.widgets.liveMatches'),
  logo: t('home.widgets.logo'),
  news: t('home.widgets.news'),
  'next-matches': t('home.widgets.nextMatches'),
  'push-notifications': t('pushNotifications.prompt.title'),
  ranking: t('home.widgets.ranking'),
  rules: t('home.widgets.rules'),
  'social-groups': t('home.widgets.socialGroups'),
  welcome: t('home.widgets.welcome'),
}));

const ALL_WIDGET_IDS: WidgetId[] = [
  'logo',
  'welcome',
  'news',
  'rules',
  'social-groups',
  'next-matches',
  'live-matches',
  'betStatus',
  'extras',
  'ranking',
];

function checkFirstVisitForNewWidget(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      return !parsed.includes('news');
    }
  } catch {
    // ignore parse errors
  }
  return true;
}
const BANNER_STORAGE_KEY = 'home-dashboard-banner-dismissed';
const STORAGE_KEY = 'home-widget-order';
const STORAGE_KEY_MINIMIZED = 'home-widget-minimized';

// ------ Stores ------
const matchesStore = useMatchesStore();
const extraBetsStore = useExtraBetStore();
const activeProfileStore = useActiveProfileStore();
const { isMobile } = useViewport();
const { t } = useI18n();

// ------ Push notification widget ------
const activeProfile = computed(() => activeProfileStore.activeProfile);
const showPushCard = ref('PushManager' in window && 'Notification' in window && Notification.permission !== 'granted');

// ------ Initialization ------
const matchService = new MatchService();
matchService.fetchNextMatches();
matchService.fetchLiveMatches();

// ------ Handle Minimized/Maximized Widgets ------
function loadMinimized(): WidgetId[] {
  const minimized = localStorage.getItem(STORAGE_KEY_MINIMIZED);
  return minimized ? (JSON.parse(minimized) as WidgetId[]) : [];
}

function onToggleminiMax(widgetId: WidgetId) {
  console.log('calling here with: ', widgetId);
  const index = minimizedWidgets.value.findIndex((id) => id === widgetId);
  if (index === -1) {
    minimizedWidgets.value.push(widgetId);
  } else {
    minimizedWidgets.value.splice(index, 1);
  }

  saveMiniMax();
}

function saveMiniMax() {
  localStorage.setItem(STORAGE_KEY_MINIMIZED, JSON.stringify(minimizedWidgets.value));
}

// ------ Dashboard banner ------
const isDashboardBannerDismissed = ref(localStorage.getItem(BANNER_STORAGE_KEY) === 'true');

// ------ Widget order ------
function loadOrder(): WidgetId[] {
  const firstVisit = checkFirstVisitForNewWidget();

  let base: WidgetId[];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as WidgetId[];
      const valid = parsed.filter((id) => (ALL_WIDGET_IDS as string[]).includes(id));
      const missing = ALL_WIDGET_IDS.filter((id) => !valid.includes(id));
      base = [...valid, ...missing];
    } else {
      base = [...ALL_WIDGET_IDS];
    }
  } catch {
    base = [...ALL_WIDGET_IDS];
  }

  if (firstVisit) {
    const order: WidgetId[] = ['news', ...base.filter((id) => id !== 'news')];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    return order;
  }
  return base;
}

const widgetOrder = ref<WidgetId[]>(loadOrder());
const minimizedWidgets = ref<WidgetId[]>(loadMinimized());

function saveOrder() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgetOrder.value));
}
// ------ Computed ------
const nextMatches = computed(() => matchesStore.nextMatches);
const liveMatches = computed(() => matchesStore.liveMatches);
const hasExtraBets = computed(() => extraBetsStore.activeProfileBets.length > 0);
const visibleWidgets = computed(() =>
  widgetOrder.value.filter((id) => {
    if (id === 'live-matches') return liveMatches.value.length > 0;
    if (id === 'welcome') return !hasExtraBets.value;
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
    padding: var(--s-spacing) var(--s-spacing) var(--s-spacing);
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
