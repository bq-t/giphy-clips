<template>
  <header class="video-player-header">
    <gc-volume-input
      v-model="volumeModel"
      :expanded="isTablet"
    />
  </header>
</template>

<script lang="ts">
export type VideoPlayerHeaderVolumeModel = number
export interface VideoPlayerHeaderProps {
  volume?: VideoPlayerHeaderVolumeModel,
}
</script>

<script lang="ts" setup>
import { useDevice } from '@/composables'

const volumeModel = defineModel<VideoPlayerHeaderVolumeModel>('volume', {
  default: 15,
})

const { isTablet } = useDevice()
</script>

<style lang="scss" src="./VideoPlayerHeader.scss">
</style>