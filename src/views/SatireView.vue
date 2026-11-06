<script setup>
import MediaImage from '../components/MediaImage.vue'
import MediaVideo from '../components/MediaVideo.vue'
</script>

<template>
  <article class="page">
    <h1>Satire</h1>

    <p>Over the years, the internet has settled on a handful of recurring ways to make fun of Goatis. Below are the four most common, each with examples.</p>

    <h2 class="category">Face Scan</h2>

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

    <h2 class="category">Rage</h2>

    <p>Goatis' angriest moments, such as outbursts mid-reaction or furious rants, are cut out of their original context and blown up with face scans, effects and rapid-fire edits, turning a flash of anger into the punchline.</p>

    <MediaVideo
      src="/media/rage-shut-up.mp4"
      title="Rage: shut up"
      caption="Goatis loudly says &quot;shut the fuck up, fucking moron, fuck these [inaudible]&quot; ('moron' being cut out), then the face scan, then an &quot;edit&quot; comprised of various clips of him talking ensues. The central &quot;shut the fuck up&quot; clip is taken out of a video of Goatis criticising and deriding the UFC, and specifically Khabib Nurmagomedov for fighting by UFC rules, which are man made and imaginary according to Goatis."
    />

    <MediaVideo
      src="/media/rage-crashout.mp4"
      title="Rage: slight crashout"
      caption="Goatis' reaction cam from another video is plastered onto an informative video regarding 3D-printed steak made by an Israeli company. Goatis &quot;crashes out&quot; after &quot;Israeli&quot; is said, and an incomprehensible mix of audio, visual effects, and other elements are combined to satirize this moment of anger from Goatis."
    />

    <h2 class="category">Slop</h2>

    <p>Deliberately chaotic, overloaded edits that pile sound effects, music, visual effects and reaction clips on top of otherwise ordinary Goatis footage, until the result is barely comprehensible. The chaos is the joke.</p>

    <MediaVideo
      src="/media/slop-slave-food.mp4"
      title="Slop: slave food"
      caption="A combination of satirical added audio and visual effects &amp; elements on top of Goatis criticising a woman for her diet, which consists primarily of slave food according to Goatis. The video is very stochastic and difficult to follow."
    />

    <MediaVideo
      src="/media/slop-roids-part-2.mp4"
      title="Slop: working out on roids part 2"
      caption="Goatis working out at the gym with the title &quot;Goatis working out on roids part 2&quot; - implying that Goatis is on steroids in these clips, with the twist being that Goatis is doing so in a way that defeats the point, minimizing required effort and only mimicking actual workouts, while audio and reaction clips of Goatis play occasionally to further satirize the video. All of this while the main &quot;Bad Piggies&quot; theme is playing in the background. The video shares the chaotic theme as the previous, being largely incomprehensible."
    />

    <h2 class="category">Ghoul</h2>

    <p>AI-generated images and videos of a "ghoulified" Goatis, usually gaunt, malnourished and uncanny, often set to real audio of him. It takes the "Vegatis" idea from the face scans and runs with it.</p>

    <MediaVideo
      src="/media/ghoul-bicycles.mp4"
      title="Ghoul: rusty bicycles"
      caption="Various AI images and real Goatis audio clips relating to old, rusty bicycles being societally perceived as dangerous, while not actually being as dangerous as is perceived in reality, with nearly all images revolving around a ghoulified, malnourished version of Goatis."
    />

    <MediaVideo
      src="/media/ghoul-sonion.mp4"
      title="Ghoul: shirtless"
      caption="An AI-generated video of a ghoulish Goatis with no shirt on, in this case containing a Goatis variant with more stomach fat, focusing less on the malnourished aspect."
    />
  </article>
</template>

<style scoped>
/* Each category opens with a full-column rule and a small label above its name. */
.category { width: min(calc(100% - 32px), calc(var(--measure) - 32px)); margin-top: 96px; padding: 32px 0 0; border-top: 2px solid var(--btn-hover); }
.category::before {
  content: 'Type';
  display: block;
  margin-bottom: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}
</style>
