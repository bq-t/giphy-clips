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
      :lazy-source="lazySrc"
      :paused="paused"
      :muted="muted"
      :volume="videoVolume"
    />
    <video-player-actions
      @click:favorite="onFavorite"
      @click:explore="onExplore"
    />
    <video-player-footer
      :title="title"
      :progress="computedProgress"
    />
  </div>
</template>

<script lang="ts">
interface VideoPlayerProps {
  title: string,
  src: string,
  lazySrc: string,
  muted?: boolean,
  paused?: boolean,
  rounded?: boolean,
}
</script>

<script lang="ts" setup>
import VideoPlayerHeader from './VideoPlayerHeader/VideoPlayerHeader.vue'
import VideoPlayerSource from './VideoPlayerSource/VideoPlayerSource.vue'
import VideoPlayerActions from './VideoPlayerActions/VideoPlayerActions.vue'
import VideoPlayerFooter from './VideoPlayerFooter/VideoPlayerFooter.vue'
import { computed, ref } from 'vue'
import { useVideoPlayerStore } from '@/stores/videoPlayer'
import { useDevice } from '@/composables'

const props = withDefaults(defineProps<VideoPlayerProps>(), {
  muted: false,
  paused: false,
  rounded: false,
})

const emit = defineEmits([
  'click:favorite',
  'click:explore',
])

const { isMobile } = useDevice()
const headerVisible = ref(false)

const videoPlayerStore = useVideoPlayerStore()
const videoVolume = computed({
  get: () => videoPlayerStore.volume,
  set: value => videoPlayerStore.setVolume(value),
})

const videoSource = ref()
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

const onFavorite = () => emit('click:favorite')
const onExplore = () => {
  if (!videoSource.value) {
    return
  }
  videoSource.value.pauseVideo()
  emit('click:explore')
}
</script>

<style lang="scss" src="./VideoPlayer.scss">
</style>