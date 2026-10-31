<script setup>
import { ref, computed } from 'vue'

const projects = [
  { emoji: '🏟️', title: 'National Stadium Re-Turfing', client: 'A Very Large Stadium', category: 'Enterprise', result: 'Pitch removed 3 days before the cup final. Match relocated to a car park.' },
  { emoji: '🏛️', title: 'Parliament Lawn Optimisation', client: 'Undisclosed Government', category: 'Government', result: 'Lawn eliminated. Two motions and one minister also eaten.' },
  { emoji: '🚀', title: 'GoatGPT', client: 'Internal R&D', category: 'AI', result: 'Answers every prompt with "meh". Benchmarks indistinguishable from competitors.' },
  { emoji: '🏡', title: 'Suburban Hedge Disruption', client: 'The Hendersons', category: 'Residential', result: 'Hedge gone. Fence gone. Henderson relationship ongoing (legal).' },
  { emoji: '⛳', title: 'Golf Course Rough Reduction', client: 'Pinehill Country Club', category: 'Enterprise', result: 'Rough reduced by 100%. So was the green. So were the flags.' },
  { emoji: '📦', title: 'Cardboard Recycling Pilot', client: 'Big Online Retailer', category: 'Sustainability', result: 'All packaging recycled. Including the packaging that still had products in it.' },
]

const categories = ['All', ...new Set(projects.map((p) => p.category))]
const active = ref('All')
const visible = computed(() => (active.value === 'All' ? projects : projects.filter((p) => p.category === active.value)))
</script>

<template>
  <section class="container page-head">
    <span class="tag">Case studies</span>
    <h1>Portfolio</h1>
    <p class="muted">A selection of landmark Goatis engagements. Results may vary. Results usually vary.</p>
  </section>

  <section class="container section">
    <div class="filters" role="group" aria-label="Filter by category">
      <button
        v-for="c in categories"
        :key="c"
        :class="['chip', { active: c === active }]"
        @click="active = c"
      >{{ c }}</button>
    </div>

    <div class="grid">
      <article v-for="p in visible" :key="p.title" class="card project">
        <div class="emoji">{{ p.emoji }}</div>
        <span class="tag">{{ p.category }}</span>
        <h3>{{ p.title }}</h3>
        <p class="small">Client: {{ p.client }}</p>
        <p>{{ p.result }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
.filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.chip { border: 2px solid var(--border); background: var(--surface); color: var(--text); padding: 6px 16px; border-radius: 999px; font-weight: 600; cursor: pointer; }
.chip.active { background: var(--brand); border-color: var(--brand); color: #fff; }
.emoji { font-size: 3rem; }
.project h3 { margin: 10px 0 4px; }
.project .small { margin: 0 0 8px; }
</style>
