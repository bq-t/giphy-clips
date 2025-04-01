import type { RouteRecordRaw } from 'vue-router'

export default <RouteRecordRaw[]>[
  {
    path: '/',
    children: [
      {
        path: '',
        name: 'index',
        alias: 'recommendations',
        component: () => import('@/pages/recommendations.vue'),
      },
      {
        path: 'browser',
        name: 'browser',
        component: () => import('@/pages/browser.vue'),
      },
      {
        path: 'favorites',
        name: 'favorites',
        component: () => import('@/pages/favorites.vue'),
      },
    ],
  },
]