<template>
  <aside class="default-layout-sidebar">
    <router-link
      class="default-layout-sidebar__logotype"
      :to="{ name: 'recommendations' }"
    >
      <app-logotype />
    </router-link>
    <gc-list
      class="default-layout-sidebar__list"
      :items="sidebarItems"
    />
    <div class="default-layout-sidebar__footer">
      GIPHY & bq-t.
    </div>
  </aside>
</template>

<script lang="ts">
import type { RouteLocationRaw } from 'vue-router'

interface SidebarItem {
  title: string,
  icon: string,
  to: RouteLocationRaw,
}
</script>

<script lang="ts" setup>
import AppLogotype from '@/components/AppLogotype.vue'

const sidebarItems = <SidebarItem[]>[
  {
    title: 'Recommendations',
    icon: 'local-fire-department-outline',
    to: { name: 'recommendations' },
  },
]
</script>

<style lang="scss" src="./DefaultLayoutSidebar.scss">
</style>