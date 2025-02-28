<template>
  <div class="video-player-header">
    <gc-volume-control
      v-model="modelValue"
      :always-show-volume="isTablet"
    />
  </div>
</template>

<script lang="ts">
type VideoPlayerHeaderModel = number
</script>

<script lang="ts" setup>
import { useDevice } from '@/composables'

const modelValue = defineModel<VideoPlayerHeaderModel>({
  default: 15,
})

const { isTablet } = useDevice()
</script>

<style lang="scss" src="./VideoPlayerHeader.scss">
</style>