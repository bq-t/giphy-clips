import type { Video } from '@/models/video'
import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from '@/composables/useApi'

export const useClipsStore = defineStore('clipsStore', () => {
  const recommendations: Video[] = reactive([])

  function getRecommendations(offset: number = 0, limit: number = 3) {
    return useApi('/clips', { offset, limit })
      .then(data => recommendations.push(...data))
  }

  return {
    recommendations,
    getRecommendations,
  }
})