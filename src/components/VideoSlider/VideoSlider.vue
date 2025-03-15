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
        v-for="(item, itemIndex) in items"
        :key="itemIndex"
        :data-scroll-index="itemIndex"
        :data-item-active="itemIndex === modelValue"
        class="video-slider__item"
      >
        <video-player
          :title="item.title"
          :src="item.video.assets.source.url"
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

type VideoSliderModel = number

interface VideoSliderProps {
  items?: Video[],
}
</script>

<script lang="ts" setup>
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue'
import { computed, ref, watch } from 'vue'
import { useDevice, useTouch, useScroll, type ScrollDirection, type SwipeDirection } from '@/composables'

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
  onChangeSlide(val, val < oldVal)
})

const sliderTransformOffset = ref(0)
const computedStyle = computed(() => ({
  transform: `translateY(${sliderTransformOffset.value}px)`,
}))

const { isMobile } = useDevice()

const sliderRef = ref<HTMLElement>()
const { onSwipe } = useTouch(sliderRef)
const { onScroll } = useScroll(sliderRef)

const swipeHandler = (direction: SwipeDirection | ScrollDirection, reverse = false) => {
  if (!['up', 'down'].includes(direction)) {
    return
  }
  const swipeDirection = reverse ? 'down' : 'up'
  changeSlide(direction === swipeDirection)
}

onSwipe((direction: SwipeDirection) => swipeHandler(direction, true))
onScroll((direction: ScrollDirection) => swipeHandler(direction))

const changeSlide = (toTop: boolean = false) => {
  const slideDirection = toTop ? -1 : 1
  const targetSlideIndex = Math.max(0, Math.min(modelValue.value + slideDirection, props.items.length - 1))
  if (targetSlideIndex === modelValue.value) {
    return
  }

  modelValue.value = targetSlideIndex
}

const onChangeSlide = (slideIndex: number, toTop = false) => {
  if (!sliderRef.value) {
    return
  }
  const availableSlides: NodeListOf<Element> = sliderRef.value.querySelectorAll('[data-scroll-index]')
  const targetSlideElement = Array.from(availableSlides).find((element: Element) => {
    const scrollIndex: string | null = element.getAttribute('data-scroll-index')
    if (!scrollIndex) {
      return false
    }
    return slideIndex === parseInt(scrollIndex)
  })

  if (!targetSlideElement) {
    return
  }

  let transformModifier = targetSlideElement.clientHeight
  if (!toTop) {
    transformModifier *= -1
  }
  sliderTransformOffset.value += transformModifier
}

const onExplore = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style lang="scss" src="./VideoSlider.scss">
</style>