<template>
  <div class="video-display-comments">
    <h3 class="video-display-comments__header">
      Comments ({{ items.length }})
    </h3>
    <ul class="video-display-comments__list">
      <video-display-comments-item
        v-for="(item, itemIndex) in items"
        :key="itemIndex"
        v-bind="item"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import type { VideoDisplayCommentsItemProps } from '@/components/VideoDisplay/VideoDisplayComments/VideoDisplayCommentsItem/VideoDisplayCommentsItem.vue'

interface VideoDisplayCommentsProps {
  items?: VideoDisplayCommentsItemProps[],
}
</script>

<script lang="ts" setup>
import VideoDisplayCommentsItem from '@/components/VideoDisplay/VideoDisplayComments/VideoDisplayCommentsItem/VideoDisplayCommentsItem.vue'

withDefaults(defineProps<VideoDisplayCommentsProps>(), {
  items: () => ([]),
})
</script>

<style lang="scss" src="./VideoDisplayComments.scss">
</style>