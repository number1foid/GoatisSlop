import { ref, computed, watch } from 'vue'

// The site is written in English with a Dutch translation, switched by the "Dutch" checkbox at the bottom.
// The choice is kept for this browser tab (sessionStorage), like the site's other per-session settings.
const LANG_KEY = 'goatis:lang'

let initial = 'en'
try {
  if (sessionStorage.getItem(LANG_KEY) === 'nl') initial = 'nl'
} catch {
  // Storage unavailable: English.
}

export const lang = ref(initial)
export const nl = computed(() => lang.value === 'nl')

watch(
  lang,
  (value) => {
    document.documentElement.lang = value
    try {
      sessionStorage.setItem(LANG_KEY, value)
    } catch {
      // Kept for this page load only.
    }
  },
  { immediate: true },
)

// Picks the string for the current language: t('Videos', "Video's").
export const t = (en, dutch) => (nl.value ? dutch : en)
