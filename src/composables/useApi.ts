import type { Video } from '@/models/video'

const RESPONSE_DATA: Video[] = [
  {
    url: 'https://giphy.com/clips/theoffice-AFhlgdxqzAtFMIgpBA',
    title: 'Goodbye My Lover, Goodbye My Friend',
    video: {
      assets: {
        'source': {
          height: 1080,
          width: 1080,
          url: 'https://media2.giphy.com/media/AFhlgdxqzAtFMIgpBA/source.mp4?cid=82a1493bmn92f8sszao7knzp7glc3ek329kvtan132f1dkzg&ep=v1_videos_trending&rid=source.mp4&ct=v&cc=en',
        },
      },
      description: 'Clips from The Office',
    },
  },
  {
    url: 'https://giphy.com/clips/justin-MEdRTaYvZBlVMEjwZ3',
    title: 'doge',
    video: {
      assets: {
        'source': {
          height: 480,
          width: 512,
          url: 'https://media0.giphy.com/media/MEdRTaYvZBlVMEjwZ3/source.mov?cid=82a1493byepg386emqysuhvf75uiogw2eklhq0xxc6omjhym&ep=v1_videos_trending&rid=source.mov&ct=v',
        },
      },
      description: 'doge',
    },
  },
]

interface ApiBody {
  offset: number,
  limit: number,
}

/**
 * Simulate request, bcs Giphy has no public access for clips endpoints :(
 */
export const useApi = (url: string, body: ApiBody) => {
  return new Promise<Video[]>(resolve => {
    setTimeout(() => {
      const response = RESPONSE_DATA.slice(body.offset, body.offset + body.limit)
      return resolve(response)
    }, 600)
  })
}