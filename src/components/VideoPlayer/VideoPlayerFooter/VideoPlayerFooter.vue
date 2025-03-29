<template>
  <div class="video-player-footer">
    <h1
      v-if="title"
      class="video-player-footer__title"
    >
      {{ title }}
    </h1>
    <gc-progressbar :model-value="progress" />
  </div>
</template>

<script lang="ts">
interface VideoPlayerFooterProps {
  title: string,
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