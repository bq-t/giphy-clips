<template>
  <div
    ref="sliderRef"
    class="video-slider"
  >
    <div
      class="video-slider__wrapper"
      :style="computedStyle"
    >
      <div
        ref="loaderRef"
        class="video-slider__loader"
      >
        <gc-icon
          class="video-slider__loader-icon"
          name="sync"
          color="primary"
          size="lg"
          :class="computedLoaderClass"
          :style="computedLoaderStyle"
        />
      </div>
      <div
        v-for="(item, itemIndex) in items"
        :key="itemIndex"
        :data-scroll-index="itemIndex"
        :data-item-active="itemIndex === modelValue"
        class="video-slider__item"
      >
        <video-display
          :id="item.id"
          :title="item.title"
          :username="item.username"
          :comments="item.comments"
          :url="item.url"
          :src="item.video.assets.source.url"
          :lazy-src="item.images.downsized.url"
          :tags="item.tags"
          :expanded="sliderExpanded"
          :preview="itemIndex !== modelValue"
          @expand="expandDisplay"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Video } from '@/models/video'
import type { ScrollDirection, SwipeDirection, MoveDelta } from '@/composables'

type VideoSliderModel = number
type VideoSliderLoadingModel = boolean

interface VideoSliderProps {
  modelValue?: VideoSliderModel,
  loading?: VideoSliderLoadingModel,
  items?: Video[],
}
</script>

<script lang="ts" setup>
import VideoDisplay from '@/components/VideoDisplay/VideoDisplay.vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTouch, useScroll, useThrottle, useDevice } from '@/composables'
import { useVideoSliderStore } from '@/stores'

const props = withDefaults(defineProps<VideoSliderProps>(), {
  items: () => ([]),
})

const modelValue = defineModel<VideoSliderModel>({
  default: 0,
})

const loading = defineModel<VideoSliderLoadingModel>('loading', {
  default: false,
})

watch(() => modelValue.value, (val, oldVal) => {
  if (val === oldVal) {
    return
  }
  computeOffset()
})

const { isMobile } = useDevice()

const sliderSwipeOffset = ref(0)
const computedStyle = computed(() => {
  let generalOffset = sliderTransformOffset.value + sliderSwipeOffset.value
  if (loading.value && loaderRef?.value) {
    generalOffset += loaderRef.value.clientHeight
  }

  return {
    transform: `translateY(${generalOffset}px)`,
  }
})

const loaderTransformRotation = ref(0)
const computedLoaderStyle = computed(() => ({
  transform: `rotate(${loaderTransformRotation.value}deg)`,
}))

const computedLoaderClass = computed(() => loading.value
  ? 'video-slider__loader-icon_active'
  : null
)

const loaderRef = ref<HTMLElement>()
onMounted(() => {
  computeOffset()
  window.addEventListener('resize', computeOffset)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', computeOffset)
})

const sliderRef = ref<HTMLElement>()
const { onSwipe, onMove, onDrop } = useTouch(sliderRef, {
  move: {
    limit: 300,
  },
})
const { onScroll } = useScroll(sliderRef)

const swipeHandler = (direction: SwipeDirection | ScrollDirection, reverse = false) => {
  if (!['up', 'down'].includes(direction) || sliderExpanded.value && isMobile.value) {
    return
  }
  const swipeDirection = reverse ? 'down' : 'up'
  changeSlide(direction === swipeDirection)
}

onSwipe((direction: SwipeDirection) => {
  sliderSwipeOffset.value = 0
  loaderTransformRotation.value = 0
  if (modelValue.value === 0 && direction === 'down') {
    loading.value = true
    return
  }
  swipeHandler(direction, true)
})

onMove((delta: MoveDelta) => {
  if (sliderExpanded.value && isMobile.value) {
    return
  }

  if (modelValue.value === 0 && delta.y > 0) {
    loaderTransformRotation.value = delta.y * -1
  }
  sliderSwipeOffset.value = delta.y
})

onDrop(() => {
  sliderSwipeOffset.value = 0
})

const throttleSwipe = useThrottle(swipeHandler, 250)
onScroll((direction: ScrollDirection) => throttleSwipe(direction))

const changeSlide = (toTop: boolean = false) => {
  const slideDirection = toTop ? -1 : 1
  const targetSlideIndex = Math.max(0, Math.min(modelValue.value + slideDirection, props.items.length - 1))
  if (targetSlideIndex === modelValue.value) {
    return
  }
  modelValue.value = targetSlideIndex
}

const videoSliderStore = useVideoSliderStore()
const { offset: sliderTransformOffset, expanded: sliderExpanded } = storeToRefs(videoSliderStore)
const computeOffset = () => {
  if (!sliderRef?.value) {
    return
  }

  let resultOffset = 0
  if (loaderRef?.value) {
    resultOffset -= loaderRef.value.clientHeight
  }

  const slideItem: Element | null = sliderRef.value.querySelector('.video-slider__item')
  if (slideItem) {
    resultOffset -= modelValue.value * slideItem.clientHeight
  }
  videoSliderStore.setOffset(resultOffset)
}

const expandDisplay = () => {
  videoSliderStore.switchExpanded()
}
</script>

<style lang="scss" src="./VideoSlider.scss">
</style>