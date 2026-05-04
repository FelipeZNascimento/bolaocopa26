<template>
  <header class="navbar">
    <nav class="nav-container">
      <div class="wave-background">
        <svg
          class="wave-svg"
          viewBox="0 0 1400 100"
          preserveAspectRatio="none"
        >
          <path
            :d="wavePath"
            fill="var(--bolao-c-green-t3)"
          />
        </svg>
      </div>

      <!-- All Navigation Items -->
      <div
        ref="navWrapper"
        class="nav-links-wrapper"
      >
        <!-- Soccer ball that moves between items -->
        <RouterLink
          v-for="(routeItem, index) in allRoutes"
          :key="routeItem.id"
          v-slot="{ navigate }"
          :to="routeItem.url || ''"
          :class="{
            'nav-link': true,
            disabled: routeItem.needCredentials && !activeProfile,
            active: routeItem.id === activeRoute,
          }"
          :style="{ '--item-index': index }"
          custom
        >
          <a
            :autohide="false"
            @click="
              routeItem.id === ROUTE_ID.PROFILE || routeItem.id === ROUTE_ID.LOGIN
                ? handleNavigate($event, index, navigate, routeItem)
                : handleRouteClick(routeItem, index, navigate)
            "
          >
            <span
              class="nav-label"
              :class="{ 'active-label': routeItem.id === activeRoute }"
            >
              {{ routeItem.label }}
            </span>
          </a>
        </RouterLink>
        <div
          v-if="isDesktop"
          class="telstar-ball"
          :style="{
            left: ballPosition,
            transform: `translate(0, -20px) rotate(${ballRotation}deg)`,
          }"
        />
      </div>
    </nav>

    <!-- Profile Popover -->
    <PrimePopover
      ref="profilePopover"
      @hide="syncActiveRouteWithPath"
    >
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
        <PrimeButton
          variant="text"
          severity="secondary"
          size="small"
          label="Favoritos"
          @click="
            isFavoritesModalOpen = true;
            profilePopover.toggle();
          "
        />
        <PrimeButton
          severity="secondary"
          variant="link"
          size="small"
          @click="handleThemeConfig(theme === 'dark' ? 'light' : 'dark')"
        >
          <i
            :class="theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
            :style="{ color: theme === 'dark' ? 'var(--bolao-c-gold)' : 'var(--bolao-c-grey2)' }"
            style="font-size: var(--l-font-size)"
          />
        </PrimeButton>
        <PrimeDivider />

        <PrimeButton
          severity="secondary"
          size="small"
          label="Sair"
          @click="handleLogout"
        />
      </div>
    </PrimePopover>
  </header>

  <!-- Modals -->
  <LoginModal
    :is-open="isLoginModalOpen"
    :handle-close-modal="handleCloseLoginModal"
  />
  <ProfileModal
    :is-open="isProfileModalOpen"
    :handle-close-modal="handleCloseProfileModal"
  />
  <PasswordModal
    :is-open="isPasswordModalOpen"
    :handle-close-modal="handleClosePasswordModal"
  />
  <RankingModal
    :is-open="isRankingModalOpen"
    :handle-close-modal="handleCloseRankingModal"
  />
  <ManageFavoritesModal
    :is-open="isFavoritesModalOpen"
    :handle-close-modal="handleCloseFavoritesModal"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import type { TThemeValue } from '@/stores/configuration.types';

import LoginModal from '@/components/NavbarTop/LoginModal.vue';
import ManageFavoritesModal from '@/components/Ranking/ManageFavoritesModal.vue';
import UserService from '@/services/user';
import { useViewport } from '@/services/viewport';
import { useActiveProfileStore } from '@/stores/activeProfile';
import { useConfigurationStore } from '@/stores/configuration';

import RankingModal from '../Ranking/RankingModal.vue';
import PasswordModal from './ChangePasswordModal.vue';
import ProfileModal from './ProfileModal.vue';
import { ROUTE_ID, ROUTES, type TROUTE } from './routes';

type ExtendedRoute = TROUTE | { id: number; label: string; needCredentials: boolean; url: string };

// ------ Refs ------
const isLoginModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const isRankingModalOpen = ref(false);
const profilePopover = ref();
const activeRoute = ref<number>(ROUTES[0].id);
const activeItemIndex = ref(0);
const animatedItemIndex = ref(0);
const ballRotation = ref(0);
const ballPositionPx = ref(0);
const navWrapper = ref<HTMLElement | null>(null);
const isFavoritesModalOpen = ref(false);

let animationFrame: null | number = null;

const profileRoute = computed(() => ({
  id: ROUTE_ID.PROFILE,
  label: activeProfile.value ? activeProfile.value.nickname : 'Perfil',
  needCredentials: true,
  url: '',
}));

const loginRoute: ExtendedRoute = {
  id: ROUTE_ID.LOGIN,
  label: 'Login',
  needCredentials: false,
  url: '',
};

// ------ Initializations ------
const activeProfileStore = useActiveProfileStore();
const configurationStore = useConfigurationStore();
const userService = new UserService();
const route = useRoute();
const { isDesktop } = useViewport();

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
const theme = computed(() => configurationStore.theme);

const allRoutes = computed(() => {
  const routes: ExtendedRoute[] = [...ROUTES];

  if (activeProfile.value) {
    routes.push(profileRoute.value);
  } else {
    routes.push(loginRoute);
  }

  // routes.push(configRoute);

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

// Watch for actual route path changes (from RouterLink navigation)
watch(
  () => route.path,
  (newPath) => {
    const matchingRoute = ROUTES.find((r) => r.url === newPath);
    if (matchingRoute) {
      const index = allRoutes.value.findIndex((r) => r.id === matchingRoute.id);
      if (index >= 0 && activeRoute.value !== matchingRoute.id) {
        activeRoute.value = matchingRoute.id;
        activeItemIndex.value = index;
        setTimeout(() => animateWave(index), 50);
      }
    }
  },
);

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

function handleCloseFavoritesModal() {
  isFavoritesModalOpen.value = false;
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
  if (route.needCredentials && !activeProfile.value) {
    return;
  }

  // Update state before animating
  activeRoute.value = route.id;
  activeItemIndex.value = index;
  animateWave(index);

  if (route.id === ROUTE_ID.PROFILE) {
    togglePopover(event);
    return;
  } else if (route.id === ROUTE_ID.LOGIN) {
    isLoginModalOpen.value = true;
    return;
  }

  if (route.url) {
    navigate();
  }
}

function handleRouteClick(route: ExtendedRoute, index: number, navigate: () => void) {
  if (route.id === ROUTE_ID.PROFILE) {
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

function handleThemeConfig(newOption: TThemeValue) {
  configurationStore.setTheme(newOption);
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
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: var(--navbar-height);
  background-color: var(--bolao-c-navbar);
}

.nav-container {
  position: relative;
  height: 100%;
  margin: 0 auto;
}

.wave-background {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  z-index: 10;
  display: flex;
  gap: var(--l-spacing);
  align-items: flex-end;
  justify-content: space-around;
  height: 100%;
  padding: 0 var(--l-spacing) var(--xs-spacing) var(--l-spacing);
}

.nav-link {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  align-items: center;
  justify-content: center;
  padding: var(--xs-spacing);
  color: var(--bolao-c-white);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &.disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.4;
  }
}

.telstar-ball {
  position: absolute;
  bottom: 10px;
  z-index: 3;
  width: 25px;
  height: 25px;
  pointer-events: none;
  background: url('/soccer_ball.svg') center center / cover no-repeat;
  border-radius: 50%;
  box-shadow:
    0 8px 16px rgb(0 0 0 / 30%),
    0 4px 8px rgb(0 0 0 / 15%);
}

.nav-label {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: var(--m-font-size);
  text-align: center;
  white-space: nowrap;
  opacity: 0.9;
  transition: all 0.3s ease;

  &.active-label {
    font-weight: bold;
    color: var(--bolao-c-white);
    opacity: 1;
    transform: scale(1.15);
  }

  &:hover {
    transform: scale(1.1);
  }
}

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }

  50% {
    transform: scale(1.15) rotate(-90deg);
  }

  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.outer-profile-popover {
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  padding: var(--s-spacing);
}

/* Responsive */
@media (width <= 1280px) {
  .navbar {
    height: var(--navbar-height-mobile);
  }

  .nav-links-wrapper {
    padding: 0 var(--s-spacing);
  }

  .telstar-ball {
    width: 55px;
    height: 55px;
  }

  .nav-label {
    &.active-label {
      transform: scale(1.25);
    }
  }
}

@media (width <= 480px) {
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
