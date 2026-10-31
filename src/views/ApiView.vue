<script setup>
import { ref, computed, onMounted } from 'vue'

// Open-Meteo: free, keyless weather + geocoding APIs (https://open-meteo.com)
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

const query = ref('Amsterdam')
const place = ref(null)
const weather = ref(null)
const loading = ref(false)
const error = ref('')

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json()
}

async function search() {
  const name = query.value.trim()
  if (!name) return
  loading.value = true
  error.value = ''
  try {
    const geo = await fetchJson(`${GEO_URL}?name=${encodeURIComponent(name)}&count=1&language=en&format=json`)
    if (!geo.results?.length) throw new Error(`No pasture called "${name}" found. Our goats looked everywhere.`)
    const p = geo.results[0]
    const params = new URLSearchParams({
      latitude: p.latitude,
      longitude: p.longitude,
      current: 'temperature_2m,precipitation,wind_speed_10m',
      daily: 'temperature_2m_max,precipitation_sum,wind_speed_10m_max',
      timezone: 'auto',
      forecast_days: '5',
    })
    weather.value = await fetchJson(`${FORECAST_URL}?${params}`)
    place.value = p
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// The patented Goatis Grazing Index™ (GGI). Peer-reviewed by zero peers.
function grazingIndex(temp, rain, wind) {
  let score = 100
  score -= Math.abs(temp - 18) * 2.5
  score -= rain * 8
  score -= Math.max(0, wind - 15) * 1.5
  return Math.round(Math.min(100, Math.max(0, score)))
}

function verdict(score) {
  if (score >= 80) return { label: 'Prime munching', note: 'Release the herd. Shareholders expect results.' }
  if (score >= 60) return { label: 'Solid grazing', note: 'Acceptable. Middle management goats may proceed.' }
  if (score >= 40) return { label: 'Questionable', note: 'Goats will graze, but they will complain on LinkedIn.' }
  if (score >= 20) return { label: 'Poor', note: 'Recommend indoor synergy sessions (eating cardboard).' }
  return { label: 'Catastrophic', note: 'All goats to the bunker. Bring snacks.' }
}

const current = computed(() => {
  if (!weather.value) return null
  const c = weather.value.current
  const score = grazingIndex(c.temperature_2m, c.precipitation, c.wind_speed_10m)
  return { ...c, score, ...verdict(score) }
})

const days = computed(() => {
  if (!weather.value) return []
  const d = weather.value.daily
  return d.time.map((date, i) => {
    const score = grazingIndex(d.temperature_2m_max[i], d.precipitation_sum[i] / 4, d.wind_speed_10m_max[i])
    return {
      date: new Date(date).toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short' }),
      temp: d.temperature_2m_max[i],
      rain: d.precipitation_sum[i],
      score,
      label: verdict(score).label,
    }
  })
})

onMounted(search)
</script>

<template>
  <section class="container page-head">
    <span class="tag">Live API</span>
    <h1>Grazing Forecast API</h1>
    <p class="muted">
      Real-time weather data from <a href="https://open-meteo.com" target="_blank" rel="noopener">Open-Meteo</a>,
      run through our patented Goatis Grazing Index™ to answer life's biggest question: should the goats go outside?
    </p>
  </section>

  <section class="container section">
    <form class="search" @submit.prevent="search">
      <input v-model="query" type="text" placeholder="Enter a city or pasture…" aria-label="City" />
      <button class="btn" :disabled="loading">{{ loading ? 'Consulting goats…' : 'Forecast' }}</button>
    </form>

    <p v-if="error" class="error card">🐐💥 {{ error }}</p>

    <template v-if="current && place && !error">
      <div class="card now">
        <div>
          <p class="muted">Right now in</p>
          <h2>{{ place.name }}<span class="muted">, {{ place.country }}</span></h2>
          <p>
            🌡️ {{ current.temperature_2m }}°C · 🌧️ {{ current.precipitation }} mm · 💨 {{ current.wind_speed_10m }} km/h
          </p>
          <p><strong>{{ current.label }}.</strong> {{ current.note }}</p>
        </div>
        <div class="score" :style="{ '--pct': current.score }">
          <strong>{{ current.score }}</strong>
          <span>GGI™</span>
        </div>
      </div>

      <h3>5-day grazing outlook</h3>
      <div class="days">
        <div v-for="d in days" :key="d.date" class="card day">
          <p class="muted">{{ d.date }}</p>
          <strong class="day-score">{{ d.score }}</strong>
          <p class="small">{{ d.label }}</p>
          <p class="small">{{ d.temp }}°C · {{ d.rain }} mm</p>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.search { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
.search input { flex: 1; min-width: 200px; padding: 12px 18px; border-radius: 999px; border: 2px solid var(--border); background: var(--surface); color: var(--text); font-size: 1rem; }
.search input:focus { outline: none; border-color: var(--brand); }
.error { color: #b3261e; }
.now { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; margin-bottom: 32px; }
.now h2 { margin: 0 0 8px; }
.now p { margin: 4px 0; }
.score {
  width: 140px; height: 140px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: conic-gradient(var(--brand) calc(var(--pct) * 1%), var(--border) 0);
  position: relative;
}
.score::before { content: ''; position: absolute; inset: 12px; border-radius: 50%; background: var(--surface); }
.score > * { position: relative; }
.score strong { font-size: 2.4rem; line-height: 1; }
.score span { font-size: 0.8rem; color: var(--muted); }
.days { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
.day { text-align: center; padding: 16px; }
.day p { margin: 4px 0; }
.day-score { font-size: 2rem; color: var(--brand); }
</style>
