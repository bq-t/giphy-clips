<template>
  <div class="video-player-source">
    <img
      v-if="preview || videoBaseLoading"
      class="video-player-source__preview"
      :src="lazySrc"
    />
    <video
      v-if="!videoPreviewVisible"
      ref="videoBaseRef"
      class="video-player-source__base"
      crossorigin="anonymous"
      mediatype="video"
      preload="auto"
      :muted="computedMuted"
      :src="src"
      playsinline
      autoplay
      loop
      @play="onPlay"
      @pause="onPause"
      @loadstart="onLoading"
      @canplaythrough="onLoaded"
    />
    <img
      class="video-player-source__lazy"
      :src="lazySrc"
    />
  </div>
</template>

<script lang="ts">
import type { Video } from '@/models/video'

export interface VideoPlayerSourceProps {
  src: Video['video']['assets']['source']['url'],
  lazySrc: Video['images']['downsized']['url'],
  preview?: boolean,
  volume?: number,
}
</script>

<script lang="ts" setup>
import { computed, ref, onBeforeUnmount, onMounted, watch, nextTick } from 'vue'

const props = withDefaults(defineProps<VideoPlayerSourceProps>(), {
  preview: true,
  volume: 15,
})

const emit = defineEmits<{
  play: [void],
  pause: [void],
  changeDuration: [duration: number],
  changeTime: [duration: number],
  loading: [state: boolean],
}>()

const videoBaseRef = ref<HTMLVideoElement>()
const videoPreviewVisible = ref(!props.preview)
const videoBaseLoading = ref(true)

const setVolume = (volume: number) => {
  if (!videoBaseRef?.value) {
    return
  }
  videoBaseRef.value.volume = (volume / 100)
}

const turnListeners = () => {
  if (props.preview) {
    videoBaseRef.value?.removeEventListener('timeupdate', onTimeUpdate)
    nextTick(() => videoPreviewVisible.value = true)
    return
  }
  videoPreviewVisible.value = false
  nextTick(() => {
    setVolume(props.volume)
    playVideo()
    videoBaseRef.value?.addEventListener('timeupdate', onTimeUpdate)
  })
}

onMounted(() => turnListeners())
onBeforeUnmount(() => turnListeners())

watch(() => props.volume, setVolume)
watch(() => props.preview, turnListeners)

const computedMuted = computed(() => props.volume === 0)

const onTimeUpdate = () => {
  if (!videoBaseRef?.value) {
    return
  }
  emit('changeDuration', Number(videoBaseRef.value.duration))
  emit('changeTime', Number(videoBaseRef.value.currentTime))
}

const onPlay = () => emit('play')
const onPause = () => emit('pause')
const onLoading = () => {
  videoBaseLoading.value = true
  emit('loading', true)
}
const onLoaded = () => {
  videoBaseLoading.value = false
  emit('loading', false)
}

const playVideo = () => videoBaseRef.value?.play()
const pauseVideo = () => videoBaseRef.value?.pause()

defineExpose({
  playVideo,
  pauseVideo,
})
</script>

<style lang="scss" src="./VideoPlayerSource.scss">
</style>