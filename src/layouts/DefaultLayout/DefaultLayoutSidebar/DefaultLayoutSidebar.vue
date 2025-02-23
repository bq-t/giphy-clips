<template>
  <aside class="default-layout-sidebar">
    <router-link
      class="default-layout-sidebar__logotype"
      :to="{ name: 'index' }"
    >
      <app-logotype :collapsed="isTablet" />
    </router-link>
    <gc-list
      class="default-layout-sidebar__list"
      :items="sidebarItems"
    />
    <div class="default-layout-sidebar__footer">
      GIPHY & bq&ndash;t.
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
import { useDevice } from '@/composables'
import AppLogotype from '@/components/AppLogotype.vue'

const { isTablet } = useDevice()

const sidebarItems = <SidebarItem[]>[
  {
    title: 'Recommendations',
    icon: 'local-fire-department-outline',
    to: { name: 'index' },
  },
  {
    title: 'Browser',
    icon: 'explore-outline',
    to: { name: 'browser' },
  }
]
</script>

<style lang="scss" src="./DefaultLayoutSidebar.scss">
</style>