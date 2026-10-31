<script setup>
const features = [
  { icon: '🌿', title: 'Grass-as-a-Service', text: 'Fully managed lawn removal on a monthly subscription. Cancel anytime*. *You cannot cancel.' },
  { icon: '🧠', title: 'AI-Powered Chewing', text: 'Our proprietary Goat Learning Model has been trained on 40 billion blades of grass and one shoe.' },
  { icon: '☁️', title: 'Cloud-Native Bleating', text: 'Every bleat is replicated across three continents for 99.999% bleat availability.' },
  { icon: '🔒', title: 'Enterprise Fencing', text: 'Military-grade fences, which our goats will still climb. Escapes are billed as "outdoor synergy".' },
]

const testimonials = [
  { quote: 'We replaced our entire landscaping department with Goatis. Then the goats replaced our board.', who: 'Former CEO, Lawnly Inc.' },
  { quote: 'Our Q3 grass metrics have never been lower. Our shareholders have never been more confused.', who: 'VP of Turf, MegaCorp' },
  { quote: 'Meeeeeh.', who: 'Gerald, Senior Goat Engineer' },
]
</script>

<template>
  <section class="hero">
    <div class="container hero-inner">
      <div>
        <span class="tag">Series G funding secured</span>
        <h1>The future of grazing is <span class="hl">here</span>.</h1>
        <p class="lead">
          Goatis is the world's first vertically integrated, blockchain-adjacent goat platform.
          We don't just eat your grass. We <em>disrupt</em> it.
        </p>
        <div class="cta">
          <RouterLink to="/api" class="btn">Search the archive</RouterLink>
          <RouterLink to="/portfolio" class="btn ghost">See our work</RouterLink>
        </div>
      </div>
      <div class="hero-goat" aria-hidden="true">🐐</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2>Why Goatis?</h2>
      <p class="muted">Because "why not goats?" is not a question our investors allowed us to ask.</p>
      <div class="grid">
        <article v-for="f in features" :key="f.title" class="card">
          <div class="icon">{{ f.icon }}</div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.text }}</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section stats">
    <div class="container grid">
      <div><strong>12,000+</strong><span>Lawns disrupted</span></div>
      <div><strong>3.2 M</strong><span>Bleats per second</span></div>
      <div><strong>0</strong><span>Profitable quarters</span></div>
      <div><strong>∞</strong><span>Valuation (estimated by a goat)</span></div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2>Trusted by people who should have known better</h2>
      <div class="grid">
        <blockquote v-for="t in testimonials" :key="t.who" class="card quote">
          <p>“{{ t.quote }}”</p>
          <footer>— {{ t.who }}</footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { padding: 72px 0 48px; background: linear-gradient(180deg, var(--surface), var(--bg)); border-bottom: 1px solid var(--border); }
.hero-inner { display: grid; grid-template-columns: 1.4fr 1fr; gap: 32px; align-items: center; }
.hero h1 { font-size: clamp(2.2rem, 6vw, 3.6rem); margin: 16px 0; }
.hl { color: var(--brand); }
.lead { font-size: 1.15rem; color: var(--muted); max-width: 560px; }
.cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.hero-goat { font-size: clamp(8rem, 22vw, 14rem); text-align: center; animation: bob 3s ease-in-out infinite; }
@keyframes bob { 50% { transform: translateY(-12px) rotate(-4deg); } }
.icon { font-size: 2rem; }
.card h3 { margin: 8px 0; }
.stats { background: var(--brand); color: #fff; text-align: center; }
.stats strong { display: block; font-size: 2.2rem; }
.quote { margin: 0; }
.quote p { font-size: 1.1rem; font-style: italic; margin-top: 0; }
.quote footer { color: var(--muted); font-weight: 600; }
@media (max-width: 720px) {
  .hero-inner { grid-template-columns: 1fr; }
  .hero-goat { order: -1; }
}
</style>
