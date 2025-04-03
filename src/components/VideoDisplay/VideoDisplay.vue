<template>
  <div
    ref="displayRef"
    class="video-display"
    :class="computedClass"
    :style="computedStyle"
  >
    <video-player
      class="video-display__player"
      :id="id"
      :title="title"
      :username="username"
      :url="url"
      :src="src"
      :lazy-src="lazySrc"
      :preview="preview || expanded && isMobile"
      @click:comment="expandDisplay"
    />
    <div
      v-show="expanded || isMobile"
      class="video-display__data"
    >
      <video-display-header
        :title="title"
        :username="username"
      />
      <video-display-tags
        v-if="tags.length"
        :items="tags"
      />
      <video-display-comments :items="comments" />
    </div>
  </div>
</template>

<script lang="ts">
import type { VideoDisplayCommentsProps } from '@/components/VideoDisplay/VideoDisplayComments/VideoDisplayComments.vue'
import type { VideoDisplayHeaderProps } from '@/components/VideoDisplay/VideoDisplayHeader/VideoDisplayHeader.vue'
import type { VideoDisplayTagsProps } from '@/components/VideoDisplay/VideoDisplayTags/VideoDisplayTags.vue'
import type { VideoPlayerProps } from '@/components/VideoPlayer/VideoPlayer.vue'
import type { SwipeDirection, MoveDelta } from '@/composables'


export interface VideoDisplayProps extends VideoDisplayHeaderProps {
  id?: VideoPlayerProps['id'],
  url?: VideoPlayerProps['url'],
  src?: VideoPlayerProps['src'],
  lazySrc?: VideoPlayerProps['lazySrc'],
  tags?: VideoDisplayTagsProps['items'],
  comments?: VideoDisplayCommentsProps['items'],
  preview?: boolean,
  expanded?: boolean,
  // @todo other props
}
</script>

<script lang="ts" setup>
import VideoDisplayComments from '@/components/VideoDisplay/VideoDisplayComments/VideoDisplayComments.vue'
import VideoDisplayHeader from '@/components/VideoDisplay/VideoDisplayHeader/VideoDisplayHeader.vue'
import VideoDisplayTags from '@/components/VideoDisplay/VideoDisplayTags/VideoDisplayTags.vue'
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue'
import { useTouch, useDevice } from '@/composables'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<VideoDisplayProps>(), {
  id: '',
  title: '',
  username: '',
  url: '',
  src: '',
  lazySrc: '',
  tags: () => ([]),
  comments: () => ([]),
  preview: true,
  expanded: false,
})

const emit = defineEmits<{
  expand: [void],
}>()

onMounted(() => {
  computeOffset()
  window.addEventListener('resize', computeOffset)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', computeOffset)
})

watch(() => props.expanded, () => {
  if (!isMobile.value) {
    return
  }
  computeOffset()
})

const { isMobile } = useDevice()

const displayRef = ref<HTMLElement>()
const { onSwipe, onMove, onDrop } = useTouch(displayRef, {
  move: {
    preventDefault: false,
    limit: 300,
  },
})

const displaySwipeOffset = ref(0)
const displayTransformOffset = ref(0)
onSwipe((direction: SwipeDirection) => {
  if (
    !['left', 'right'].includes(direction)
    || direction === 'right' && !props.expanded
    || direction === 'left' && props.expanded
  ) {
    return
  }
  expandDisplay()
})

onMove((delta: MoveDelta) => {
  if (
    props.expanded && delta.x < 0
    || !props.expanded && delta.x > 0
    || !isMobile.value
  ) {
    return
  }
  displaySwipeOffset.value = delta.x
})

onDrop(() => displaySwipeOffset.value = 0)

const computedStyle = computed(() => {
  const generalOffset = displayTransformOffset.value + displaySwipeOffset.value
  return {
    transform: `translateX(${generalOffset}px)`,
  }
})

const computedClass = computed(() => props.expanded ? 'video-display_expanded' : null)

const computeOffset = () => {
  if (!isMobile.value || !displayRef.value) {
    return
  }
  displaySwipeOffset.value = 0
  displayTransformOffset.value = props.expanded
    ? -(displayRef.value.clientWidth / 2) : 0
}

const expandDisplay = () => emit('expand')
</script>

<style lang="scss" src="./VideoDisplay.scss">
</style>