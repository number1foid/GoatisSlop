<script setup>
import MediaImage from '../components/MediaImage.vue'
import MediaVideo from '../components/MediaVideo.vue'
</script>

<template>
  <article class="page">
    <h1>Satire</h1>

    <p>Goatis is frequently satirized in various ways, usually through short-form content on TikTok. These usually include short, erratic face scans run through "Looksmaxxing"-adjacent rating apps such as FaceIQ Labs, scanning a modified version of Goatis' face, tweaked to be exaggerated, uncanny and malnourished, often used in the context of "Vegatis" - a portmanteau for "vegan Gatis", implying that had Goatis been vegan, his appearance would be more ghoulish.</p>

    <MediaImage
      src="/media/satire-ascension-scan.png"
      alt="The Ascension face-scan app rating an exaggerated, malnourished edit of Goatis' face: Sub-3, PSL 0.1/8, potential Sub-5, top 0.1%."
      caption="The Goatis face scan itself. In this case, the app &quot;Ascension&quot; is used."
      :width="689"
      :height="646"
    />

    <MediaVideo
      src="/media/satire-exhibit-b.mp4"
      title="Satire, Exhibit B"
      caption="Satire | Exhibit B - Goatis in a reaction video, stating that dark chocolate is made &quot;toxic seeds&quot;, and asking how it can be good for a person's heart. The face scan then suddenly cues, with a high-pitched screaming noise."
    />
  </article>
</template>
