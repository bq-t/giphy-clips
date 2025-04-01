<template>
  <div class="favorites-page">
    <h1 class="favorites-page__heading">
      <gc-icon
        class="favorites-page__heading-icon"
        name="favorite-outline"
      />
      Your favorites:
    </h1>
    <div class="favorites-page__grid">
      <video-card
        v-for="(clip, clipIndex) in clips"
        :key="clipIndex"
        :id="clip.id"
        :to="{ name: 'clips-clipSlug', params: { clipSlug: clip.slug } }"
        :src="clip.images.downsized.url"
        :lazy-src="clip.images.downsized.url"
      />
      <div v-intersect="onIntersect" />
    </div>
  </div>
</template>

<script lang="ts">
import type { Video } from '@/models/video'
</script>

<script lang="ts" setup>
import VideoCard from '@/components/VideoCard/VideoCard.vue'
import { onMounted, ref } from 'vue'
import { useThrottle } from '@/composables'
import { useClipsStore } from '@/stores'

const clipsStore = useClipsStore()
const { getFavorites } = clipsStore

const clips = ref<Video[]>([])
const clipsOffset = ref(0)

onMounted(() => fetchClips())

const fetchClips = () => {
  getFavorites(clipsOffset.value).then(data => {
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format')
    }
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
.favorites-page {
  // Basic
  @apply w-full overflow-y-auto;

  @apply p-5;
  @apply lg:p-10;

  &__heading {
    // Basic
    @apply flex items-center font-jost;

    @apply text-3xl mb-5 justify-center;
    @apply md:text-4xl md:justify-start;
    @apply lg:text-5xl lg:mb-10;

    &-icon > svg {
      @apply mr-2 size-6;
      @apply md:mr-4 md:size-9;
      @apply lg:size-12;
    }
  }

  &__grid {
    @apply grid grid-flow-row auto-rows-max gap-5;

    @apply grid-cols-2;
    @apply sm:grid-cols-3;
    @apply md:grid-cols-4;
    @apply lg:grid-cols-6;
  }
}
</style>