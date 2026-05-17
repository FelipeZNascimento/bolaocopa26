import { useConfirm } from 'primevue';
import { createRouter, createWebHistory } from 'vue-router';

import { ROUTE_ID, ROUTES } from '@/components/NavbarTop/routes';
import { useMatchesStore } from '@/stores/matches';
import HomeView from '@/views/HomeView.vue';
import MatchesView from '@/views/MatchesView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      alias: ROUTES.find((r) => r.id === ROUTE_ID.HOME)?.url,
      component: HomeView,
      name: ROUTES.find((r) => r.id === ROUTE_ID.HOME)?.name,
      path: ROUTES.find((r) => r.id === ROUTE_ID.HOME)?.url || '/',
    },
    {
      alias: ROUTES.find((r) => r.id === ROUTE_ID.MATCHES)?.url,
      component: MatchesView,
      name: ROUTES.find((r) => r.id === ROUTE_ID.MATCHES)?.name,
      path: ROUTES.find((r) => r.id === ROUTE_ID.MATCHES)?.url || '/partidas',
    },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ExtrasView.vue'),
      name: ROUTES.find((r) => r.id === ROUTE_ID.EXTRAS)?.name,
      path: ROUTES.find((r) => r.id === ROUTE_ID.EXTRAS)?.url || '/extras',
    },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RulesView.vue'),
      name: ROUTES.find((r) => r.id === ROUTE_ID.RULES)?.name,
      path: ROUTES.find((r) => r.id === ROUTE_ID.RULES)?.url || '/regras',
    },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RankingView.vue'),
      name: ROUTES.find((r) => r.id === ROUTE_ID.RANKING)?.name,
      path: ROUTES.find((r) => r.id === ROUTE_ID.RANKING)?.url || '/ranking',
    },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TeamsView.vue'),
      name: ROUTES.find((r) => r.id === ROUTE_ID.TEAMS)?.name,
      path: ROUTES.find((r) => r.id === ROUTE_ID.TEAMS)?.url || '/equipes',
    },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ResetPassword.vue'),
      name: 'reset-password',
      path: '/reset-password',
    },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AdminView.vue'),
      name: 'admin',
      path: '/admin',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition; // browser back/forward
    return { behavior: 'smooth', top: 0 };
  },
});

// Navigation guard to warn about unsaved changes
router.beforeEach((to, from, next) => {
  const confirm = useConfirm();
  const matchesStore = useMatchesStore();

  // Check if there are unsaved changes
  if (matchesStore.hasAnyChanges()) {
    confirm.require({
      accept: () => {
        matchesStore.resetWorkingBets();
        next();
      },
      acceptProps: { label: 'Sair', severity: 'danger' },
      header: 'Apostas não salvas',
      icon: 'pi pi-exclamation-triangle',
      message: `Tem certeza que deseja sair sem salvar suas apostas?`,
      reject: () => next(false),
      rejectProps: { label: 'Cancelar', severity: 'secondary', variant: 'text' },
    });
  } else {
    // No unsaved changes, allow navigation
    next();
  }
});

export default router;
