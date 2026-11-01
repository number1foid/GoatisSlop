<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const menuOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { menuOpen.value = false })
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="logo">🐐 Goatis<sup>™</sup></RouterLink>
      <button class="menu-toggle" :aria-expanded="menuOpen" aria-label="Toggle menu" @click="menuOpen = !menuOpen">☰</button>
      <nav :class="{ open: menuOpen }">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/api">YouTube API</RouterLink>
        <RouterLink to="/portfolio">Portfolio</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <RouterView />
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>© {{ new Date().getFullYear() }} Goatis Holdings Ltd. All rights reserved. Some fences eaten.</p>
      <p class="small">Goatis is a satirical, fictional company. No goats were consulted, invoiced or harmed.</p>
    </div>
  </footer>
</template>
