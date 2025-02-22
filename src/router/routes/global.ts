export default [
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
    ],
  },
]