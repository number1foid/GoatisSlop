<script setup>
import { computed } from 'vue'
import { nl } from '../i18n'
import MediaVideo from '../components/MediaVideo.vue'

const EN = {
  intro: 'This is where a portfolio of my own projects would normally go. You won\'t find one here, and that\'s deliberate: there are three reasons I can\'t show my real projects on this website.',
  reasons: [
    {
      title: 'They\'re private for legal reasons',
      body: [
        'Most of my projects live in private GitHub repositories, because they are derivatives of copyrighted or licensed works. Making them public would mean distributing that material, which violates copyright and/or licensing law.',
        'That would quickly get the repositories taken down, and could get my GitHub account banned, not to mention the risk of further legal action.',
      ],
    },
    {
      title: 'They contain personal information',
      body: [
        'Some of these projects contain personal information, or point to it. The only people I intend to share that with are the software engineering teachers who will review and grade this project, since they know me in real life.',
        'This website, however, already has active visitors, mostly from "TSBER", who know its URL. Anything published here would be visible to them too, personal information included.',
      ],
    },
    {
      title: 'What\'s left wouldn\'t impress',
      body: [
        'I could list only the projects that contain no personal information and host no copyrighted or licensed material. But very few of my projects meet both criteria, and the ones that do are small in scope.',
        'A portfolio is meant to impress the viewer, not disenchant them, and a short list of minor projects would do the latter.',
      ],
    },
  ],
  instead: 'So instead, here is an edit claiming that the "gap" between Goatis and Aajonus Vonderplanitz is "at least as deep as the Pacific Ocean", seemingly endorsing the idea that Aajonus has been far more pivotal to the primal lifestyle movement than Goatis, by a large margin.',
}

const NL = {
  intro: 'Hier zou normaal gesproken een portfolio van mijn eigen projecten staan. Je vindt er hier geen, en dat is bewust: er zijn drie redenen waarom ik mijn echte projecten niet op deze website kan laten zien.',
  reasons: [
    {
      title: 'Ze zijn privé om juridische redenen',
      body: [
        'De meeste van mijn projecten staan in privé-repository\'s op GitHub, omdat ze afgeleid zijn van auteursrechtelijk beschermde of gelicenseerde werken. Ze openbaar maken zou betekenen dat ik dat materiaal verspreid, en dat is in strijd met het auteursrecht en/of licentievoorwaarden.',
        'Dan zouden de repository\'s al snel offline worden gehaald, en zou mijn GitHub-account verbannen kunnen worden, om nog maar te zwijgen van het risico op verdere juridische stappen.',
      ],
    },
    {
      title: 'Ze bevatten persoonlijke informatie',
      body: [
        'Sommige van deze projecten bevatten persoonlijke informatie, of verwijzen ernaar. Die wil ik alleen delen met de software-engineeringdocenten die dit project gaan beoordelen, omdat zij mij in het echte leven kennen.',
        'Deze website heeft echter al actieve bezoekers, vooral van "TSBER", die de URL kennen. Alles wat hier gepubliceerd wordt, zouden zij ook kunnen zien, persoonlijke informatie inbegrepen.',
      ],
    },
    {
      title: 'Wat overblijft, maakt geen indruk',
      body: [
        'Ik zou alleen de projecten kunnen tonen die geen persoonlijke informatie bevatten en geen auteursrechtelijk beschermd of gelicenseerd materiaal hosten. Maar heel weinig van mijn projecten voldoen aan allebei die voorwaarden, en de projecten die dat wel doen, zijn klein van opzet.',
        'Een portfolio hoort indruk te maken op de kijker, niet om die teleur te stellen, en een kort lijstje kleine projecten zou dat laatste doen.',
      ],
    },
  ],
  instead: 'Daarom hier in plaats daarvan een edit die beweert dat de "gap" tussen Goatis en Aajonus Vonderplanitz "at least as deep as the Pacific Ocean" is. Daarmee lijkt de edit het idee te onderschrijven dat Aajonus, met grote afstand, veel belangrijker is geweest voor de primal-leefstijlbeweging dan Goatis.',
}

const s = computed(() => (nl.value ? NL : EN))
</script>

<template>
  <article class="page">
    <h1>Portfolio</h1>

    <p>{{ s.intro }}</p>

    <ol class="reasons">
      <li v-for="reason in s.reasons" :key="reason.title">
        <h2>{{ reason.title }}</h2>
        <p v-for="paragraph in reason.body" :key="paragraph">{{ paragraph }}</p>
      </li>
    </ol>

    <p>{{ s.instead }}</p>

    <MediaVideo src="/media/portfolio-aajonus-gap.mp4" :aspect="9 / 16" title="The gap between Goatis and Aajonus" />
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
