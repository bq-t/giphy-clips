import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVideoSliderStore = defineStore('videoSlider', () => {
  const offset = ref(0)
  const expanded = ref(false)

  const setOffset = (value: number) => {
    offset.value = value
  }

  const switchExpanded = () => {
    expanded.value = !expanded.value
  }

  return {
    offset,
    expanded,
    setOffset,
    switchExpanded,
  }
})