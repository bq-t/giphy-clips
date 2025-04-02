<template>
  <div class="video-player">
    <div
      class="video-player__overlay"
      @click.self="switchPlayerState"
      @mouseenter="playerHeaderVisible = true"
      @mouseleave="playerHeaderVisible = false"
    >
      <video-player-header
        v-show="playerHeaderVisible && !playerLoading && !isMobile"
        v-model:volume="playerVolume"
      />
      <gc-icon
        v-if="playerPaused"
        class="video-player__overlay-pause"
        name="play-arrow"
        size="6rem"
        @click.stop="switchPlayerState"
      />
      <video-player-actions
        :id="id"
        @click:explore="onExplore"
        @click:comment="onComment"
      />
      <video-player-footer
        :title="title"
        :username="username"
        :progress="computedPlayerProgress"
      />
      <div
        v-if="playerLoading"
        class="video-player__overlay-loader"
      >
        <div class="video-player__overlay-loader-skeleton" />
      </div>
    </div>
    <video-player-source
      ref="videoSourceRef"
      :src="src"
      :lazy-src="lazySrc"
      :volume="playerVolume"
      @play="playerPaused = false"
      @pause="playerPaused = true"
      @loading="val => playerLoading = val"
      @change-time="val => playerTime = val"
      @change-duration="val => playerDuration = val"
    />
  </div>
</template>

<script lang="ts">
import type { Video } from '@/models/video'
import type { VideoPlayerActionsProps } from '@/components/VideoPlayer/VideoPlayerActions/VideoPlayerActions.vue'
import type { VideoPlayerFooterProps } from '@/components/VideoPlayer/VideoPlayerFooter/VideoPlayerFooter.vue'
import type { VideoPlayerSourceProps } from '@/components/VideoPlayer/VideoPlayerSource/VideoPlayerSource.vue'

export interface VideoPlayerProps {
  id: VideoPlayerActionsProps['id'],
  url: Video['url'],
  title: VideoPlayerFooterProps['title'],
  username: VideoPlayerFooterProps['username'],
  src: VideoPlayerSourceProps['src'],
  lazySrc: VideoPlayerSourceProps['lazySrc'],
  paused?: boolean,
}
</script>

<script lang="ts" setup>
import VideoPlayerActions from '@/components/VideoPlayer/VideoPlayerActions/VideoPlayerActions.vue'
import VideoPlayerFooter from '@/components/VideoPlayer/VideoPlayerFooter/VideoPlayerFooter.vue'
import VideoPlayerHeader from '@/components/VideoPlayer/VideoPlayerHeader/VideoPlayerHeader.vue'
import VideoPlayerSource from '@/components/VideoPlayer/VideoPlayerSource/VideoPlayerSource.vue'
import { useVideoPlayerStore } from '@/stores'
import { useDevice } from '@/composables'
import { computed, ref, watch } from 'vue'

const props = withDefaults(defineProps<VideoPlayerProps>(), {
  paused: true,
})

const emit = defineEmits<{
  'click:comment': [void],
}>()

const { isMobile } = useDevice()

watch(() => props.paused, (val: boolean) => {
  if (!videoSourceRef.value) {
    return
  }
  videoSourceRef.value[val ? 'pauseVideo' : 'playVideo']()
})

const videoSourceRef = ref<typeof VideoPlayerSource>()

const playerHeaderVisible = ref(false)
const playerPaused = ref(props.paused)
const playerLoading = ref(true)

const videoPlayerStore = useVideoPlayerStore()
const playerVolume = computed({
  get: () => videoPlayerStore.volume,
  set: (volume: number) => videoPlayerStore.setVolume(volume),
})

const playerDuration = ref(0)
const playerTime = ref(0)
const computedPlayerProgress = computed(() => {
  if (playerDuration.value === 0) {
    return 0
  }
  return (100 * playerTime.value) / playerDuration.value
})

const switchPlayerState = () => {
  if (playerLoading.value || !videoSourceRef?.value) {
    return
  }
  videoSourceRef.value[playerPaused.value ? 'playVideo' : 'pauseVideo']()
}

const onComment = () => emit('click:comment')
const onExplore = () => {
  if (!videoSourceRef.value) {
    return
  }
  window.open(props.url, '_blank')
  videoSourceRef.value.pauseVideo()
}
</script>

<style lang="scss" src="./VideoPlayer.scss">
</style>