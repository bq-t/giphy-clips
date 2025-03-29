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
        <video-player
          :title="item.title"
          :src="item.video.assets.source.url"
          :lazy-src="item.images.downsized.url"
          :autoplay="itemIndex === modelValue"
          :muted="itemIndex !== modelValue"
          :paused="itemIndex !== modelValue"
          :rounded="!isMobile"
          @click:explore="() => onExplore(item.url)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { Video } from '@/models/video'
import type { ScrollDirection, SwipeDirection, HoldDelta } from '@/composables'

type VideoSliderModel = number

interface VideoSliderProps {
  items?: Video[],
}
</script>

<script lang="ts" setup>
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDevice, useTouch, useScroll, useThrottle } from '@/composables'
import { useVideoSliderStore } from '@/stores'

const props = withDefaults(defineProps<VideoSliderProps>(), {
  items: () => ([]),
})

const modelValue = defineModel<VideoSliderModel>({
  default: 0,
})

watch(() => modelValue.value, (val, oldVal) => {
  if (val === oldVal) {
    return
  }
  computeOffset()
})

const sliderSwipeOffset = ref(0)
const computedStyle = computed(() => {
  const generalOffset = sliderTransformOffset.value + sliderSwipeOffset.value
  return {
    transform: `translateY(${generalOffset}px)`,
  }
})

const loaderTransformRotation = ref(0)
const computedLoaderStyle = computed(() => ({
  transform: `rotate(${loaderTransformRotation.value}deg)`,
}))

const loaderRef = ref<HTMLElement>()
onMounted(() => {
  computeOffset()
  window.addEventListener('resize', computeOffset)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', computeOffset)
})

const { isMobile } = useDevice()

const sliderRef = ref<HTMLElement>()
const { onSwipe, onHold } = useTouch(sliderRef)
const { onScroll } = useScroll(sliderRef)

const swipeHandler = (direction: SwipeDirection | ScrollDirection, reverse = false) => {
  if (!['up', 'down'].includes(direction)) {
    return
  }
  const swipeDirection = reverse ? 'down' : 'up'
  changeSlide(direction === swipeDirection)
}

onSwipe((direction: SwipeDirection) => {
  sliderSwipeOffset.value = 0
  loaderTransformRotation.value = 0
  swipeHandler(direction, true)
})

onHold((delta: HoldDelta) => {
  if (modelValue.value === 0 && delta.y > 0) {
    loaderTransformRotation.value = delta.y * -1
  }

  if (Math.abs(delta.y) >= 300) {
    return
  }
  sliderSwipeOffset.value = delta.y
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
const { offset: sliderTransformOffset } = storeToRefs(videoSliderStore)
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

const onExplore = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style lang="scss" src="./VideoSlider.scss">
</style>