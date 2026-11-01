<script setup>
import { ref, computed, onMounted } from 'vue'
import { getChannel, getUploads } from '../youtube'

const channel = ref(null)
const videos = ref([])
const nextPageToken = ref(null)
const loading = ref(false)
const error = ref('')
const selected = ref(null)

const filter = ref('')
const sortBy = ref('newest')
const sorters = {
  newest: (a, b) => b.publishedAt.localeCompare(a.publishedAt),
  views: (a, b) => b.views - a.views,
  likes: (a, b) => b.likes - a.likes,
  comments: (a, b) => b.comments - a.comments,
  longest: (a, b) => b.seconds - a.seconds,
}

const shown = computed(() => {
  const q = filter.value.trim().toLowerCase()
  const list = q ? videos.value.filter((v) => v.title.toLowerCase().includes(q)) : [...videos.value]
  return list.sort(sorters[sortBy.value])
})

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const fmt = (n) => compact.format(n)
const date = (iso) => new Date(iso).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })
function duration(s) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}

async function loadMore() {
  loading.value = true
  error.value = ''
  try {
    const page = await getUploads(channel.value.uploadsPlaylist, nextPageToken.value)
    videos.value.push(...page.videos)
    nextPageToken.value = page.nextPageToken
    selected.value ??= videos.value[0] ?? null
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function play(video) {
  selected.value = video
  window.scrollTo({ top: document.getElementById('player').offsetTop - 80, behavior: 'smooth' })
}

onMounted(async () => {
  loading.value = true
  try {
    channel.value = await getChannel()
    await loadMore()
  } catch (e) {
    error.value = e.message
    loading.value = false
  }
})
</script>

<template>
  <section class="container page-head">
    <span class="tag">Live API</span>
    <h1>The Channel</h1>
    <p class="muted">
      Live numbers from the
      <a href="https://developers.google.com/youtube/v3" target="_blank" rel="noopener">YouTube Data API</a>.
    </p>
  </section>

  <section class="container section">
    <p v-if="error" class="error card">{{ error }}</p>

    <div v-if="channel" class="card channel">
      <img :src="channel.avatar" :alt="channel.title" width="88" height="88" />
      <div>
        <h2>
          <a :href="`https://www.youtube.com/${channel.handle}`" target="_blank" rel="noopener">{{ channel.title }}</a>
          <span class="muted handle">{{ channel.handle }}</span>
        </h2>
        <dl class="stats">
          <div><dt>Subscribers</dt><dd>{{ fmt(channel.subscribers) }}</dd></div>
          <div><dt>Total views</dt><dd>{{ fmt(channel.views) }}</dd></div>
          <div><dt>Videos</dt><dd>{{ channel.videoCount.toLocaleString() }}</dd></div>
        </dl>
      </div>
    </div>

    <div v-if="selected" id="player" class="player">
      <div class="frame">
        <iframe
          :src="`https://www.youtube-nocookie.com/embed/${selected.id}`"
          :title="selected.title"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        />
      </div>
      <h3>{{ selected.title }}</h3>
      <p class="small">
        {{ date(selected.publishedAt) }} · {{ fmt(selected.views) }} views · {{ fmt(selected.likes) }} likes ·
        {{ fmt(selected.comments) }} comments
      </p>
    </div>

    <template v-if="videos.length">
      <div class="toolbar">
        <input v-model="filter" type="search" placeholder="Filter loaded videos by title…" aria-label="Filter videos" />
        <label>
          Sort
          <select v-model="sortBy">
            <option value="newest">Newest</option>
            <option value="views">Most viewed</option>
            <option value="likes">Most liked</option>
            <option value="comments">Most comments</option>
            <option value="longest">Longest</option>
          </select>
        </label>
      </div>
      <p class="small">
        Showing {{ shown.length }} of {{ videos.length }} loaded videos<span v-if="channel"> ({{ channel.videoCount.toLocaleString() }} on the channel)</span>.
        Sorting and filtering apply to loaded videos only.
      </p>

      <ul class="videos">
        <li v-for="v in shown" :key="v.id">
          <button class="video" :class="{ active: selected?.id === v.id }" @click="play(v)">
            <span class="thumb">
              <img :src="v.thumbnail" :alt="''" loading="lazy" width="320" height="180" />
              <span class="length">{{ duration(v.seconds) }}</span>
            </span>
            <span class="title">{{ v.title }}</span>
            <span class="small">{{ fmt(v.views) }} views · {{ date(v.publishedAt) }}</span>
          </button>
        </li>
      </ul>
    </template>

    <div class="more">
      <button v-if="nextPageToken || loading" class="btn" :disabled="loading" @click="loadMore">
        {{ loading ? 'Loading…' : 'Load 50 more' }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.error { color: #b3261e; }
.channel { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin-bottom: 32px; }
.channel img { border-radius: 50%; }
.channel h2 { margin: 0 0 8px; }
.channel h2 a { color: var(--text); text-decoration: none; }
.handle { font-size: 1rem; font-weight: 400; margin-left: 8px; }
.stats { display: flex; gap: 32px; flex-wrap: wrap; margin: 0; }
.stats dt { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.stats dd { margin: 0; font-size: 1.6rem; font-weight: 800; }
.player { margin-bottom: 32px; }
.frame { position: relative; aspect-ratio: 16 / 9; border-radius: var(--radius); overflow: hidden; background: #000; }
.frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.player h3 { margin: 12px 0 4px; }
.player p { margin: 0; }
.toolbar { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.toolbar input { flex: 1; min-width: 200px; padding: 10px 16px; border-radius: 999px; border: 2px solid var(--border); background: var(--surface); color: var(--text); font-size: 1rem; }
.toolbar input:focus, .toolbar select:focus { outline: none; border-color: var(--brand); }
.toolbar label { display: flex; gap: 8px; align-items: center; font-weight: 600; }
.toolbar select { padding: 10px 12px; border-radius: 10px; border: 2px solid var(--border); background: var(--surface); color: var(--text); font-size: 1rem; }
.videos { list-style: none; padding: 0; display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
.video { display: flex; flex-direction: column; gap: 6px; width: 100%; padding: 0; border: none; background: none; color: var(--text); text-align: left; font: inherit; cursor: pointer; }
.thumb { position: relative; display: block; border-radius: 10px; overflow: hidden; border: 3px solid transparent; }
.video.active .thumb { border-color: var(--brand); }
.thumb img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; }
.length { position: absolute; right: 6px; bottom: 6px; background: rgba(0, 0, 0, 0.8); color: #fff; font-size: 0.75rem; font-weight: 700; padding: 1px 6px; border-radius: 4px; }
.title { font-weight: 600; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.video:hover .title { color: var(--brand); }
.more { text-align: center; margin-top: 24px; }
</style>
