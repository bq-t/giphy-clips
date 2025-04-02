<template>
  <div class="video-display-tags">
    <gc-badge
      v-for="(item, itemIndex) in items"
      :key="itemIndex"
    >
      {{ item }}
    </gc-badge>
  </div>
</template>

<script lang="ts">
import type { Video } from '@/models/video'

export interface VideoDisplayTagsProps {
  items: Video['tags'],
}
</script>

<script lang="ts" setup>
defineProps<VideoDisplayTagsProps>()
</script>

<style lang="scss" src="./VideoDisplayTags.scss">
</style>