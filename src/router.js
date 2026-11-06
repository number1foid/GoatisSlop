import { ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Home' } },
  { path: '/api', name: 'api', component: () => import('./views/ApiView.vue'), meta: { title: 'The Channel' } },
  { path: '/portfolio', name: 'portfolio', component: () => import('./views/PortfolioView.vue'), meta: { title: 'Portfolio' } },
  { path: '/ideology', name: 'ideology', component: () => import('./views/IdeologyView.vue'), meta: { title: 'Ideology' } },
  { path: '/satire', name: 'satire', component: () => import('./views/SatireView.vue'), meta: { title: 'Satire' } },
  { path: '/controversy', name: 'controversy', component: () => import('./views/ControversyView.vue'), meta: { title: 'Controversy' } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./views/NotFoundView.vue'), meta: { title: 'Lost Goat' } },
]

// Each page remembers where you left it, for this browser session. Opening it again (by any link, not just
// Back) returns to that spot; pages you haven't scrolled yet open at the top.
const SCROLL_KEY = 'goatis:scroll-positions'
const scrollPositions = new Map()
try {
  for (const [path, top] of JSON.parse(sessionStorage.getItem(SCROLL_KEY) ?? '[]')) scrollPositions.set(path, top)
} catch {
  // Storage unavailable: positions are kept for this page load only.
}

function rememberScroll(path, top) {
  scrollPositions.set(path, top)
  try {
    sessionStorage.setItem(SCROLL_KEY, JSON.stringify([...scrollPositions]))
  } catch {
    // Kept in memory only.
  }
}

// Resolves once the page is tall enough to scroll to `top` (or after a second, whichever comes first), so the
// position isn't clamped while content is still rendering.
function whenScrollable(top) {
  return new Promise((resolve) => {
    const start = performance.now()
    const check = () => {
      const maxTop = document.documentElement.scrollHeight - window.innerHeight
      if (maxTop >= top || performance.now() - start > 1000) resolve({ top })
      else requestAnimationFrame(check)
    }
    check()
  })
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    const top = savedPosition?.top ?? scrollPositions.get(to.path) ?? 0
    return top ? whenScrollable(top) : { top: 0 }
  },
})

router.beforeEach((to, from) => {
  if (from.matched.length && to.path !== from.path) rememberScroll(from.path, window.scrollY)
})

// Pages play their entrance animation only the first time they're opened in a browser session.
const SEEN_KEY = 'goatis:seen-pages'
const seenPages = new Set()
try {
  for (const path of JSON.parse(sessionStorage.getItem(SEEN_KEY) ?? '[]')) seenPages.add(path)
} catch {
  // Storage unavailable: pages simply animate on every visit.
}
export const animatePage = ref(true)

router.afterEach((to) => {
  document.title = `${to.meta.title} · Goatis`
  // Decided here, not in beforeEach: the route has just changed, and Vue renders the new page in its next
  // flush, so the old page never sees this flag change. Flipping it earlier (while a lazy page loads) would
  // turn the animation back on for the page being left, replaying it.
  animatePage.value = !seenPages.has(to.path)
  seenPages.add(to.path)
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify([...seenPages]))
  } catch {
    // Remembered for this page load only.
  }
})

export default router
