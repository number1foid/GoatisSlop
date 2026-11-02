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

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = `${to.meta.title} · Goatis`
})

export default router
