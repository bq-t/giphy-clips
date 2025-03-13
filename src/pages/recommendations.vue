<template>
  <div class="recommendations-page">
    <video-slider
      v-model="currentVideo"
      class="recommendations-page__slider"
      :items="recommendations"
      @update:model-value="onSlide"
    />
    <div
      v-if="!isMobile"
      class="recommendations-page__controls"
    >
      <gc-button
        icon="arrow-back-ios-new"
        size="lg"
        @click="slideUp"
      />
      <gc-button
        icon="arrow-back-ios-new"
        size="lg"
        @click="slideDown"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoSlider from '@/components/VideoSlider/VideoSlider.vue'
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDevice } from '@/composables'
import { useClipsStore } from '@/stores/clips'

const currentVideo = ref(0)
function slideUp() {
  if (currentVideo.value === 0) {
    return
  }
  currentVideo.value--
}
function slideDown() {
  if (currentVideo.value === recommendations.length - 1) {
    return
  }
  currentVideo.value++
}

const { isMobile } = useDevice()

const { recommendations, getRecommendations } = useClipsStore()

const recommendationsPending = ref(false)
onMounted(() => {
  if (recommendations.length) {
    return
  }
  getRecommendations()
    .then(() => recommendationsPending.value = false)
})

function onSlide(value: number) {
  if (value < recommendations.length - 1) {
    return
  }
  recommendationsPending.value = true
  getRecommendations(recommendations.length)
    .then(() => recommendationsPending.value = false)
}
</script>

<style lang="scss">
.recommendations-page {
  @apply flex items-center w-full;

  // Basic
  @apply sm:ml-6 sm:py-2.5;
  @apply lg:ml-0;

  &__slider {
    @apply mx-auto;
  }

  &__controls {
    @apply mr-6 w-[2.5rem];
    @apply lg:ml-[12.5rem] lg:mr-12;

    > :first-child {
      @apply rotate-90 mb-5;
    }

    > :last-child {
      @apply -rotate-90;
    }
  }
}
</style>