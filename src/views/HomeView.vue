<script setup>
import { computed } from 'vue'
import { nl } from '../i18n'

const EN = {
  intro: 'This website is dedicated to inform the user (probably Gijs) about Goatis and closely related subjects through the usage of a combination of text, videos and screenshots.',
  who: '"Goatis" also called "Sv3rige" is the online pseudonym of Gatis Lagzdiņš. Goatis is an advocate of the "raw meat" or "primal" diet and lifestyle, spreading anti-vegan and alternative lifestyle beliefs.',
  fame: 'He has gained online fame, primarily on platforms such as YouTube and TikTok over the years, primarily as a result of various stunts and contrarian actions or statements. These include eating various types of raw meat- and- animal products in the context of physical presence at a vegan rally, event, or organizational location, anti-vegan protests and activism, extremely peculiar controversies involving: the abuse of AirBNB\'s, stabbing classmates at a young age in his motherland, Latvia, requesting illicit images through e-mail, as well as general, across-the-board contrarianism.',
}

const NL = {
  intro: 'Deze website is bedoeld om de gebruiker (waarschijnlijk Gijs) te informeren over Goatis en nauw verwante onderwerpen, met behulp van een combinatie van tekst, video\'s en screenshots.',
  who: '"Goatis", ook wel "Sv3rige" genoemd, is het online pseudoniem van Gatis Lagzdiņš. Goatis is een voorstander van het "raw meat"- of "primal"-dieet en de bijbehorende levensstijl, en verspreidt anti-veganistische en alternatieve leefstijlopvattingen.',
  fame: 'Hij is in de loop der jaren online bekend geworden, vooral op platforms als YouTube en TikTok, voornamelijk door allerlei stunts en dwarse acties of uitspraken. Daaronder vallen het eten van allerlei soorten rauw vlees en dierlijke producten terwijl hij fysiek aanwezig was bij een veganistische demonstratie, een veganistisch evenement of de locatie van een veganistische organisatie, anti-veganistische protesten en activisme, en uiterst merkwaardige controverses rond: het misbruiken van Airbnb\'s, het op jonge leeftijd steken van klasgenoten in zijn vaderland Letland, het per e-mail opvragen van ongepaste beelden, en algemene, allesomvattende dwarsheid.',
}

const s = computed(() => (nl.value ? NL : EN))
</script>

<template>
  <article class="page">
    <h1>Goatis</h1>
    <p>{{ s.intro }}</p>
    <p>{{ s.who }}</p>
    <p>{{ s.fame }}</p>
  </article>
</template>
