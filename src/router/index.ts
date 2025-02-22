import { createRouter, createWebHistory } from 'vue-router'

const routeGroups = import.meta.glob('./routes/*.ts', { eager: true })
const availableRoutes = []
for (const path in routeGroups) {
  availableRoutes.push(...routeGroups[path]?.default || {})
}

const router = createRouter({
  history: createWebHistory(),
  routes: availableRoutes,
})

export default router
