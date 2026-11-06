<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { animatePage, pageTitle } from './router'
import { lang, nl, t } from './i18n'

const menuOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { menuOpen.value = false })

// Switching language swaps the page's text in place; it shouldn't replay the entrance animation.
watch(lang, () => {
  animatePage.value = false
  document.title = pageTitle(route)
})

function setDutch(event) {
  lang.value = event.target.checked ? 'nl' : 'en'
}
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="site-title">Goatis</RouterLink>
      <button class="menu-toggle" :aria-expanded="menuOpen" :aria-label="t('Toggle menu', 'Menu openen of sluiten')" @click="menuOpen = !menuOpen">☰</button>
      <nav :class="{ open: menuOpen }">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/api">{{ t('The Channel', 'Het Kanaal') }}</RouterLink>
        <RouterLink to="/portfolio">Portfolio</RouterLink>
        <RouterLink to="/ideology">{{ t('Ideology', 'Ideologie') }}</RouterLink>
        <RouterLink to="/satire">Satire</RouterLink>
        <RouterLink to="/controversy">{{ t('Controversy', 'Controverse') }}</RouterLink>
      </nav>
    </div>
  </header>

  <main :class="{ 'no-anim': !animatePage }">
    <RouterView :key="route.path" />
  </main>

  <footer class="lang-bar">
    <label class="lang-option">
      <input type="checkbox" :checked="nl" @change="setDutch" />
      <span>Dutch</span>
    </label>
  </footer>
</template>
