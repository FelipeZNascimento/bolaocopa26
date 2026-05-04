import { createRouter, createWebHistory } from 'vue-router';

import { useMatchesStore } from '@/stores/matches';
import MatchesView from '@/views/MatchesView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomeView,
    //   alias: '/home',
    // },
    {
      alias: '/jogos',
      component: MatchesView,
      name: 'jogos',
      path: '/',
    },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ExtrasView.vue'),
      name: 'extras',
      path: '/extras',
    },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RulesView.vue'),
      name: 'regras',
      path: '/regras',
    },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/RankingView.vue'),
      name: 'ranking',
      path: '/ranking',
    },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TeamsView.vue'),
      name: 'equipes',
      path: '/equipes',
    },
    {
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ResetPassword.vue'),
      name: 'reset-password',
      path: '/reset-password',
    },
  ],
});

// Navigation guard to warn about unsaved changes
router.beforeEach((to, from, next) => {
  const matchesStore = useMatchesStore();

  // Check if there are unsaved changes
  if (matchesStore.hasAnyChanges()) {
    const answer = window.confirm(
      'Você tem alterações não salvas nas apostas. Tem certeza que deseja sair sem salvar?',
    );

    if (answer) {
      // User confirmed, allow navigation
      next();
    } else {
      // User cancelled, stay on the current page
      next(false);
    }
  } else {
    // No unsaved changes, allow navigation
    next();
  }
});

export default router;
