<template>
  <footer class="default-layout-footer">
    <router-link
      class="default-layout-footer__logotype"
      :to="{ name: 'index' }"
    >
      <app-logotype collapsed />
    </router-link>
    <default-layout-navbar type="row" />
  </footer>
</template>

<script lang="ts" setup>
import DefaultLayoutNavbar from '@/layouts/DefaultLayout/DefaultLayoutNavbar/DefaultLayoutNavbar.vue'
import AppLogotype from '@/components/AppLogotype.vue'
</script>

<style lang="scss" src="./DefaultLayoutFooter.scss">
</style>