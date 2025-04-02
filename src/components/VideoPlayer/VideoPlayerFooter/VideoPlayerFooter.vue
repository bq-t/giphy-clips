<template>
  <footer class="video-player-footer">
    <h4 class="video-player-footer__username">
      {{ username || 'Loading..' }}
    </h4>
    <h4 class="video-player-footer__title">
      {{ title || 'Loading..' }}
    </h4>
    <gc-progressbar :model-value="progress" />
  </footer>
</template>

<script lang="ts">
import type { Video } from '@/models/video'

export interface VideoPlayerFooterProps {
  username?: Video['username'],
  title?: Video['title'],
  progress?: number,
}
</script>

<script lang="ts" setup>
withDefaults(defineProps<VideoPlayerFooterProps>(), {
  progress: 0,
})
</script>

<style lang="scss" src="./VideoPlayerFooter.scss">
</style>