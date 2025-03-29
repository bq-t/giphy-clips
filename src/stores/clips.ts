import type { Video } from '@/models/video'
import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useMockApi } from '@/composables'

export const useClipsStore = defineStore('clipsStore', () => {
  const currentRecommendation = ref(0)
  const recommendations: Video[] = reactive([])

  const setRecommendation = (index: number) => {
    currentRecommendation.value = index
  }

  const getRecommendations = (offset: number = 0, limit: number = 3) => {
    return useMockApi('/clips', { offset, limit })
      .then(data => recommendations.push(...data))
  }

  const getClips = (offset: number = 0, limit: number = 18) => {
    return useMockApi('/clips', { offset, limit })
  }

  return {
    currentRecommendation,
    recommendations,
    setRecommendation,
    getRecommendations,
    getClips,
  }
})