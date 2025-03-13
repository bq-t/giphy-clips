<template>
  <div class="video-player-actions">
    <gc-button
      icon="favorite"
      size="lg"
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

<script lang="ts" setup>
const emit = defineEmits([
  'click:favorite',
  'click:explore',
])

const onFavorite = () => emit('click:favorite')
const onExplore = () => emit('click:explore')
</script>

<style lang="scss" src="./VideoPlayerActions.scss">
</style>