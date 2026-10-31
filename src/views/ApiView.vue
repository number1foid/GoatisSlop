<script setup>
import { ref, onMounted } from 'vue'

// Our own Cloud Function (functions/index.js), which proxies the goatis.net transcript archive.
const API = '/api/v1'

const stats = ref(null)
const quote = ref(null)
const quoteLoading = ref(false)

const query = ref('')
const results = ref(null)
const searching = ref(false)
const error = ref('')

async function getJson(path) {
  const res = await fetch(`${API}/${path}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`)
  return data
}

async function loadQuote() {
  quoteLoading.value = true
  error.value = ''
  try {
    quote.value = await getJson('random')
  } catch (e) {
    error.value = e.message
  } finally {
    quoteLoading.value = false
  }
}

async function search() {
  const q = query.value.trim()
  if (q.length < 3) {
    error.value = 'Type at least 3 characters.'
    return
  }
  searching.value = true
  error.value = ''
  try {
    results.value = await getJson(`search?q=${encodeURIComponent(q)}&limit=20`)
  } catch (e) {
    error.value = e.message
  } finally {
    searching.value = false
  }
}

function highlight(text, q) {
  const escaped = text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
  const needle = q.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return escaped.replace(new RegExp(needle, 'gi'), (m) => `<mark>${m}</mark>`)
}

onMounted(async () => {
  loadQuote()
  try {
    stats.value = await getJson('stats')
  } catch (e) {
    error.value = e.message
  }
})
</script>

<template>
  <section class="container page-head">
    <span class="tag">Live API</span>
    <h1>The Archive</h1>
    <p class="muted">
      Every transcript from the <a href="https://goatis.net" target="_blank" rel="noopener">goatis.net</a> video archive,
      served through our own API at <code>/api/v1</code>.
    </p>
    <p v-if="stats" class="stats">
      <strong>{{ stats.videos.toLocaleString() }}</strong> videos ·
      <strong>{{ stats.hours.toLocaleString() }}</strong> hours ·
      {{ stats.firstDate?.slice(0, 4) }}–{{ stats.latestDate?.slice(0, 4) }}
    </p>
  </section>

  <section class="container section">
    <p v-if="error" class="error card">{{ error }}</p>

    <div class="card quote">
      <h2>Random wisdom</h2>
      <template v-if="quote">
        <blockquote>“{{ quote.quote }}”</blockquote>
        <p class="small">
          From
          <a v-if="quote.video.url" :href="quote.video.url" target="_blank" rel="noopener">{{ quote.video.title }}</a>
          <span v-else>{{ quote.video.title }}</span>
          <span v-if="quote.video.date"> · {{ quote.video.date }}</span>
        </p>
      </template>
      <p v-else class="muted">Loading the archive (the first request can take a few seconds)…</p>
      <button class="btn" :disabled="quoteLoading" @click="loadQuote">{{ quoteLoading ? 'Loading…' : 'Another one' }}</button>
    </div>

    <h2>Search the transcripts</h2>
    <form class="search" @submit.prevent="search">
      <input v-model="query" type="text" placeholder="e.g. raw meat, fruit, slaves…" aria-label="Search transcripts" />
      <button class="btn" :disabled="searching">{{ searching ? 'Searching…' : 'Search' }}</button>
    </form>

    <template v-if="results">
      <p class="muted">
        {{ results.total.toLocaleString() }} videos mention “{{ results.query }}”<span v-if="results.total > results.results.length">, showing the first {{ results.results.length }}</span>.
      </p>
      <ul class="results">
        <li v-for="r in results.results" :key="r.title + r.date" class="card">
          <h3>
            <a v-if="r.url" :href="r.url" target="_blank" rel="noopener" v-html="highlight(r.title, results.query)" />
            <span v-else v-html="highlight(r.title, results.query)" />
          </h3>
          <p class="small">{{ r.date }}<span v-if="r.minutes"> · {{ r.minutes }} min</span></p>
          <p v-if="r.snippet" class="snippet" v-html="highlight(r.snippet, results.query)" />
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.stats { margin-top: 12px; }
code { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 1px 6px; }
.error { color: #b3261e; }
.quote { margin-bottom: 40px; }
.quote h2 { margin-top: 0; }
.quote blockquote { font-size: 1.25rem; font-style: italic; margin: 0 0 8px; }
.search { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.search input { flex: 1; min-width: 200px; padding: 12px 18px; border-radius: 999px; border: 2px solid var(--border); background: var(--surface); color: var(--text); font-size: 1rem; }
.search input:focus { outline: none; border-color: var(--brand); }
.results { list-style: none; padding: 0; display: grid; gap: 12px; }
.results .card { padding: 16px 20px; }
.results h3 { margin: 0 0 4px; font-size: 1.05rem; }
.results p { margin: 4px 0; }
.snippet { color: var(--muted); }
:deep(mark) { background: var(--accent); color: #2b2620; border-radius: 3px; padding: 0 2px; }
</style>
