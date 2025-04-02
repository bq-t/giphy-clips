<template>
  <header class="video-display-header">
    <h3 class="video-display-header__username">
      {{ username || 'Loading..' }}
    </h3>
    <span class="video-display-header__dot" />
    <h2 class="video-display-header__title">
      {{ title || 'Loading..' }}
    </h2>
  </header>
</template>

<script lang="ts">
import type { Video } from '@/models/video'

export interface VideoDisplayHeaderProps {
  title?: Video['title'],
  username?: Video['username'],
}
</script>

<script lang="ts" setup>
defineProps<VideoDisplayHeaderProps>()
</script>

<style lang="scss" src="./VideoDisplayHeader.scss">
</style>