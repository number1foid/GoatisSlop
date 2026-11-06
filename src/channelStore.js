import { reactive, watch } from 'vue'
import { getChannel, getUploads } from './youtube'

// Channel data lives here instead of in the page, so it survives leaving and reopening the YouTube API page.
// It's also mirrored to sessionStorage (this tab only, cleared when the tab closes; no cookies), so a reload
// doesn't refetch either. After MAX_AGE_MS the cached copy is dropped and fresh numbers are fetched.
const STORAGE_KEY = 'goatis:channel'
const MAX_AGE_MS = 30 * 60 * 1000

export const channelState = reactive({
  channel: null,
  videos: [],
  nextPageToken: null,
  selected: null,
  filter: '',
  sortBy: 'newest',
  loading: false,
  error: '',
  savedAt: 0,
})

try {
  const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? 'null')
  if (saved && Date.now() - saved.savedAt < MAX_AGE_MS) Object.assign(channelState, saved)
} catch {
  // Storage unavailable or corrupt: start empty and fetch.
}

watch(
  () => [channelState.channel, channelState.videos.length, channelState.selected, channelState.filter, channelState.sortBy],
  () => {
    if (!channelState.channel) return
    const { channel, videos, nextPageToken, selected, filter, sortBy, savedAt } = channelState
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ channel, videos, nextPageToken, selected, filter, sortBy, savedAt }))
    } catch {
      // Kept in memory for this page load only.
    }
  },
)

export async function loadMore() {
  if (channelState.loading) return
  channelState.loading = true
  channelState.error = ''
  try {
    const page = await getUploads(channelState.channel.uploadsPlaylist, channelState.nextPageToken)
    channelState.videos.push(...page.videos)
    channelState.nextPageToken = page.nextPageToken
    channelState.selected ??= channelState.videos[0] ?? null
  } catch (e) {
    channelState.error = e.message
  } finally {
    channelState.loading = false
  }
}

// Fetches the channel and first page of uploads, unless a fresh enough copy is already loaded.
export async function ensureChannelLoaded() {
  const fresh = Date.now() - channelState.savedAt < MAX_AGE_MS
  if (fresh && channelState.channel && channelState.videos.length) return
  if (channelState.loading) return

  channelState.loading = true
  channelState.error = ''
  try {
    const channel = await getChannel()
    Object.assign(channelState, { channel, videos: [], nextPageToken: null, selected: null, savedAt: Date.now() })
  } catch (e) {
    channelState.error = e.message
    return
  } finally {
    channelState.loading = false
  }
  await loadMore()
}
