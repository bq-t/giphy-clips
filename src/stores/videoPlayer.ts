import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useVideoPlayerStore = defineStore('videoPlayer', () => {
  const volume = ref(parseInt(localStorage.getItem('videoPlayerVolume') || '15'))

  function setVolume(value: number) {
    localStorage.setItem('videoPlayerVolume', value.toString())
    volume.value = value
  }

  return {
    volume,
    setVolume,
  }
})