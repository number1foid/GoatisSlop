<script setup>
import { computed, onMounted, toRefs } from 'vue'
import { channelState, ensureChannelLoaded, loadMore } from '../channelStore'
import { nl, t } from '../i18n'
import MediaVideo from '../components/MediaVideo.vue'

// State is shared through channelStore, so revisiting this page reuses what's already loaded.
const { channel, videos, nextPageToken, loading, error, selected, filter, sortBy } = toRefs(channelState)

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

const locale = computed(() => (nl.value ? 'nl-NL' : 'en'))
const compact = computed(() => new Intl.NumberFormat(locale.value, { notation: 'compact', maximumFractionDigits: 1 }))
const fmt = (n) => compact.value.format(n)
const count = (n) => n.toLocaleString(locale.value)
const date = (iso) => new Date(iso).toLocaleDateString(locale.value, { day: 'numeric', month: 'short', year: 'numeric' })
function duration(s) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = String(s % 60).padStart(2, '0')
  return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`
}

function play(video) {
  selected.value = video
  const top = document.getElementById('player').getBoundingClientRect().top + window.scrollY - 80
  window.scrollTo({ top, behavior: 'smooth' })
}

onMounted(ensureChannelLoaded)
</script>

<template>
  <article class="page">
    <h1 class="wide">{{ t('The Channel', 'Het Kanaal') }}</h1>

    <div v-if="error" class="wide"><p class="error card">{{ error }}</p></div>

    <div v-if="channel" class="wide">
      <div class="card channel">
        <img :src="channel.avatar" :alt="channel.title" width="88" height="88" />
        <div>
          <h2>
            <a :href="`https://www.youtube.com/${channel.handle}`" target="_blank" rel="noopener">{{ channel.title }}</a>
            <span class="muted handle">{{ channel.handle }}</span>
          </h2>
          <dl class="stats">
            <div><dt>{{ t('Subscribers', 'Abonnees') }}</dt><dd>{{ fmt(channel.subscribers) }}</dd></div>
            <div><dt>{{ t('Total views', 'Totaal weergaven') }}</dt><dd>{{ fmt(channel.views) }}</dd></div>
            <div><dt>{{ t('Videos', "Video's") }}</dt><dd>{{ count(channel.videoCount) }}</dd></div>
          </dl>
        </div>
      </div>
    </div>

    <div v-if="selected" id="player" class="wide player-meta">
      <h2>{{ selected.title }}</h2>
      <p class="small">
        {{ date(selected.publishedAt) }} · {{ fmt(selected.views) }} {{ t('views', 'weergaven') }} · {{ fmt(selected.likes) }} likes ·
        {{ fmt(selected.comments) }} {{ t('comments', 'reacties') }}
      </p>
    </div>
    <MediaVideo v-if="selected" :youtube="selected.id" :title="selected.title" class="player" />

    <div v-if="videos.length" class="wide toolbar">
      <input v-model="filter" type="search" :placeholder="t('Filter loaded videos by title…', `Filter geladen video's op titel…`)" :aria-label="t('Filter videos', `Video's filteren`)" />
      <label>
        {{ t('Sort', 'Sorteren') }}
        <select v-model="sortBy">
          <option value="newest">{{ t('Newest', 'Nieuwste') }}</option>
          <option value="views">{{ t('Most viewed', 'Meest bekeken') }}</option>
          <option value="likes">{{ t('Most liked', 'Meeste likes') }}</option>
          <option value="comments">{{ t('Most comments', 'Meeste reacties') }}</option>
          <option value="longest">{{ t('Longest', 'Langste') }}</option>
        </select>
      </label>
    </div>
    <p v-if="videos.length" class="wide small count">
      <template v-if="nl">
        {{ shown.length }} van {{ videos.length }} geladen video's getoond<span v-if="channel"> ({{ count(channel.videoCount) }} op het kanaal)</span>.
        Sorteren en filteren werkt alleen op geladen video's.
      </template>
      <template v-else>
        Showing {{ shown.length }} of {{ videos.length }} loaded videos<span v-if="channel"> ({{ count(channel.videoCount) }} on the channel)</span>.
        Sorting and filtering apply to loaded videos only.
      </template>
    </p>

    <ul v-if="videos.length" class="wide videos">
      <li v-for="v in shown" :key="v.id">
        <button class="video" :class="{ active: selected?.id === v.id }" @click="play(v)">
          <span class="thumb">
            <img :src="v.thumbnail" :alt="''" loading="lazy" width="320" height="180" />
            <span class="length">{{ duration(v.seconds) }}</span>
          </span>
          <span class="title">{{ v.title }}</span>
          <span class="small">{{ fmt(v.views) }} {{ t('views', 'weergaven') }} · {{ date(v.publishedAt) }}</span>
        </button>
      </li>
    </ul>

    <div class="wide more">
      <button v-if="nextPageToken || loading" class="btn" :disabled="loading" @click="loadMore">
        {{ loading ? t('Loading…', 'Laden…') : t('Load 50 more', '50 meer laden') }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.channel { display: flex; gap: 20px; align-items: center; flex-wrap: wrap; margin-bottom: 40px; }
.channel img { border-radius: 50%; }
.channel h2 { margin: 0 0 8px; font-size: 1.5rem; }
.channel h2 a { color: var(--text); text-decoration: none; }
.handle { font-size: 1rem; font-weight: 400; margin-left: 8px; }
.stats { display: flex; gap: 32px; flex-wrap: wrap; margin: 0; }
.stats dt { font-size: 0.8rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.stats dd { margin: 0; font-size: 1.6rem; font-weight: 800; }
.player-meta h2 { margin: 0 0 4px; font-size: 1.35rem; }
.player-meta p { margin: 0; }
.player { margin-top: 16px; }
.toolbar { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.toolbar input { flex: 1; min-width: 200px; padding: 10px 16px; border-radius: 999px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 1rem; }
.toolbar input::placeholder { color: var(--muted); }
.toolbar input:focus, .toolbar select:focus { outline: none; border-color: var(--accent); }
.toolbar label { display: flex; gap: 8px; align-items: center; font-weight: 600; }
.toolbar select { padding: 10px 12px; border-radius: 10px; border: 1px solid var(--border); background: var(--btn); color: var(--text); font-size: 1rem; }
.count { margin-top: 12px; }
.videos { list-style: none; display: grid; gap: 20px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); margin-top: 16px; margin-bottom: 0; }
.video { display: flex; flex-direction: column; gap: 6px; width: 100%; padding: 0; border: none; background: none; color: var(--text); text-align: left; font: inherit; cursor: pointer; }
.thumb { position: relative; display: block; border-radius: 10px; overflow: hidden; border: 3px solid transparent; transition: border-color 0.2s ease; }
.video:hover .thumb { border-color: var(--btn-hover); }
.video.active .thumb { border-color: var(--accent); }
.thumb img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; }
.length { position: absolute; right: 6px; bottom: 6px; background: rgba(0, 0, 0, 0.8); color: var(--text); font-size: 0.75rem; font-weight: 700; padding: 1px 6px; border-radius: 4px; }
.title { font-weight: 600; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.more { text-align: center; margin-top: 32px; }
</style>
