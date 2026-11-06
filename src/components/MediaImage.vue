<script setup>
defineProps({
  src: { type: String, required: true },
  alt: { type: String, required: true },
  caption: { type: String, default: '' }, // shown above the image
  width: { type: Number, default: null },
  height: { type: Number, default: null },
})
</script>

<template>
  <figure class="media image-section">
    <figcaption v-if="caption" class="caption">{{ caption }}</figcaption>
    <img :src="src" :alt="alt" :width="width" :height="height" loading="lazy" />
  </figure>
</template>

<style scoped>
.image-section { margin-left: auto; margin-right: auto; }
img { display: block; max-width: 100%; height: auto; margin: 0 auto; border-radius: 10px; border: 1px solid var(--border); }
</style>
