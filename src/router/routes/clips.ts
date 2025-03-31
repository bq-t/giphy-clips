import type { RouteRecordRaw } from 'vue-router'

export default <RouteRecordRaw[]>[
  {
    path: '/clips',
    children: [
      {
        path: '',
        name: 'clips',
        redirect: {
          name: 'browser',
        },
      },
      {
        path: ':clipSlug',
        name: 'clips-clipSlug',
        component: () => import('@/pages/clips/[clipSlug].vue'),
      },
    ],
  },
]