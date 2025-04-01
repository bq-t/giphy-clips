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
        size="6rem"
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
      :autoplay="autoplay"
      playsinline
      loop
      @pause="videoPaused = true"
      @play="videoPaused = false"
      @loadstart="videoLoading = true"
      @canplaythrough="onCanPlay"
    />
  </div>
</template>

<script lang="ts">
interface VideoPlayerSourceProps {
  source: string,
  lazySource: string,
  autoplay?: boolean,
  muted?: boolean,
  paused?: boolean,
  volume?: number,
}
</script>

<script lang="ts" setup>
import { computed, ref, onBeforeUnmount, onMounted, watch } from 'vue'

const props = withDefaults(defineProps<VideoPlayerSourceProps>(), {
  autoplay: false,
  muted: false,
  paused: false,
  volume: 15,
})

const videoRef = ref()
const videoDuration = ref(1)
const videoTimestamp = ref(0)
const videoVolume = ref(props.volume)
const videoPaused = ref(!props.autoplay)
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

function onCanPlay() {
  if (!videoRef?.value) {
    return
  }
  videoLoading.value = false
  videoPaused.value = videoRef.value.paused
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