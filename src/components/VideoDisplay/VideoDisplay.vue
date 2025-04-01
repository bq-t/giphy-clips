<template>
  <div
    ref="displayRef"
    class="video-display"
    :style="computedStyle"
  >
    <video-player
      class="video-display__player"
      :id="id"
      :src="src"
      :lazy-src="lazySrc"
      :title="title"
      :rounded="!isMobile"
      autoplay
    />
    <div class="video-display__data">
      <video-display-header
        :title="title"
        :username="username"
      />
      <div class="video-display__tags">
        <gc-badge
          v-for="(tag, tagIndex) in tags"
          :key="tagIndex"
        >
          {{ tag }}
        </gc-badge>
      </div>
      <video-display-comments :items="comments" />
    </div>
  </div>
</template>

<script lang="ts">
import type { VideoDisplayHeaderProps } from '@/components/VideoDisplay/VideoDisplayHeader/VideoDisplayHeader.vue'
import type { VideoPlayerProps } from '@/components/VideoPlayer/VideoPlayer.vue'
import type { SwipeDirection, HoldDelta } from '@/composables'
import type { Video } from '@/models/video'

interface VideoDisplayProps extends VideoDisplayHeaderProps {
  id?: Video['id'],
  src?: VideoPlayerProps['src'],
  lazySrc?: VideoPlayerProps['lazySrc'],
  comments?: Video['comments'],
  tags?: Video['tags'],
}
</script>

<script lang="ts" setup>
import VideoDisplayHeader from '@/components/VideoDisplay/VideoDisplayHeader/VideoDisplayHeader.vue'
import VideoDisplayComments from '@/components/VideoDisplay/VideoDisplayComments/VideoDisplayComments.vue'
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useDevice, useTouch } from '@/composables'

withDefaults(defineProps<VideoDisplayProps>(), {
  username: 'Loading..',
  title: 'Loading..',
  src: '',
  lazySrc: '',
  tags: () => ([]),
  comments: () => ([]),
})

const { isMobile } = useDevice()

onMounted(() => {
  window.addEventListener('resize', computeOffset)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', computeOffset)
})

const displaySwiped = ref(false)
const displaySwipeOffset = ref(0)
const displayTransformOffset = ref(0)

const displayRef = ref<HTMLElement>()
const { onSwipe, onHold } = useTouch(displayRef, {
  hold: { preventDefault: false },
})

onSwipe((direction: SwipeDirection) => {
  if (!['left', 'right'].includes(direction)) {
    return
  }
  displaySwiped.value = direction === 'left'
  computeOffset()
})

onHold((delta: HoldDelta) => {
  if (
    displaySwiped.value && delta.x < 0
    || !displaySwiped.value && delta.x > 0
    || Math.abs(delta.x) <= Math.abs(delta.y)
    || Math.abs(delta.x) >= 300
    || !isMobile.value
  ) {
    return
  }
  displaySwipeOffset.value = delta.x
})

const computedStyle = computed(() => {
  const generalOffset = displayTransformOffset.value + displaySwipeOffset.value
  return {
    transform: `translateX(${generalOffset}px)`,
  }
})

const computeOffset = () => {
  if (!isMobile.value || !displayRef?.value) {
    return
  }
  displaySwipeOffset.value = 0
  displayTransformOffset.value = displaySwiped.value
    ? -(displayRef.value.clientWidth / 2) : 0
}
</script>

<style lang="scss" src="./VideoDisplay.scss">
</style>