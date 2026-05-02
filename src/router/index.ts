import { createRouter, createWebHistory } from 'vue-router';

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

export default router;
