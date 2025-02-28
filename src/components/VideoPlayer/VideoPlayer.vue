<template>
  <div
    :class="computedClass"
    @mouseenter="headerVisible = true"
    @mouseleave="headerVisible = false"
  >
    <video-player-header
      v-show="headerVisible && !isMobile"
      v-model="videoVolume"
    />
    <video-player-source
      ref="videoSource"
      :source="src"
      :volume="videoVolume"
    />
    <video-player-actions />
    <video-player-footer
      :title="title"
      :progress="computedProgress"
    />
  </div>
</template>

<script lang="ts">
interface VideoPlayerProps {
  title?: string,
  src?: string,
  rounded?: boolean,
}
</script>

<script lang="ts" setup>
import VideoPlayerHeader from './VideoPlayerHeader/VideoPlayerHeader.vue'
import VideoPlayerSource from './VideoPlayerSource/VideoPlayerSource.vue'
import VideoPlayerActions from './VideoPlayerActions/VideoPlayerActions.vue'
import VideoPlayerFooter from './VideoPlayerFooter/VideoPlayerFooter.vue'
import { computed, ref } from 'vue'
import { useDevice } from '@/composables'

const props = withDefaults(defineProps<VideoPlayerProps>(), {
  rounded: false,
})

const { isMobile } = useDevice()
const headerVisible = ref(false)

const videoSource = ref(null)
const videoVolume = ref(15)
const computedProgress = computed(() => {
  if (!videoSource.value) {
    return 0
  }
  return (100 * videoSource.value.videoTimestamp) / videoSource.value.videoDuration
})

const computedClass = computed(() => ([
  'video-player',
  { 'video-player_rounded': props.rounded },
]))
</script>

<style lang="scss" src="./VideoPlayer.scss">
</style>