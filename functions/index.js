import { onRequest } from 'firebase-functions/v2/https'
import { getArchive, summary } from './archive.js'

// Served on the site under /api/v1/* through a Firebase Hosting rewrite (see firebase.json).
//
//   GET /api/v1/stats                           totals and videos per year
//   GET /api/v1/videos?year=2024&limit=20&offset=0
//   GET /api/v1/search?q=fruit&limit=20         title + transcript search, with snippets
//   GET /api/v1/random                          a random quote with its video

const clamp = (value, min, max, fallback) => {
  const n = Number.parseInt(value, 10)
  return Number.isNaN(n) ? fallback : Math.min(max, Math.max(min, n))
}

function stats({ videos, loadedAt }) {
  const perYear = {}
  for (const v of videos) perYear[v.year] = (perYear[v.year] ?? 0) + 1
  return {
    videos: videos.length,
    hours: Math.round(videos.reduce((sum, v) => sum + (v.minutes ?? 0), 0) / 60),
    firstDate: videos.at(-1)?.date ?? null,
    latestDate: videos[0]?.date ?? null,
    perYear,
    loadedAt,
  }
}

function list({ videos }, query) {
  const year = clamp(query.year, 1900, 3000, null)
  const limit = clamp(query.limit, 1, 100, 20)
  const offset = clamp(query.offset, 0, Infinity, 0)
  const matching = year ? videos.filter((v) => v.year === year) : videos
  return { total: matching.length, offset, limit, results: matching.slice(offset, offset + limit).map(summary) }
}

function search({ videos }, query) {
  const q = String(query.q ?? '').trim().toLowerCase()
  if (q.length < 3) return { error: 'Query must be at least 3 characters.', status: 400 }
  const limit = clamp(query.limit, 1, 50, 20)

  // Title matches first, then transcript matches; videos are already sorted newest first.
  const titleHits = []
  const textHits = []
  let total = 0
  for (const v of videos) {
    if (!v.searchText.includes(q)) continue
    total++
    const titleHit = v.title.toLowerCase().includes(q)
    const bucket = titleHit ? titleHits : textHits
    if (bucket.length >= limit) continue
    const snippet = v.lines.find((l) => l.toLowerCase().includes(q)) ?? null
    bucket.push({ ...summary(v), titleHit, snippet })
  }
  return { query: q, total, results: [...titleHits, ...textHits].slice(0, limit) }
}

function random({ videos }) {
  // Pick a reasonably quotable line: a full sentence, not too short or long.
  for (let attempt = 0; attempt < 50; attempt++) {
    const v = videos[Math.floor(Math.random() * videos.length)]
    // Skip lines from reviewed clips, which are tagged like "[video] 0:23 ...".
    const quotes = v.lines.filter((l) => l.length >= 60 && l.length <= 280 && !l.startsWith('['))
    if (quotes.length) return { quote: quotes[Math.floor(Math.random() * quotes.length)], video: summary(v) }
  }
  return { error: 'No quote found, try again.', status: 503 }
}

const routes = {
  stats: { handler: stats, cache: 3600 },
  videos: { handler: list, cache: 3600 },
  search: { handler: search, cache: 3600 },
  random: { handler: random, cache: 0 },
}

export const api = onRequest(
  { region: 'europe-west1', memory: '1GiB', timeoutSeconds: 120, maxInstances: 2, cors: true },
  async (req, res) => {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Only GET is supported.' })

    const name = req.path.replace(/^\/api\/v1/, '').replace(/^\/+|\/+$/g, '')
    const route = routes[name]
    if (!route) return res.status(404).json({ error: 'Unknown endpoint.', endpoints: Object.keys(routes) })

    try {
      const data = route.handler(await getArchive(), req.query)
      if (data.error) return res.status(data.status ?? 400).json({ error: data.error })
      res.set('Cache-Control', route.cache ? `public, max-age=300, s-maxage=${route.cache}` : 'no-store')
      return res.json(data)
    } catch (err) {
      console.error(err)
      return res.status(502).json({ error: 'Could not load the goatis.net archive right now.' })
    }
  },
)
