<template>
  <div
    ref="sliderRef"
    class="video-slider"
  >
    <div
      v-for="(item, itemIndex) in items"
      :key="itemIndex"
      :data-scroll-index="itemIndex"
      :data-item-active="itemIndex === modelValue"
      class="video-slider__item"
    >
      <video-player
        title="UserNickname"
        :src="item"
        :muted="itemIndex !== modelValue"
        :paused="itemIndex !== modelValue"
        :rounded="!isMobile"
      />
    </div>
  </div>
</template>

<script lang="ts">
type VideoSliderModel = number

interface VideoSliderProps {
  items?: string[],
}
</script>

<script lang="ts" setup>
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useDevice } from '@/composables'

const { isMobile } = useDevice()

const props = withDefaults(defineProps<VideoSliderProps>(), {
  items: () => ([]),
})

const modelValue = defineModel<VideoSliderModel>({
  default: 0,
})

onMounted(() => {
  sliderRef.value.addEventListener('wheel', onScroll)
  sliderRef.value.addEventListener('touchstart', onTouchStart, { passive: true })
  sliderRef.value.addEventListener('touchmove', onTouchMove)
  sliderRef.value.addEventListener('touchend', onTouchEnd, { passive: true })
})

onBeforeUnmount(() => {
  sliderRef.value.removeEventListener('wheel', onScroll)
  sliderRef.value.removeEventListener('touchstart', onTouchStart)
  sliderRef.value.removeEventListener('touchmove', onTouchMove)
  sliderRef.value.removeEventListener('touchend', onTouchEnd)
})

// Slide to element
const sliderRef = ref()
watch(() => modelValue.value, (val, oldVal) => {
  if (val === oldVal) {
    return
  }

  const availableElements = sliderRef.value.querySelectorAll('[data-scroll-index]') as HTMLElement[]
  const targetElement = Array.from(availableElements).find(element => {
    const scrollIndex: string | null = element.getAttribute('data-scroll-index')
    if (!scrollIndex) {
      return false
    }
    return val === parseInt(scrollIndex)
  })

  if (!targetElement) {
    return
  }

  targetElement.scrollIntoView({
    behavior: 'smooth',
  })
})

const onScroll = (e: WheelEvent) => {
  e.preventDefault()
  return changeSlide(e.deltaY)
}


let touchStartY = 0
const onTouchStart = (e: TouchEvent) => touchStartY = e.touches[0].clientY
const onTouchMove = (e: TouchEvent) => e.preventDefault()
const onTouchEnd = (e: TouchEvent) => {
  const touchEndY = e.changedTouches[0].clientY
  const touchEndDeltaY = touchStartY - touchEndY

  if (Math.abs(touchEndDeltaY) <= 30) {
    return
  }
  return changeSlide(touchEndDeltaY)
}

const changeSlide = (deltaY: number) => {
  const direction = Math.sign(deltaY)
  const targetSlideIndex = Math.max(0, Math.min(modelValue.value + direction, props.items.length - 1))

  if (targetSlideIndex === modelValue.value) {
    return
  }
  modelValue.value = targetSlideIndex
}
</script>

<style lang="scss" src="./VideoSlider.scss">
</style>