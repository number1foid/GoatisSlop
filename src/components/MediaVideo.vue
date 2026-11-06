<script setup>
import { ref, computed } from 'vue'

// A video as a large, full-width page section. Wide videos run edge to edge; videos without enough width for
// that (portrait or square, like TikToks) are centered at a large height on a full-width band instead.
const props = defineProps({
  src: { type: String, default: '' }, // local file, e.g. /media/clip.mp4
  youtube: { type: String, default: '' }, // YouTube video ID or URL
  caption: { type: String, default: '' }, // shown above the video
  title: { type: String, default: 'Video' },
})

const WIDE_ENOUGH = 1.2 // width / height

const youtubeId = computed(() => {
  const m = props.youtube.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)
  return m ? m[1] : props.youtube
})

// YouTube embeds are 16:9. Local files report their size once metadata loads.
const aspect = ref(props.youtube ? 16 / 9 : null)
const tall = computed(() => aspect.value !== null && aspect.value < WIDE_ENOUGH)

function onMeta(e) {
  const { videoWidth, videoHeight } = e.target
  if (videoWidth && videoHeight) aspect.value = videoWidth / videoHeight
}
</script>

<template>
  <figure class="media bleed video-section" :class="{ tall }">
    <figcaption v-if="caption" class="caption">{{ caption }}</figcaption>
    <div class="stage">
      <iframe
        v-if="youtube"
        :src="`https://www.youtube-nocookie.com/embed/${youtubeId}`"
        :title="title"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerpolicy="strict-origin-when-cross-origin"
        allowfullscreen
      />
      <video v-else :src="src" controls playsinline preload="metadata" :aria-label="title" @loadedmetadata="onMeta" />
    </div>
  </figure>
</template>

<style scoped>
.video-section { margin-left: 0; margin-right: 0; }
.caption { max-width: var(--measure); margin-left: auto; margin-right: auto; padding: 0 16px; }
.stage { background: #000; }
.stage iframe { display: block; width: 100%; aspect-ratio: 16 / 9; border: 0; }
.stage video { display: block; width: 100%; height: auto; }

.tall .stage { background: var(--surface); padding: 24px 0; display: flex; justify-content: center; }
.tall .stage video { width: auto; max-width: 100%; height: min(85vh, 1024px); border-radius: 8px; background: #000; }
</style>
