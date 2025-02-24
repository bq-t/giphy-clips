<template>
  <main class="default-layout">
    <default-layout-sidebar v-if="!isMobile" />
    <router-view />
  </main>
  <default-layout-footer v-if="isMobile" />
</template>

<script setup lang="ts">
import DefaultLayoutSidebar from '@/layouts/DefaultLayout/DefaultLayoutSidebar/DefaultLayoutSidebar.vue'
import DefaultLayoutFooter from '@/layouts/DefaultLayout/DefaultLayoutFooter/DefaultLayoutFooter.vue'
import { RouterView } from 'vue-router'
import { useDevice } from '@/composables'

const { isMobile } = useDevice()
</script>

<style lang="scss" src="./DefaultLayout.scss">
</style>