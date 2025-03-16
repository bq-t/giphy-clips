<template>
  <div class="video-player-source">
    <div
      class="video-player-source__overlay"
      @click="switchState"
    >
      <gc-icon
        v-if="videoPaused"
        class="video-player-source__overlay-pause"
        name="play-arrow"
      />
      <div
        v-if="videoLoading"
        class="video-player-source__overlay-loader"
      >
        <div class="video-player-source__overlay-loader-skeleton" />
      </div>
    </div>
    <img
      class="video-player-source__lazy"
      :src="lazySource"
    />
    <video
      ref="videoRef"
      class="video-player-source__base"
      crossorigin="anonymous"
      :src="source"
      :muted="isMuted"
      playsinline
      autoplay
      loop
      @pause="videoPaused = true"
      @play="videoPaused = false"
      @canplaythrough="videoLoading = false"
      @loadstart="videoLoading = true"
      @click="switchVideoPlayState"
    />
  </div>
</template>

<script lang="ts">
interface VideoPlayerSourceProps {
  source: string,
  lazySource: string,
  muted?: boolean,
  paused?: boolean,
  volume?: number,
}
</script>

<script lang="ts" setup>
import { computed, ref, onBeforeUnmount, onMounted, watch } from 'vue'

const props = withDefaults(defineProps<VideoPlayerSourceProps>(), {
  muted: false,
  paused: false,
  volume: 15,
})

const videoRef = ref()
const videoDuration = ref(1)
const videoTimestamp = ref(0)
const videoVolume = ref(props.volume)
const videoPaused = ref(props.paused)
const videoLoading = ref(true)

// Listeners
const updateTime = () => {
  videoDuration.value = videoRef.value.duration
  videoTimestamp.value = videoRef.value.currentTime
}

onMounted(() => {
  updateVolume(videoVolume.value)
  videoRef.value.addEventListener('timeupdate', updateTime)
})

onBeforeUnmount(() => {
  videoRef.value.removeEventListener('timeupdate', updateTime)
})

watch(() => props.volume, updateVolume)
watch(() => props.paused, (val) => val ? pauseVideo() : playVideo())

const isMuted = computed(() => props.volume <= 0 || props.muted)

function updateVolume(value: number) {
  if (!videoRef.value) {
    return
  }
  videoRef.value.volume = (value / 100)
  videoVolume.value = value
}

function switchState() {
  if (videoLoading.value) {
    return
  }
  videoPaused.value
    ? playVideo() : pauseVideo()
}

function playVideo() {
  videoRef.value.play()
}

function pauseVideo() {
  videoRef.value.pause()
}

function switchVideoPlayState() {
  const paused = videoRef.value.paused
  return paused
    ? playVideo()
    : pauseVideo()
}

defineExpose({
  playVideo,
  pauseVideo,
  isMuted,
  videoDuration,
  videoTimestamp,
})
</script>

<style lang="scss" src="./VideoPlayerSource.scss">
</style>