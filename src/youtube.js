// YouTube Data API v3 (https://developers.google.com/youtube/v3).
// The key is read from .env.local (VITE_YOUTUBE_API_KEY) and ends up in the built site, so it must be
// restricted to the YouTube Data API and to this site's domains in the Google Cloud console.
// Quota: 10,000 units/day. channels, playlistItems and videos cost 1 unit each; search costs 100, so we avoid it.

const BASE = 'https://www.googleapis.com/youtube/v3'
const KEY = import.meta.env.VITE_YOUTUBE_API_KEY
export const CHANNEL_HANDLE = 'GoatisReviews'

async function call(endpoint, params) {
  if (!KEY) throw new Error('No YouTube API key configured (VITE_YOUTUBE_API_KEY in .env.local).')
  const res = await fetch(`${BASE}/${endpoint}?${new URLSearchParams({ ...params, key: KEY })}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message ?? `YouTube API error (${res.status})`)
  return data
}

export async function getChannel(handle = CHANNEL_HANDLE) {
  const data = await call('channels', { part: 'snippet,statistics,contentDetails', forHandle: handle })
  const c = data.items?.[0]
  if (!c) throw new Error(`Channel @${handle} not found.`)
  return {
    id: c.id,
    title: c.snippet.title,
    handle: c.snippet.customUrl,
    description: c.snippet.description,
    avatar: c.snippet.thumbnails.medium?.url ?? c.snippet.thumbnails.default?.url,
    subscribers: Number(c.statistics.subscriberCount),
    views: Number(c.statistics.viewCount),
    videoCount: Number(c.statistics.videoCount),
    uploadsPlaylist: c.contentDetails.relatedPlaylists.uploads,
  }
}

// "PT1H2M3S" -> seconds
function parseDuration(iso) {
  const m = iso?.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return 0
  const [, d = 0, h = 0, min = 0, s = 0] = m.map((x) => Number(x ?? 0))
  return d * 86400 + h * 3600 + min * 60 + s
}

// One page (up to 50) of uploads, newest first, with view/like counts and durations.
export async function getUploads(playlistId, pageToken) {
  const page = await call('playlistItems', {
    part: 'contentDetails',
    playlistId,
    maxResults: '50',
    ...(pageToken && { pageToken }),
  })
  const ids = page.items.map((i) => i.contentDetails.videoId)
  if (!ids.length) return { videos: [], nextPageToken: null }

  const details = await call('videos', { part: 'snippet,statistics,contentDetails', id: ids.join(',') })
  const videos = details.items.map((v) => ({
    id: v.id,
    title: v.snippet.title,
    publishedAt: v.snippet.publishedAt,
    thumbnail: v.snippet.thumbnails.medium?.url ?? v.snippet.thumbnails.default?.url,
    seconds: parseDuration(v.contentDetails.duration),
    views: Number(v.statistics.viewCount ?? 0),
    likes: Number(v.statistics.likeCount ?? 0),
    comments: Number(v.statistics.commentCount ?? 0),
  }))
  return { videos, nextPageToken: page.nextPageToken ?? null }
}
