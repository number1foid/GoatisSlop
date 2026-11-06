<script setup>
import { t } from '../i18n'
</script>

<template>
  <article class="page lost">
    <h1>{{ t('404: A goat ate this page', '404: Een geit heeft deze pagina opgegeten') }}</h1>
    <p class="muted">{{ t("We've opened an investigation. The goat has declined to comment.", 'We zijn een onderzoek gestart. De geit wil niet reageren.') }}</p>
    <p><RouterLink to="/" class="btn">{{ t('Back to the pasture', 'Terug naar de wei') }}</RouterLink></p>
  </article>
</template>

<style scoped>
.lost { text-align: center; }
</style>
