import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVideoSliderStore = defineStore('videoSlider', () => {
  const offset = ref(0)

  const setOffset = (value: number) => {
    offset.value = value
  }

  return {
    offset,
    setOffset,
  }
})