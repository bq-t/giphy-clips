import mockApiData from '@/data/mockApiData.json'
import mockComments from '@/data/mockComments.json'
import type { Video, CommentData } from '@/models/video'

type MockApiResponse<T> = Promise<T>
type MockShuffleOptions = { min?: number, max?: number }

/**
 * Simulate request, bcs Giphy has no public access for clips endpoints :(
 */
export const useMockApi = <T extends Video | Video[]>(
  url: string,
  body: Record<string, any>,
): MockApiResponse<T> => {
  const shuffleMock = <T>(data: T[], options: MockShuffleOptions = {}): T[] => {
    const shuffled = [...data]

    const min = Math.max(options?.min || 1, 1)
    const max = Math.min(options?.max || 10, shuffled.length)

    const resultMin = Math.min(min, max)
    const resultMax = Math.max(min, max)

    const count = Math.floor(Math.random() * (resultMax - resultMin + 1)) + resultMin

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j: number = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }

  const clipsCallback = (): Video[] => {
    const count = Number(body.offset) + Number(body.limit)
    return shuffleMock<Video>(mockApiData as Video[], {
      min: count,
      max: count,
    })
  }

  const clipCallback = (): Video => {
    const clip = (mockApiData as Video[])
      .find(clip => clip.slug === body.slug)

    if (!clip) {
      throw new Error(`Clip with slug ${body.slug} not found`)
    }

    return {
      ...clip,
      comments: shuffleMock<CommentData>(mockComments as CommentData[])
    }
  }

  /**
   * Mock endpoints
   */
  const ENDPOINTS = {
    '/clips': clipsCallback,
    '/clip': clipCallback,
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const handler = ENDPOINTS[url as keyof typeof ENDPOINTS]
      if (!handler) {
        return reject(new Error(`Endpoint ${url} not implemented`))
      }

      try {
        resolve(handler() as T)
      } catch (error) {
        reject(error)
      }
    }, 600)
  })
}