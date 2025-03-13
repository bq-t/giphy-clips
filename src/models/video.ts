export interface Video {
  url: string,
  title: string,
  video: VideoData,
}

export interface VideoData {
  assets: {
    source: VideoDataAsset,
  },
  description: string,
}

export interface VideoDataAsset {
  height: number,
  width: number,
  url: string,
}