<template>
  <li class="video-display-comments-item">
    <img
      class="video-display-comments-item__avatar"
      src="/images/Avatar.png"
    />
    <div class="video-display-comments-item__data">
      <div class="video-display-comments-item__username">
        {{ username }}
      </div>
      <p class="video-display-comments-item__text">
        {{ text }}
      </p>
    </div>
  </li>
</template>

<script lang="ts">
import type { CommentData } from '@/models/video'

export interface VideoDisplayCommentsItemProps extends CommentData {}
</script>

<script lang="ts" setup>
defineProps<VideoDisplayCommentsItemProps>()
</script>

<style lang="scss" src="./VideoDisplayCommentsItem.scss">
</style>