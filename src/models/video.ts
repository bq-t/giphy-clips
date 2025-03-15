export interface Video {
  id: string,
  url: string,
  slug: string,
  embed_url: string,
  username: string,
  source: string,
  title: string,
  tags: string[],
  import_datetime: string,
  trending_datetime: string,
  create_datetime: string,
  update_datetime: string,
  images: ImagesData,
  video: VideoData,
}

export interface ImagesData {
  downsized: ImagesDataAsset,
}

export interface ImagesDataAsset {
  height: string,
  width: string,
  size: string,
  url: string,
}

export interface VideoData {
  assets: {
    source: VideoDataAsset,
  },
}

export interface VideoDataAsset {
  height: string,
  width: string,
  url: string,
}