<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { animatePage } from './router'

const menuOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { menuOpen.value = false })
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="site-title">Goatis</RouterLink>
      <button class="menu-toggle" :aria-expanded="menuOpen" aria-label="Toggle menu" @click="menuOpen = !menuOpen">☰</button>
      <nav :class="{ open: menuOpen }">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/api">YouTube API</RouterLink>
        <RouterLink to="/portfolio">Portfolio</RouterLink>
        <RouterLink to="/ideology">Ideology</RouterLink>
        <RouterLink to="/satire">Satire</RouterLink>
        <RouterLink to="/controversy">Controversy</RouterLink>
      </nav>
    </div>
  </header>

  <main :class="{ 'no-anim': !animatePage }">
    <RouterView :key="route.path" />
  </main>
</template>
