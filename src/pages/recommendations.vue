<template>
  <div class="recommendations-page">
    <video-slider
      :model-value="currentRecommendation"
      class="recommendations-page__slider"
      :items="recommendations"
      @update:model-value="setRecommendation"
    />
    <div
      v-if="!isMobile"
      class="recommendations-page__controls"
    >
      <gc-button
        icon="arrow-back-ios-new"
        size="lg"
        :disabled="currentRecommendation === 0"
        @click="slideUp"
      />
      <gc-button
        icon="arrow-back-ios-new"
        size="lg"
        :loading="recommendationsPending"
        :disabled="currentRecommendation === recommendations.length - 1"
        @click="slideDown"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoSlider from '@/components/VideoSlider/VideoSlider.vue'
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDevice } from '@/composables'
import { useClipsStore } from '@/stores/clips'

const { isMobile } = useDevice()

const clipsStore = useClipsStore()
const { recommendations, getRecommendations, setRecommendation } = clipsStore
const { currentRecommendation } = storeToRefs(clipsStore)

const recommendationsPending = ref(false)
onMounted(() => {
  if (recommendations.length) {
    return
  }
  getRecommendations()
    .then(() => recommendationsPending.value = false)
})

watch(() => currentRecommendation.value, (val: number) => {
  if (val < recommendations.length - 1) {
    return
  }
  recommendationsPending.value = true
  getRecommendations(recommendations.length)
    .then(() => recommendationsPending.value = false)
})

const slideUp = () => {
  if (currentRecommendation.value === 0) {
    return
  }
  setRecommendation(currentRecommendation.value - 1)
}

const slideDown = () => {
  if (currentRecommendation.value === recommendations.length - 1) {
    return
  }
  setRecommendation(currentRecommendation.value + 1)
}
</script>

<style lang="scss">
.recommendations-page {
  // Basic
  @apply flex items-center w-full;

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