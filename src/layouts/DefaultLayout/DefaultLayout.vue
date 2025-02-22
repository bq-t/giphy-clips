<template>
  <main class="default-layout">
    <default-layout-sidebar />
    <router-view />
  </main>
</template>

<script setup lang="ts">
import DefaultLayoutSidebar from './DefaultLayoutSidebar/DefaultLayoutSidebar.vue'
import { RouterView } from 'vue-router'
</script>

<style lang="scss" src="./DefaultLayout.scss">
</style>