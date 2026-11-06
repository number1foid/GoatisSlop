<script setup>
import MediaVideo from '../components/MediaVideo.vue'
</script>

<template>
  <article class="page">
    <h1>Portfolio</h1>

    <p>This is where a portfolio of my own projects would normally go. You won't find one here, and that's deliberate: there are three reasons I can't show my real projects on this website.</p>

    <ol class="reasons">
      <li>
        <h2>They're private for legal reasons</h2>
        <p>Most of my projects live in private GitHub repositories, because they are derivatives of copyrighted or licensed works. Making them public would mean distributing that material, which violates copyright and/or licensing law.</p>
        <p>That would quickly get the repositories taken down, and could get my GitHub account banned, not to mention the risk of further legal action.</p>
      </li>
      <li>
        <h2>They contain personal information</h2>
        <p>Some of these projects contain personal information, or point to it. The only people I intend to share that with are the software engineering teachers who will review and grade this project, since they know me in real life.</p>
        <p>This website, however, already has active visitors, mostly from "TSBER", who know its URL. Anything published here would be visible to them too, personal information included.</p>
      </li>
      <li>
        <h2>What's left wouldn't impress</h2>
        <p>I could list only the projects that contain no personal information and host no copyrighted or licensed material. But very few of my projects meet both criteria, and the ones that do are small in scope.</p>
        <p>A portfolio is meant to impress the viewer, not disenchant them, and a short list of minor projects would do the latter.</p>
      </li>
    </ol>

    <p>So instead, here is an edit claiming that the "gap" between Goatis and Aajonus Vonderplanitz is "at least as deep as the Pacific Ocean", seemingly endorsing the idea that Aajonus has been far more pivotal to the primal lifestyle movement than Goatis, by a large margin.</p>

    <MediaVideo src="/media/portfolio-aajonus-gap.mp4" title="The gap between Goatis and Aajonus" />
  </article>
</template>

<style scoped>
.reasons { list-style: none; counter-reset: reason; margin-top: 8px; margin-bottom: 40px; }
.reasons li { counter-increment: reason; position: relative; padding: 28px 0 8px 56px; border-top: 1px solid var(--border); }
.reasons li::before {
  content: counter(reason);
  position: absolute;
  left: 0;
  top: 28px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--btn);
  border: 1px solid var(--border);
  display: grid;
  place-items: center;
  font-weight: 700;
}
.reasons h2 { font-size: 1.25rem; margin: 4px 0 12px; }
</style>
