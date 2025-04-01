import type { Video } from '@/models/video'
import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useMockApi } from '@/composables'

export const useClipsStore = defineStore('clipsStore', () => {
  const currentRecommendation = ref(0)
  const recommendations = ref<Video[]>([])
  const favorites = ref<Video['id'][]>(JSON.parse(localStorage.getItem('favoriteClips') || '[]'))

  const setRecommendation = (index: number) => {
    currentRecommendation.value = index
  }

  const getRecommendations = (offset: number = 0, limit: number = 3) => {
    return useMockApi('/clips', { offset, limit })
      .then(data => {
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format')
        }
        recommendations.value.push(...data)
      })
  }

  const flushRecommendations = () => {
    recommendations.value = []
    currentRecommendation.value = 0
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
    const updatedValue = favorites.value.includes(id)
      ? favorites.value.filter((cId: Video['id']) => cId !== id)
      : [...favorites.value, id]

    localStorage.setItem('favoriteClips', JSON.stringify(updatedValue))
    favorites.value = updatedValue
  }

  return {
    currentRecommendation,
    recommendations,
    favorites,
    setRecommendation,
    getRecommendations,
    flushRecommendations,
    getClips,
    getClip,
    getFavorites,
    switchFavorite,
  }
})