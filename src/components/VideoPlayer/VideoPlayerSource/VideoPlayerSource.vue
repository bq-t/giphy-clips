<template>
  <div class="video-player-source">
    <video
      ref="videoBaseRef"
      class="video-player-source__base"
      crossorigin="anonymous"
      :src="src"
      :muted="computedMuted"
      playsinline
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
  volume?: number,
}
</script>

<script lang="ts" setup>
import { computed, ref, onBeforeUnmount, onMounted, watch } from 'vue'

const props = withDefaults(defineProps<VideoPlayerSourceProps>(), {
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

const setVolume = (volume: number) => {
  if (!videoBaseRef?.value) {
    return
  }
  videoBaseRef.value.volume = (volume / 100)
}

onMounted(() => {
  setVolume(props.volume)
  videoBaseRef.value?.addEventListener('timeupdate', onTimeUpdate)
})

onBeforeUnmount(() => {
  videoBaseRef.value?.removeEventListener('timeupdate', onTimeUpdate)
})

watch(() => props.volume, setVolume)

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
const onLoading = () => emit('loading', true)
const onLoaded = () => {
  if (videoBaseRef.value?.paused) {
    emit('pause')
  }
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