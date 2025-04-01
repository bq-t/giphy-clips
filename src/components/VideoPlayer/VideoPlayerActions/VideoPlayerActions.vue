<template>
  <div class="video-player-actions">
    <gc-button
      size="lg"
      :icon="computedFavoriteIcon"
      @click="onFavorite"
    />
    <gc-button
      icon="open-in-new"
      color="primary"
      size="lg"
      @click="onExplore"
    />
  </div>
</template>

<script lang="ts">
import type { Video } from '@/models'

export interface VideoPlayerActionsProps {
  id: Video['id'],
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useClipsStore } from '@/stores'

const props = defineProps<VideoPlayerActionsProps>()

const emit = defineEmits([
  'click:favorite',
  'click:explore',
])

const clipsStore = useClipsStore()
const { favorites } = storeToRefs(clipsStore)
const { switchFavorite } = clipsStore

const computedFavoriteIcon = computed(() => favorites.value.includes(props.id) ? 'favorite' : 'favorite-outline')

const onExplore = () => emit('click:explore')
const onFavorite = () => {
  switchFavorite(props.id)
  emit('click:favorite')
}
</script>

<style lang="scss" src="./VideoPlayerActions.scss">
</style>