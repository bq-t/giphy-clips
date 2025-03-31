<template>
  <router-link
    class="video-card"
    :to="to"
  >
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
  </router-link>
</template>

<script lang="ts">
import type { RouterLinkProps } from 'vue-router'

interface VideoCardProps {
  src: string,
  to: RouterLinkProps['to'],
  lazySrc: string,
  liked?: boolean,
}
</script>

<script lang="ts" setup>
import { RouterLink } from 'vue-router'

const props = withDefaults(defineProps<VideoCardProps>(), {
  liked: false,
})
</script>

<style lang="scss" src="./VideoCard.scss">
</style>