<template>
  <aside class="default-layout-sidebar">
    <router-link
      class="default-layout-sidebar__logotype"
      :to="{ name: 'index' }"
    >
      <app-logotype :collapsed="isTablet" />
    </router-link>
    <default-layout-navbar />
    <div class="default-layout-sidebar__footer">
      GIPHY & bq&ndash;t.
    </div>
  </aside>
</template>

<script lang="ts" setup>
import DefaultLayoutNavbar from '@/layouts/DefaultLayout/DefaultLayoutNavbar/DefaultLayoutNavbar.vue'
import AppLogotype from '@/components/AppLogotype.vue'
import { useDevice } from '@/composables'

const { isTablet } = useDevice()
</script>

<style lang="scss" src="./DefaultLayoutSidebar.scss">
</style>