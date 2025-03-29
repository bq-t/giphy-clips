<template>
  <div class="browser-page">
    <video-card
      v-for="(clip, clipIndex) in clips"
      :key="clipIndex"
      :src="clip.images.downsized.url"
      :lazy-src="clip.images.downsized.url"
    />
    <div v-intersect="onIntersect" />
  </div>
</template>

<script lang="ts">
import type { Video } from '@/models/video'
</script>

<script setup lang="ts">
import VideoCard from '@/components/VideoCard/VideoCard.vue'
import { onMounted, ref } from 'vue'
import { useThrottle } from '@/composables'
import { useClipsStore } from '@/stores'

const clipsStore = useClipsStore()
const { getClips } = clipsStore

const clips = ref<Video[]>([])
const clipsOffset = ref(0)
onMounted(() => fetchClips())

const fetchClips = () => {
  getClips(clipsOffset.value).then(data => {
    clips.value.push(...data)
    clipsOffset.value += 18
  })
}

const onIntersect = useThrottle((e: IntersectionObserverEntry) => {
  if (!e.isIntersecting || !clips.value.length) {
    return
  }
  fetchClips()
}, 300)
</script>

<style lang="scss">
.browser-page {
  @apply grid grid-flow-row auto-rows-max gap-5 w-full overflow-y-auto;

  @apply grid-cols-2 py-5 px-6;
  @apply sm:grid-cols-3 sm:px-12;
  @apply md:grid-cols-4;
  @apply lg:grid-cols-6 lg:p-10;
}
</style>