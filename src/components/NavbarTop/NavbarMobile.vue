<template>
  <header class="navbar-mobile">
    <nav class="nav-container">
      <!-- Top bar with logo/title and hamburger -->
      <div class="top-bar">
        <div class="logo-section">
          <div class="telstar-ball" />
          <span class="app-title">Bolão Copa 2026</span>
        </div>
        <div class="right-section">
          <!-- Profile indicator when logged in -->
          <div v-if="activeProfile && !isLoading" class="profile-indicator">
            <div class="profile-avatar">
              {{ getUserInitials(activeProfile.name) }}
            </div>
          </div>
          <div v-else-if="isLoading" class="profile-indicator">
            <i class="pi pi-spin pi-spinner" />
          </div>
          <button
            class="hamburger-btn"
            :class="{ open: isMenuOpen }"
            @click="toggleMenu"
            aria-label="Menu"
          >
            <span class="hamburger-line" />
            <span class="hamburger-line" />
            <span class="hamburger-line" />
          </button>
        </div>
      </div>

      <!-- Wave decoration -->
      <div class="wave-background">
        <svg class="wave-svg" viewBox="0 0 375 40" preserveAspectRatio="none">
          <path :d="wavePath" fill="var(--bolao-c-green-t3)" />
        </svg>
      </div>
    </nav>

    <!-- Overlay -->
    <div v-if="isMenuOpen" class="overlay" @click="closeMenu" />

    <!-- Side drawer -->
    <Transition name="drawer">
      <div v-if="isMenuOpen" class="drawer">
        <div class="drawer-header">
          <h3>Menu</h3>
          <button class="close-btn" @click="closeMenu" aria-label="Fechar">
            <i class="pi pi-times" />
          </button>
        </div>
        <nav class="drawer-nav">
          <RouterLink
            v-for="routeItem in allRoutes"
            :key="routeItem.id"
            v-slot="{ navigate }"
            :to="routeItem.url || ''"
            custom
          >
            <a
              class="drawer-link"
              :class="{
                disabled: routeItem.needCredentials && !activeProfile,
                active: routeItem.id === activeRoute,
              }"
              @click="
                routeItem.id === ROUTE_ID.PROFILE ||
                  routeItem.id === ROUTE_ID.LOGIN
                  ? handleSpecialRoute($event, routeItem, navigate)
                  : handleRouteClick(routeItem, navigate)
              "
            >
              <i :class="getIconClass(routeItem.id)" />
              <span class="link-label">{{ routeItem.label }}</span>
              <div
                v-if="routeItem.id === activeRoute"
                class="active-indicator"
              />
            </a>
          </RouterLink>
          <PrimeDivider />
          <div v-if="isLoading" class="profile-section">
            <i
              class="pi pi-spin pi-spinner"
              style="font-size: var(--xl-font-size)"
            />
          </div>
          <div v-else-if="activeProfile" class="profile-section">
            <div>
              <i :class="getIconClass(profileRoute.id)" />
              <span class="label">{{ profileRoute.label }}</span>
            </div>
            <div class="button-container">
              <PrimeButton
                variant="text"
                severity="secondary"
                size="small"
                label="Perfil"
                @click="
                  isProfileModalOpen = true;
                  closeMenu();
                "
              />
              <PrimeButton
                variant="text"
                severity="secondary"
                size="small"
                label="Senha"
                @click="
                  isPasswordModalOpen = true;
                  closeMenu();
                "
              />
              <PrimeButton
                variant="text"
                severity="secondary"
                size="small"
                label="Configurações"
                @click="
                  isConfigModalOpen = true;
                  closeMenu();
                "
              />
              <PrimeButton
                variant="text"
                severity="secondary"
                size="small"
                label="Favoritos"
                @click="
                  isFavoritesModalOpen = true;
                  closeMenu();
                "
              />
            </div>
            <PrimeButton
              style="margin: var(--s-spacing)"
              severity="danger"
              size="small"
              label="Sair"
              @click="handleLogout"
            />
          </div>
          <div v-else class="profile-section" style="align-items: center">
            <PrimeButton
              style="margin: var(--s-spacing)"
              severity="info"
              label="Fazer login"
              @click="
                closeMenu();
                isLoginModalOpen = true;
              "
            />
          </div>
        </nav>
      </div>
    </Transition>
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
  <ConfigModal
    :active-profile="activeProfile"
    :is-open="isConfigModalOpen"
    :handle-close-modal="handleCloseConfigModal"
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
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import ConfigModal from "@/components/NavbarTop/ConfigModal.vue";
import LoginModal from "@/components/NavbarTop/LoginModal.vue";
import ManageFavoritesModal from "@/components/Ranking/ManageFavoritesModal.vue";
import UserService from "@/services/user";
import { useActiveProfileStore } from "@/stores/activeProfile";

import RankingModal from "../Ranking/RankingModal.vue";
import PasswordModal from "./ChangePasswordModal.vue";
import ProfileModal from "./ProfileModal.vue";
import { ROUTE_ID, ROUTES, type TROUTE } from "./routes";

type ExtendedRoute =
  | TROUTE
  | { id: number; label: string; needCredentials: boolean; url: string };

// ------ Refs ------
const isMenuOpen = ref(false);
const isLoginModalOpen = ref(false);
const isProfileModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const isRankingModalOpen = ref(false);
const isConfigModalOpen = ref(false);
const isFavoritesModalOpen = ref(false);
const activeRoute = ref<number>(ROUTES[0].id);

const profileRoute = computed(() => ({
  id: ROUTE_ID.PROFILE,
  label: activeProfile.value ? activeProfile.value.name : "Perfil",
  needCredentials: true,
  url: "",
}));

// ------ Initializations ------
const activeProfileStore = useActiveProfileStore();
const userService = new UserService();
const route = useRoute();

// Set initial active route
const currentPath = window.location.pathname;
const matchingRoute = ROUTES.find((r) => r.url === currentPath);
if (matchingRoute) {
  activeRoute.value = matchingRoute.id;
}

// ------ Computed Properties ------
const activeProfile = computed(() => activeProfileStore.activeProfile);
const isLoading = computed(() => activeProfileStore.isLoading);

const allRoutes = computed(() => {
  const routes: ExtendedRoute[] = [...ROUTES];

  return routes;
});

const wavePath = computed(() => {
  // Simplified wave for mobile
  const width = 375;
  const height = 40;

  let path = `M 0,${height * 0.5}`;

  const points = 30;
  for (let i = 0; i <= points; i++) {
    const x = (width / points) * i;
    let y = height * 0.5;

    // Simple sine wave
    y += Math.sin((x / width) * Math.PI * 3) * 3;

    path += ` L ${x},${y}`;
  }

  path += ` L ${width},${height} L 0,${height} Z`;

  return path;
});

// ------ Watches ------
watch(
  () => route.path,
  (newPath) => {
    const matchingRoute = ROUTES.find((r) => r.url === newPath);
    if (matchingRoute) {
      activeRoute.value = matchingRoute.id;
    }
  },
);

// Close menu when route changes
watch(
  () => route.path,
  () => {
    closeMenu();
  },
);

// ------ Functions ------
function closeMenu() {
  isMenuOpen.value = false;
  document.body.style.overflow = "";
}

function getIconClass(routeId: number): string {
  const iconMap: Record<number, string> = {
    [ROUTE_ID.BET]: "pi pi-money-bill",
    [ROUTE_ID.EXTRAS]: "pi pi-star",
    [ROUTE_ID.HOME]: "pi pi-home",
    [ROUTE_ID.LOGIN]: "pi pi-user",
    [ROUTE_ID.MATCHES]: "pi pi-list",
    [ROUTE_ID.PROFILE]: "pi pi-user",
    [ROUTE_ID.RANKING]: "pi pi-trophy",
    [ROUTE_ID.RECORDS]: "pi pi-chart-bar",
    [ROUTE_ID.RULES]: "pi pi-book",
    [ROUTE_ID.TEAMS]: "pi pi-globe",
  };
  return iconMap[routeId] || "pi pi-circle";
}

function getUserInitials(name: string): string {
  if (!name) return "?";

  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function handleCloseConfigModal() {
  isConfigModalOpen.value = false;
  syncActiveRouteWithPath();
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
}

function handleRouteClick(route: ExtendedRoute, navigate: () => void) {
  if (route.needCredentials && !activeProfile.value) {
    closeMenu();
    return;
  }

  activeRoute.value = route.id;

  if (route.url) {
    navigate();
  }

  closeMenu();
}

function handleSpecialRoute(
  event: Event,
  route: ExtendedRoute,
  navigate: () => void,
) {
  if (route.needCredentials && !activeProfile.value) {
    closeMenu();
    return;
  }

  activeRoute.value = route.id;

  if (route.id === ROUTE_ID.LOGIN) {
    closeMenu();
    isLoginModalOpen.value = true;
    return;
  }

  if (route.url) {
    navigate();
  }
}

function syncActiveRouteWithPath() {
  const currentPath = window.location.pathname;
  const matchingRoute = ROUTES.find((route) => route.url === currentPath);
  if (matchingRoute) {
    activeRoute.value = matchingRoute.id;
  }
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
  // Prevent body scroll when menu is open
  if (isMenuOpen.value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}
</script>

<style scoped lang="scss">
.navbar-mobile {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: var(--navbar-height-mobile);
  background-color: var(--bolao-c-navbar);
}

.nav-container {
  position: relative;
  height: 100%;
}

.top-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 var(--m-spacing);
}

.logo-section {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
}

.right-section {
  display: flex;
  gap: var(--s-spacing);
  align-items: center;
}

.profile-indicator {
  display: flex;
  gap: var(--xs-spacing);
  align-items: center;

  i {
    font-size: var(--m-font-size);
    color: var(--bolao-c-white);
  }
}

.profile-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: var(--s-font-size);
  font-weight: bold;
  color: var(--bolao-c-navbar);
  background: linear-gradient(135deg, #4ade80, #fbbf24);
  border-radius: 50%;
  box-shadow:
    0 0 0 3px var(--bolao-c-white),
    0 4px 12px rgb(0 0 0 / 30%);
}

.telstar-ball {
  width: 32px;
  height: 32px;
  background: url("/soccer_ball.svg") center center / cover no-repeat;
  border-radius: 50%;
  box-shadow:
    0 4px 8px rgb(0 0 0 / 20%),
    0 2px 4px rgb(0 0 0 / 10%);
}

.app-title {
  font-size: var(--m-font-size);
  font-weight: bold;
  color: var(--bolao-c-white);
}

.wave-background {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  overflow: hidden;
  pointer-events: none;
}

.wave-svg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Hamburger Button */
.hamburger-btn {
  position: relative;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: transform 0.3s ease;

  &:active {
    transform: scale(0.95);
  }
}

.hamburger-line {
  width: 24px;
  height: 3px;
  background-color: var(--bolao-c-white);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger-btn.open {
  .hamburger-line:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburger-line:nth-child(2) {
    opacity: 0;
  }

  .hamburger-line:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
}

/* Overlay */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background-color: rgb(0 0 0 / 50%);
  backdrop-filter: blur(2px);
}

/* Drawer */
.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  width: 280px;
  max-width: 85vw;
  overflow-y: auto;
  background-color: var(--bolao-c-navbar);
  box-shadow: -4px 0 16px rgb(0 0 0 / 30%);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--m-spacing);
  border-bottom: 1px solid rgb(255 255 255 / 10%);

  h3 {
    margin: 0;
    font-size: var(--l-font-size);
    color: var(--bolao-c-white);
  }
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  font-size: var(--l-font-size);
  color: var(--bolao-c-white);
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgb(255 255 255 / 10%);
  }

  &:active {
    transform: scale(0.95);
  }
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  padding: var(--s-spacing) 0;
}

.profile-section {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--m-spacing);
  align-items: flex-start;
  padding: var(--m-spacing) var(--m-spacing);
  color: var(--bolao-c-white);
  text-decoration: none;
  transition: all 0.2s ease;

  i {
    min-width: 24px;
    font-size: var(--l-font-size);
  }

  .label {
    flex: 1;
    padding-left: var(--m-spacing);
    font-size: var(--m-font-size);
  }

  .button-container {
    display: flex;
    flex-direction: column;
    gap: var(--xs-spacing);
    align-items: flex-start;
  }
}

.drawer-link {
  position: relative;
  display: flex;
  gap: var(--m-spacing);
  align-items: center;
  padding: var(--m-spacing) var(--m-spacing);
  color: var(--bolao-c-white);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;

  i {
    min-width: 24px;
    font-size: var(--l-font-size);
  }

  .link-label {
    flex: 1;
    font-size: var(--m-font-size);
  }

  &:hover {
    background-color: rgb(255 255 255 / 5%);
  }

  &:active {
    background-color: rgb(255 255 255 / 10%);
  }

  &.active {
    font-weight: bold;
    background-color: rgb(255 255 255 / 10%);

    .link-label {
      color: var(--bolao-c-gold-t3);
    }
  }

  &.disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.4;
  }
}

.active-indicator {
  width: 8px;
  height: 8px;
  background-color: var(--bolao-c-gold-t3);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--bolao-c-gold-t3);
}

/* Drawer Transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
</style>
