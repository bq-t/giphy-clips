<template>
  <router-link
    class="video-card"
    :to="to"
  >
    <gc-button
      class="video-card__action"
      size="sm"
      :icon="computedFavoriteIcon"
      @click.prevent="onFavorite"
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
import type { Video } from '@/models/video'
import type { RouterLinkProps } from 'vue-router'

interface VideoCardProps {
  id: Video['id'],
  src: string,
  to: RouterLinkProps['to'],
  lazySrc: string,
  liked?: boolean,
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useClipsStore } from '@/stores'

const props = withDefaults(defineProps<VideoCardProps>(), {
  liked: false,
})

const clipsStore = useClipsStore()
const { favorites } = storeToRefs(clipsStore)
const { switchFavorite } = clipsStore

const computedFavoriteIcon = computed(() => favorites.value.includes(props.id) ? 'favorite' : 'favorite-outline')

const onFavorite = () => {
  switchFavorite(props.id)
}
</script>

<style lang="scss" src="./VideoCard.scss">
</style>