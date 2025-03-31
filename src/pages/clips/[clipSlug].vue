<template>
  <div class="clips-clipSlug-page">
    <video-display
      class="clips-clipSlug-page__display"
      :title="clipData.title"
      :username="clipData.username"
      :src="clipData.video?.assets?.source?.url"
      :lazy-src="clipData.images?.downsized?.url"
      :tags="clipData.tags"
      :comments="clipData.comments"
    />
  </div>
</template>

<script lang="ts">
import type { Video } from '@/models/video'
</script>

<script lang="ts" setup>
import VideoDisplay from '@/components/VideoDisplay/VideoDisplay.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useClipsStore } from '@/stores'

const { getClip } = useClipsStore()

const clipData = ref<Video>({} as Video)

onMounted(async () => {
  const currentRoute = useRoute()
  clipData.value = await getClip(currentRoute.params.clipSlug as string) as Video
})
</script>

<style lang="scss">
.clips-clipSlug-page {
  // Basic
  @apply flex items-center w-full overflow-x-hidden;
  @apply sm:justify-center sm:py-2.5 sm:px-5;

  &__display {
    @apply h-full;
  }
}
</style>