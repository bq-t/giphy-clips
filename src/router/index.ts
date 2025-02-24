import {createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

type RouteGroup = {
  default: RouteRecordRaw[],
}

const availableRoutes: RouteRecordRaw[] = []
const routeGroups: Record<string, RouteGroup> = import.meta.glob('./routes/*.ts', {
  eager: true,
})

for (const path in routeGroups) {
  const routes = routeGroups[path]?.default || []
  availableRoutes.push(...routes)
}

const router = createRouter({
  history: createWebHistory(),
  routes: availableRoutes,
})

export default router
