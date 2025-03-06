<template>
  <div class="recommendations-page">
    <video-slider
      v-model="currentVideo"
      class="recommendations-page__slider"
      :items="videosArray"
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
import { ref } from 'vue'
import { useDevice } from '@/composables'

const currentVideo = ref(0)
const videosArray = [
  'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWd0ZGhqb3F6cmxzMTlrcXhxZjQxNWE1bHB6dzNhaHRyeWZueWE4YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/TkpA7ELrXTnueydAqv/giphy1080p.mp4',
  'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2d5cTY5MGV0em9lbG1jaDJjMGxjdGllNTRoejRrMTVzaXAyY2FvbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/GbQxQ7QSeL71NtXAs1/giphy1080p.mp4',
  'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExem1xaGlxZGlkM3c5cWY4cnducmx2MGY5aXFrOXJnajlxNm90NDExeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/2JncG7P8IXTGKm7FRt/giphy480p.mp4',
]

function slideUp() {
  if (currentVideo.value === 0) {
    return
  }
  currentVideo.value--
}
function slideDown() {
  if (currentVideo.value === videosArray.length - 1) {
    return
  }
  currentVideo.value++
}

const { isMobile } = useDevice()
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