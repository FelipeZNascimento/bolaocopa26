import { createRouter, createWebHistory } from 'vue-router';

// import HomeView from '../views/HomeView.vue';
import GamesView from '@/views/GamesView.vue';

import BetsView from '../views/BetsView.vue';

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
      component: GamesView,
      name: 'jogos',
      path: '/',
    },
    {
      component: BetsView,
      name: 'apostar',
      path: '/apostar',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/BetsView.vue'),
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
      component: () => import('../views/ResetPassword.vue'),
      name: 'reset-password',
      path: '/reset-password',
    },
  ],
});

export default router;
