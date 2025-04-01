import type { Video } from '@/models/video'
import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useMockApi } from '@/composables'

export const useClipsStore = defineStore('clipsStore', () => {
  const currentRecommendation = ref(0)
  const recommendations = reactive<Video[]>([])
  const favorites = ref<Video['id'][]>([])

  const setRecommendation = (index: number) => {
    currentRecommendation.value = index
  }

  const getRecommendations = (offset: number = 0, limit: number = 3) => {
    return useMockApi('/clips', { offset, limit })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format')
        }
        recommendations.push(...data)
      })
  }

  const getClips = (offset: number = 0, limit: number = 18) => {
    return useMockApi('/clips', { offset, limit })
  }

  const getClip = (slug: string) => {
    return useMockApi('/clip', { slug })
  }

  const getFavorites = (offset: number = 0, limit: number = 18) => {
    return useMockApi('/favorites', { offset, limit })
  }

  const switchFavorite = (id: Video['id']) => {
    if (favorites.value.includes(id)) {
      favorites.value = favorites.value.filter((cId: Video['id']) => cId !== id)
      return
    }
    favorites.value.push(id)
  }

  return {
    currentRecommendation,
    recommendations,
    favorites,
    setRecommendation,
    getRecommendations,
    getClips,
    getClip,
    getFavorites,
    switchFavorite,
  }
})