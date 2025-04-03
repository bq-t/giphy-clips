<template>
  <div class="video-player-actions">
    <gc-button
      size="lg"
      :icon="computedFavoriteIcon"
      :loading="loading"
      @click="onFavorite"
    />
    <gc-button
      size="lg"
      icon="mark-unread-chat-alt-outline"
      :loading="loading"
      @click="onComment"
    />
    <gc-button
      icon="open-in-new"
      color="primary"
      size="lg"
      :loading="loading"
      @click="onExplore"
    />
  </div>
</template>

<script lang="ts">
import type { Video } from '@/models/video'

export interface VideoPlayerActionsProps {
  id?: Video['id'],
  loading?: boolean,
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useClipsStore } from '@/stores'

const props = withDefaults(defineProps<VideoPlayerActionsProps>(), {
  loading: false,
})

const emit = defineEmits<{
  'click:comment': [void],
  'click:explore': [void],
}>()

const clipsStore = useClipsStore()
const { favorites } = storeToRefs(clipsStore)
const { switchFavorite } = clipsStore

const computedFavoriteIcon = computed(() => {
  if (!props.id) {
    return 'favorite-outline'
  }
  return favorites.value.includes(props.id)
    ? 'favorite' : 'favorite-outline'
})

const onFavorite = () => {
  if (!props.id) {
    return
  }
  switchFavorite(props.id)
}
const onComment = () => emit('click:comment')
const onExplore = () => emit('click:explore')
</script>

<style lang="scss" src="./VideoPlayerActions.scss">
</style>