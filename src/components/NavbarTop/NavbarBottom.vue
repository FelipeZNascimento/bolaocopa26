<template>
  <header class="navbar">
    <nav class="nav-container">
      <div class="wave-background">
        <svg class="wave-svg" viewBox="0 0 1400 100" preserveAspectRatio="none">
          <path :d="wavePath" fill="var(--bolao-c-green-t3)" />
        </svg>
      </div>

      <!-- All Navigation Items -->
      <div class="nav-links-wrapper" ref="navWrapper">
        <!-- Soccer ball that moves between items -->
        <div
          class="telstar-ball"
          :style="{
            left: ballPosition,
            transform: `translate(-50%, -20px) rotate(${ballRotation}deg)`,
          }"
        ></div>

        <RouterLink
          v-for="(route, index) in allRoutes"
          :key="route.id"
          :to="route.url || ''"
          :class="{
            'nav-link': true,
            disabled: route.needCredentials && !activeProfile,
            active: route.id === activeRoute,
          }"
          :style="{ '--item-index': index }"
          custom
          v-slot="{ navigate }"
        >
          <a
            @click="
              route.id === 999 || route.id === 998
                ? handleNavigate($event, index, navigate, route)
                : handleRouteClick(route, index, navigate)
            "
          >
            <div class="icon-wrapper" :class="{ elevated: route.id === activeRoute }">
              <i :class="getIconClass(route.id)" class="nav-icon"></i>
            </div>
            <span class="nav-label" :class="{ 'active-label': route.id === activeRoute }">{{ route.label }}</span>
          </a>
        </RouterLink>
      </div>
    </nav>

    <!-- Profile Popover -->
    <PrimePopover ref="profilePopover" @hide="syncActiveRouteWithPath">
      <div class="outer-profile-popover">
        <PrimeButton
          variant="text"
          severity="secondary"
          size="small"
          label="Perfil"
          @click="
            isProfileModalOpen = true;
            profilePopover.toggle();
          "
        />
        <PrimeButton
          variant="text"
          severity="secondary"
          size="small"
          label="Senha"
          @click="
            isPasswordModalOpen = true;
            profilePopover.toggle();
          "
        />
        <PrimeDivider />
        <!-- style="color: black" -->
        <PrimeButton severity="contrast" size="small" label="Sair" @click="handleLogout" rounded />
      </div>
    </PrimePopover>
  </header>

  <!-- Modals -->
  <LoginModal :isOpen="isLoginModalOpen" :handleCloseModal="handleCloseLoginModal" />
  <ProfileModal :isOpen="isProfileModalOpen" :handleCloseModal="handleCloseProfileModal" />
  <PasswordModal :isOpen="isPasswordModalOpen" :handleCloseModal="handleClosePasswordModal" />
  <ConfigModal :activeProfile="activeProfile" :isOpen="isConfigModalOpen" :handleCloseModal="handleCloseConfigModal" />
  <RankingModal :isOpen="isRankingModalOpen" :handleCloseModal="handleCloseRankingModal" />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import ConfigModal from '@/components/NavbarTop/ConfigModal.vue';
import LoginModal from '@/components/NavbarTop/LoginModal.vue';
import UserService from '@/services/user';
import { useActiveProfileStore } from '@/stores/activeProfile';

import RankingModal from '../Ranking/RankingModal.vue';
import PasswordModal from './PasswordModal.vue';
import ProfileModal from './ProfileModal.vue';
import { ROUTE_ID, ROUTES, type TROUTE } from './routes';

type ExtendedRoute = TROUTE | { id: number; label: string; needCredentials: boolean; url: string };

// ------ Refs ------
const isLoginModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const isRankingModalOpen = ref(false);
const profilePopover = ref();
const isConfigModalOpen = ref(false);
const activeRoute = ref<number>(ROUTES[0].id);
const activeItemIndex = ref(0);
const animatedItemIndex = ref(0);
const ballRotation = ref(0);
const ballPositionPx = ref(0);
const navWrapper = ref<HTMLElement | null>(null);
let animationFrame: null | number = null;

// const rankingRoute: ExtendedRoute = {
//   id: ROUTE_ID.RANKING,
//   label: 'Ranking',
//   needCredentials: true,
//   url: '/ranking',
// };

const profileRoute: ExtendedRoute = {
  id: 999,
  label: 'Perfil',
  needCredentials: true,
  url: '',
};

const configRoute: ExtendedRoute = {
  id: 998,
  label: 'Config',
  needCredentials: false,
  url: '',
};

// ------ Initializations ------
const activeProfileStore = useActiveProfileStore();
const userService = new UserService();

onMounted(() => {
  const currentPath = window.location.pathname;
  const matchingRoute = ROUTES.find((route) => route.url === currentPath);
  if (matchingRoute) {
    const index = allRoutes.value.findIndex((r) => r.id === matchingRoute.id);
    activeRoute.value = matchingRoute.id;
    activeItemIndex.value = index >= 0 ? index : 0;
    animatedItemIndex.value = index >= 0 ? index : 0;
  }

  // Initial ball position after DOM is ready
  setTimeout(() => updateBallPosition(), 0);
});

onUnmounted(() => {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
  }
});

// ------ Computed Properties ------
const activeProfile = computed(() => activeProfileStore.activeProfile);

const allRoutes = computed(() => {
  const routes: ExtendedRoute[] = [...ROUTES];

  if (activeProfile.value) {
    // routes.push(rankingRoute);
    routes.push(profileRoute);
  }

  routes.push(configRoute);

  return routes;
});

const ballPosition = computed(() => {
  return `${ballPositionPx.value}px`;
});

const wavePath = computed(() => {
  const width = 1400;
  const height = 100;
  const items = allRoutes.value.length;
  const activeIndex = animatedItemIndex.value; // Use animated index instead of actual

  // Calculate position for dip
  const itemWidth = width / items;
  const centerX = (activeIndex + 0.5) * itemWidth;
  const dipDepth = 60;
  const dipWidth = itemWidth * 1.5;

  let path = `M 0,${height * 0.3}`;

  const points = 50;
  for (let i = 0; i <= points; i++) {
    const x = (width / points) * i;
    let y = height * 0.3;

    const distanceFromCenter = Math.abs(x - centerX);
    if (distanceFromCenter < dipWidth) {
      const dipFactor = Math.cos((distanceFromCenter / dipWidth) * Math.PI) * 0.5 + 0.5;
      y = height * 0.3 + dipDepth * dipFactor;
    }

    y += Math.sin((x / width) * Math.PI * 3) * 5;

    path += ` L ${x},${y}`;
  }

  path += ` L ${width},${height} L 0,${height} Z`;

  return path;
});

// Watch for route changes (e.g., when user logs in and new routes are added)
watch(allRoutes, () => {
  // Recalculate active item index in case route positions changed
  const index = allRoutes.value.findIndex((r) => r.id === activeRoute.value);
  if (index >= 0) {
    activeItemIndex.value = index;
    animatedItemIndex.value = index;
  }

  // Update ball position after DOM has updated with new routes
  setTimeout(() => updateBallPosition(), 0);
});

// ------ Functions ------
function animateWave(targetIndex: number) {
  const startIndex = animatedItemIndex.value;
  const distance = targetIndex - startIndex;
  const duration = 600; // ms
  const startTime = performance.now();
  const startRotation = ballRotation.value;

  // Calculate rotation based on distance (simulate rolling)
  // Each index = ~360 degrees of rotation
  const rotationDistance = distance * 360;

  // Get start and end positions from DOM
  if (!navWrapper.value) return;
  const navItems = navWrapper.value.querySelectorAll('.nav-link');
  if (navItems.length === 0) return;

  const startItem = navItems[Math.round(startIndex)] as HTMLElement;
  const endItem = navItems[targetIndex] as HTMLElement;

  if (!startItem || !endItem) return;

  const navRect = navWrapper.value.getBoundingClientRect();
  const startRect = startItem.getBoundingClientRect();
  const endRect = endItem.getBoundingClientRect();

  const startPos = startRect.left + startRect.width / 2 - navRect.left;
  const endPos = endRect.left + endRect.width / 2 - navRect.left;

  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-in-ease-out function
    const easeProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    animatedItemIndex.value = startIndex + distance * easeProgress;
    ballRotation.value = startRotation + rotationDistance * easeProgress;

    // Interpolate ball position smoothly
    ballPositionPx.value = startPos + (endPos - startPos) * easeProgress;
    ballPositionPx.value = ballPositionPx.value - 15;

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      animatedItemIndex.value = targetIndex;
      ballRotation.value = startRotation + rotationDistance;
      ballPositionPx.value = endPos - 15;
      animationFrame = null;
    }
  };

  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
  }

  animationFrame = requestAnimationFrame(animate);
}

function getIconClass(routeId: number): string {
  const iconMap: Record<number, string> = {
    998: 'pi pi-cog',
    999: 'pi pi-user',
    [ROUTE_ID.BET]: 'pi pi-money-bill',
    [ROUTE_ID.EXTRAS]: 'pi pi-star',
    [ROUTE_ID.GAMES]: 'pi pi-list',
    [ROUTE_ID.HOME]: 'pi pi-home',
    [ROUTE_ID.RANKING]: 'pi pi-trophy',
    [ROUTE_ID.RECORDS]: 'pi pi-chart-bar',
    [ROUTE_ID.RULES]: 'pi pi-book',
  };
  return iconMap[routeId] || 'pi pi-circle';
}

function handleCloseConfigModal() {
  isConfigModalOpen.value = false;
  syncActiveRouteWithPath();
}

function handleCloseLoginModal() {
  isLoginModalOpen.value = false;
  syncActiveRouteWithPath();
}

function handleClosePasswordModal() {
  isPasswordModalOpen.value = false;
  syncActiveRouteWithPath();
}

function handleCloseProfileModal() {
  isProfileModalOpen.value = false;
  syncActiveRouteWithPath();
}

function handleCloseRankingModal() {
  isRankingModalOpen.value = false;
  syncActiveRouteWithPath();
}

function handleLogout() {
  userService.logout();
  profilePopover.value.toggle();
}

function handleNavigate(event: Event, index: number, navigate: () => void, route: ExtendedRoute) {
  console.log('Route clicked in handleNavigate:', route);
  if (route.needCredentials && !activeProfile.value) {
    return;
  }

  // Update state before animating
  activeRoute.value = route.id;
  activeItemIndex.value = index;
  animateWave(index);

  if (route.id === ROUTE_ID.RANKING) {
    isRankingModalOpen.value = true;
    return;
  }
  if (route.id === 999) {
    togglePopover(event);
    return;
  }
  if (route.id === 998) {
    isConfigModalOpen.value = true;
    return;
  }
  if (route.url) {
    navigate();
  }
}

function handleRouteClick(route: ExtendedRoute, index: number, navigate: () => void) {
  console.log('Route clicked in handleRouteClick:', route);
  if (route.id === 999) {
    activeRoute.value = route.id;
    activeItemIndex.value = index;
    animateWave(index);
    return;
  }
  activeRoute.value = route.id;
  activeItemIndex.value = index;
  animateWave(index);
  if (route.url) {
    navigate();
  }
}

function syncActiveRouteWithPath() {
  const currentPath = window.location.pathname;
  const matchingRoute = ROUTES.find((route) => route.url === currentPath);
  if (matchingRoute) {
    const index = allRoutes.value.findIndex((r) => r.id === matchingRoute.id);
    if (index >= 0 && activeRoute.value !== matchingRoute.id) {
      activeRoute.value = matchingRoute.id;
      activeItemIndex.value = index;
      // Add a small delay to ensure DOM is updated after popover closes
      setTimeout(() => animateWave(index), 50);
    }
  }
}

function togglePopover(event: Event) {
  profilePopover.value.toggle(event);
}

function updateBallPosition() {
  if (!navWrapper.value) return;

  const navItems = navWrapper.value.querySelectorAll('.nav-link');
  if (navItems.length === 0) return;

  const targetIndex = Math.round(animatedItemIndex.value);
  const targetItem = navItems[targetIndex] as HTMLElement;

  if (targetItem) {
    const navRect = navWrapper.value.getBoundingClientRect();
    const itemRect = targetItem.getBoundingClientRect();

    // Calculate the center of the item relative to the nav wrapper
    const itemCenter = itemRect.left + itemRect.width / 2 - navRect.left;
    ballPositionPx.value = itemCenter - 15;
  }
}
</script>

<style scoped lang="scss">
.navbar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
  width: 100%;
  background-color: var(--bolao-c-navbar);
}

.nav-container {
  position: relative;
  // max-width: 1400px;
  margin: 0 auto;
  height: 100%;
}

.wave-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  overflow: visible;
}

.wave-svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 80px;
  // filter: drop-shadow(0/ -2px 10px rgba(0, 0, 0, 0.9));
}

.nav-links-wrapper {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 100%;
  padding: 0 var(--l-spacing);
  z-index: 10;
  gap: var(--l-spacing);
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--xs-spacing);
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.3s ease;
  position: relative;
  padding: var(--xs-spacing);
  // flex: 1;
  justify-content: center;
  cursor: pointer;

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.icon-wrapper {
  position: relative;
  width: 10px;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 2;

  &.elevated {
    transform: translateX(15px);
  }
}

.telstar-ball {
  position: absolute;
  bottom: 10px;
  width: 25px;
  height: 25px;
  background: url('/soccer_ball.svg') center center / cover no-repeat;
  border-radius: 50%;
  z-index: 3;
  box-shadow:
    0 8px 16px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
}

.nav-icon {
  font-size: var(--l-font-size);
  color: var(--bolao-c-white);
  transition: all 0.3s ease;
  z-index: 1;

  .elevated & {
    color: white;
    font-size: 24px;
  }
}

.nav-label {
  font-size: var(--s-font-size);
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--bolao-c-white);
  transition: all 0.3s ease;
  opacity: 0.7;

  &.active-label {
    color: var(--bolao-c-white);
    font-weight: 700;
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes popIn {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.15) rotate(-90deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.outer-profile-popover {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  padding: var(--s-spacing);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    height: 70px;
  }

  .nav-links-wrapper {
    padding: 0 var(--s-spacing);
  }

  .icon-wrapper {
    width: 30px;
    height: 30px;

    &.elevated {
      transform: translateX(-15px);
    }
  }

  .telstar-ball {
    width: 55px;
    height: 55px;
  }

  .nav-icon {
    font-size: var(--l-font-size);

    .elevated & {
      font-size: 20px;
    }
  }

  .nav-label {
    font-size: 10px;
    max-width: 60px;
  }
}

@media (max-width: 480px) {
  .nav-links-wrapper {
    padding: 0 var(--xs-spacing);
  }

  .nav-label {
    display: none;
  }

  .nav-link.active .nav-label.active-label {
    display: block;
  }
}
</style>
