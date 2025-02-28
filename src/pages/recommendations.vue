<template>
  <div class="recommendations-page">
    <video-player
      class="recommendations-page__player"
      title="UserNickname"
      src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWd0ZGhqb3F6cmxzMTlrcXhxZjQxNWE1bHB6dzNhaHRyeWZueWE4YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/TkpA7ELrXTnueydAqv/giphy1080p.mp4?cc=en"
      :rounded="!isMobile"
    />
    <div
      v-if="!isMobile"
      class="recommendations-page__controls"
    >
      <gc-button
        icon="arrow-back-ios-new"
        size="lg"
      />
      <gc-button
        icon="arrow-back-ios-new"
        size="lg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue'
import { useDevice } from '@/composables'

const { isMobile } = useDevice()
</script>

<style lang="scss">
.recommendations-page {
  @apply flex items-center w-full;

  // Basic
  @apply sm:ml-6 sm:py-2.5;
  @apply lg:ml-0;

  &__player {
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