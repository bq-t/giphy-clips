<template>
  <div class="recommendations-page">
    <video-slider v-model="currentSlide" class="recommendations-page__slider" :items="recommendations" />
    <div v-if="!isMobile" class="recommendations-page__controls">
      <gc-button icon="arrow-back-ios-new" size="lg" :disabled="currentSlide === 0" @click="slideUp" />
      <gc-button icon="arrow-back-ios-new" size="lg" :disabled="currentSlide === recommendations.length - 1"
        @click="slideDown" />
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoSlider from '@/components/VideoSlider/VideoSlider.vue'
import { ref, onMounted, watch } from 'vue'
import { useDevice } from '@/composables'
import { useClipsStore } from '@/stores/clips'

const { isMobile } = useDevice()

const { recommendations, getRecommendations } = useClipsStore()

const currentSlide = ref(0)
const recommendationsPending = ref(false)
onMounted(() => {
  if (recommendations.length) {
    return
  }
  getRecommendations()
    .then(() => recommendationsPending.value = false)
})

watch(() => currentSlide.value, (val: number) => {
  if (val < recommendations.length - 1) {
    return
  }
  recommendationsPending.value = true
  getRecommendations(recommendations.length)
    .then(() => recommendationsPending.value = false)
})

const slideUp = () => {
  if (currentSlide.value === 0) {
    return
  }
  currentSlide.value--
}

const slideDown = () => {
  if (currentSlide.value === recommendations.length - 1) {
    return
  }
  currentSlide.value++
}
</script>

<style lang="scss">
.recommendations-page {
  @apply flex items-center justify-center w-full relative;
  @apply min-h-screen overflow-x-hidden;

  // Basic
  @apply sm:ml-6 sm:py-2.5;
  @apply lg:ml-0;

  &__slider {
    @apply flex-1 max-w-[500px] mx-auto;
  }

  &__controls {
    @apply absolute right-6 w-[2.5rem] flex flex-col items-center;
    @apply lg:static lg:mr-12;

    > :first-child {
      @apply rotate-90 mb-5;
    }

    > :last-child {
      @apply -rotate-90;
    }
  }
}
</style>
