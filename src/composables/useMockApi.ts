import mockApiData from '@/data/mockApiData.json'
import type { Video } from '@/models/video'

interface ApiBody {
  offset: number,
  limit: number,
}

/**
 * Simulate request, bcs Giphy has no public access for clips endpoints :(
 */
export const useMockApi = (url: string, body: ApiBody) => {
  return new Promise<Video[]>(resolve => {
    setTimeout(() => {
      const response = mockApiData.slice(body.offset, body.offset + body.limit)
      return resolve(response)
    }, 600)
  })
}