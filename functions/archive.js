// Loads and indexes the goatis.net transcript archive.
// goatis.net has no public API: its search box downloads one big JSON file (~22 MB) mapping
// "texts/<year>/<title>.md" to a Markdown transcript, and it sends no CORS headers. So we fetch it
// server-side, keep a parsed copy in memory, and only re-fetch every CACHE_TTL_MS.

const SOURCE = 'https://goatis.net'
const DATA_URL = `${SOURCE}/code/loadsearch.php`
const SITEMAP_URL = `${SOURCE}/sitemap.xml`
const CACHE_TTL_MS = 12 * 60 * 60 * 1000
const USER_AGENT = 'GoatisSlop/1.0 (+https://goatislop.web.app)'

let cache = null
let loading = null

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`${url} responded ${res.status}`)
  return res.text()
}

// goatis.net builds page slugs from titles, but not always the same way (some keep "@handle" words
// apart, some squash them; most drop in-word hyphens). Try the variants and keep the one that exists.
function slugify(text) {
  return text.normalize('NFKD').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-')
}
const squashHandles = (t) => t.replace(/@([^@]+)/g, (_, name) => name.replace(/\s+/g, ''))
const slugVariants = (title) => [
  slugify(title),
  slugify(squashHandles(title)),
  slugify(title.replace(/-/g, ' ')),
  slugify(squashHandles(title).replace(/-/g, ' ')),
]

const META_RE = /^Watch on YouTube · (\d{4}-\d{2}-\d{2}) · (\d+) min$/

function parseVideo(key, markdown, pages) {
  const match = key.match(/^texts\/(\d{4})\/(.+)\.md$/)
  if (!match) return null
  const [, year, title] = match

  const lines = markdown.split('\n').map((l) => l.trim()).filter(Boolean)
  const meta = lines.find((l) => META_RE.test(l))?.match(META_RE)
  const body = lines.filter((l) => !l.startsWith('# ') && !META_RE.test(l) && !/^(\.\.\.\s*)+$/.test(l))

  const slug = slugVariants(title).find((s) => pages.has(s))
  return {
    title,
    year: Number(year),
    date: meta?.[1] ?? null,
    minutes: meta ? Number(meta[2]) : null,
    url: slug ? `${SOURCE}/${slug}` : null,
    lines: body,
    searchText: `${title}\n${body.join('\n')}`.toLowerCase(),
  }
}

async function load() {
  const [json, sitemap] = await Promise.all([fetchText(DATA_URL), fetchText(SITEMAP_URL)])
  const pages = new Set(
    [...sitemap.matchAll(/<loc>https:\/\/goatis\.net\/([^<]*)<\/loc>/g)].map((m) => m[1].replace(/\/$/, '')),
  )
  const videos = Object.entries(JSON.parse(json))
    .map(([key, md]) => parseVideo(key, md, pages))
    .filter(Boolean)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  return { videos, loadedAt: new Date().toISOString() }
}

export async function getArchive() {
  if (cache && Date.now() - Date.parse(cache.loadedAt) < CACHE_TTL_MS) return cache
  // Share one in-flight download between concurrent requests.
  loading ??= load()
    .then((data) => (cache = data))
    .finally(() => (loading = null))
  try {
    return await loading
  } catch (err) {
    // Serve stale data rather than nothing if goatis.net is down.
    if (cache) return cache
    throw err
  }
}

export const summary = ({ title, year, date, minutes, url }) => ({ title, year, date, minutes, url })
