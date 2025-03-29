<template>
  <div class="video-card">
    <gc-button
      class="video-card__action"
      icon="favorite-outline"
      size="sm"
      disabled
    />
    <img
      class="video-card__base"
      :src="src"
    />
    <img
      class="video-card__lazy"
      :src="lazySrc"
    />
  </div>
</template>

<script lang="ts">
interface VideoCardProps {
  src: string,
  lazySrc: string,
  liked?: boolean,
}
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<VideoCardProps>(), {
  liked: false,
})
</script>

<style lang="scss" src="./VideoCard.scss">
</style>