<template>
  <header class="video-display-header">
    <h2 class="video-display-header__author">
      {{ username }}
    </h2>
    <span class="video-display-header__dot" />
    <h1 class="video-display-header__title">
      {{ title }}
    </h1>
  </header>
</template>

<script lang="ts">
import type { Video } from '@/models/video'

export interface VideoDisplayHeaderProps {
  username?: Video['username'],
  title?: Video['title'],
}
</script>

<script lang="ts" setup>
withDefaults(defineProps<VideoDisplayHeaderProps>(), {
  username: 'Loading..',
  title: 'Loading..',
})
</script>

<style lang="scss" src="./VideoDisplayHeader.scss">
</style>