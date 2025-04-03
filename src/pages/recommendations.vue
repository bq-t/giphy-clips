<template>
  <div class="recommendations-page">
    <video-slider
      :model-value="currentRecommendation"
      class="recommendations-page__slider"
      :items="recommendations"
      :loading="recommendationsPending && !recommendations.length"
      @update:loading="onRefresh"
      @update:model-value="setRecommendation"
    />
    <div
      v-if="!isTablet"
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

const { isTablet } = useDevice()

const clipsStore = useClipsStore()
const { getRecommendations, setRecommendation, flushRecommendations } = clipsStore
const { currentRecommendation, recommendations } = storeToRefs(clipsStore)

const recommendationsPending = ref(false)
onMounted(() => {
  if (recommendations.value.length) {
    return
  }
  fetchRecommendations(true)
})

watch(() => currentRecommendation.value, (val: number) => {
  if (val < recommendations.value.length - 1) {
    return
  }
  fetchRecommendations()
})

const slideUp = () => {
  if (currentRecommendation.value === 0) {
    return
  }
  setRecommendation(currentRecommendation.value - 1)
}

const slideDown = () => {
  if (currentRecommendation.value === recommendations.value.length - 1) {
    return
  }
  setRecommendation(currentRecommendation.value + 1)
}

const fetchRecommendations = (refresh: boolean = false) => {
  let offset = recommendations.value.length
  if (refresh) {
    offset = 0
    flushRecommendations()
  }

  recommendationsPending.value = true
  getRecommendations(offset)
    .finally(() => recommendationsPending.value = false)
}

const onRefresh = (state: boolean) => {
  if (!state) {
    return
  }
  fetchRecommendations(true)
}
</script>

<style lang="scss">
.recommendations-page {
  // Basic
  @apply flex items-center w-full;

  @apply lg:py-2.5;

  &__slider {
    @apply mx-auto;
  }

  &__controls {
    @apply mx-6 mr-12 w-[2.5rem];

    > :first-child {
      @apply rotate-90 mb-5;
    }

    > :last-child {
      @apply -rotate-90;
    }
  }
}
</style>