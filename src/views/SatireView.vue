<script setup>
import { computed } from 'vue'
import { nl } from '../i18n'
import MediaImage from '../components/MediaImage.vue'
import MediaVideo from '../components/MediaVideo.vue'

const EN = {
  intro: 'Over the years, the internet has settled on a handful of recurring ways to make fun of Goatis. Below are the four most common, each with examples.',
  faceScan: 'Goatis is frequently satirized in various ways, usually through short-form content on TikTok. These usually include short, erratic face scans run through "Looksmaxxing"-adjacent rating apps such as FaceIQ Labs, scanning a modified version of Goatis\' face, tweaked to be exaggerated, uncanny and malnourished, often used in the context of "Vegatis" - a portmanteau for "vegan Gatis", implying that had Goatis been vegan, his appearance would be more ghoulish.',
  scanAlt: 'The Ascension face-scan app rating an exaggerated, malnourished edit of Goatis\' face: Sub-3, PSL 0.1/8, potential Sub-5, top 0.1%.',
  scanCaption: 'The Goatis face scan itself. In this case, the app "Ascension" is used.',
  chocolate: 'Goatis in a reaction video, stating that dark chocolate is made of "toxic seeds", and asking how it can be good for a person\'s heart. The face scan then suddenly cues, with a high-pitched screaming noise.',
  rage: 'Goatis\' angriest moments, such as outbursts mid-reaction or furious rants, are cut out of their original context and blown up with face scans, effects and rapid-fire edits, turning a flash of anger into the punchline.',
  shutUp: 'Goatis loudly says "shut the fuck up, fucking moron, fuck these [inaudible]" (\'moron\' being cut out), then the face scan, then an "edit" comprised of various clips of him talking ensues. The central "shut the fuck up" clip is taken out of a video of Goatis criticising and deriding the UFC, and specifically Khabib Nurmagomedov for fighting by UFC rules, which are man made and imaginary according to Goatis.',
  crashout: 'Goatis\' reaction cam from another video is plastered onto an informative video regarding 3D-printed steak made by an Israeli company. Goatis "crashes out" after "Israeli" is said, and an incomprehensible mix of audio, visual effects, and other elements are combined to satirize this moment of anger from Goatis.',
  slop: 'Deliberately chaotic, overloaded edits that pile sound effects, music, visual effects and reaction clips on top of otherwise ordinary Goatis footage, until the result is barely comprehensible. The chaos is the joke.',
  slaveFood: 'A combination of satirical added audio and visual effects & elements on top of Goatis criticising a woman for her diet, which consists primarily of slave food according to Goatis. The video is very stochastic and difficult to follow.',
  roids: 'Goatis working out at the gym with the title "Goatis working out on roids part 2" - implying that Goatis is on steroids in these clips, with the twist being that Goatis is doing so in a way that defeats the point, minimizing required effort and only mimicking actual workouts, while audio and reaction clips of Goatis play occasionally to further satirize the video. All of this while the main "Bad Piggies" theme is playing in the background. The video shares the chaotic theme as the previous, being largely incomprehensible.',
  ghoul: 'AI-generated images and videos of a "ghoulified" Goatis, usually gaunt, malnourished and uncanny, often set to real audio of him. It takes the "Vegatis" idea from the face scans and runs with it.',
  bicycles: 'Various AI images and real Goatis audio clips relating to old, rusty bicycles being societally perceived as dangerous, while not actually being as dangerous as is perceived in reality, with nearly all images revolving around a ghoulified, malnourished version of Goatis.',
  sonion: 'An AI-generated video of a ghoulish Goatis with no shirt on, in this case containing a Goatis variant with more stomach fat, focusing less on the malnourished aspect.',
}

const NL = {
  intro: 'In de loop der jaren heeft het internet een handvol vaste manieren gevonden om Goatis belachelijk te maken. Hieronder staan de vier meest voorkomende, elk met voorbeelden.',
  faceScan: 'Goatis wordt vaak op allerlei manieren op de hak genomen, meestal via korte video\'s op TikTok. Daarin zitten meestal korte, grillige gezichtsscans via "Looksmaxxing"-achtige beoordelingsapps zoals FaceIQ Labs, die een aangepaste versie van Goatis\' gezicht scannen: overdreven, griezelig en ondervoed gemaakt. Dit wordt vaak gebruikt in de context van "Vegatis", een samentrekking van "vegan Gatis", wat suggereert dat Goatis er als veganist nog spookachtiger uit zou zien.',
  scanAlt: 'De gezichtsscan-app Ascension beoordeelt een overdreven, ondervoede bewerking van Goatis\' gezicht: Sub-3, PSL 0.1/8, potentieel Sub-5, top 0.1%.',
  scanCaption: 'De Goatis-gezichtsscan zelf. In dit geval wordt de app "Ascension" gebruikt.',
  chocolate: 'Goatis in een reactievideo, waarin hij stelt dat pure chocolade gemaakt is van "toxic seeds" (giftige zaden), en vraagt hoe dat goed kan zijn voor je hart. Daarna start plotseling de gezichtsscan, met een hoog, gillend geluid.',
  rage: 'Goatis\' boosste momenten, zoals uitbarstingen midden in een reactievideo of woedende tirades, worden uit hun oorspronkelijke context geknipt en opgeblazen met gezichtsscans, effecten en razendsnelle edits, waardoor een moment van woede de clou wordt.',
  shutUp: 'Goatis roept luid "shut the fuck up, fucking moron, fuck these [onverstaanbaar]" (waarbij \'moron\' is weggeknipt), waarna de gezichtsscan volgt en daarna een "edit" van allerlei clips waarin hij praat. De centrale "shut the fuck up"-clip komt uit een video waarin Goatis de UFC bekritiseert en belachelijk maakt, en in het bijzonder Khabib Nurmagomedov, omdat die volgens de UFC-regels vecht. Die regels zijn volgens Goatis door de mens bedacht en denkbeeldig.',
  crashout: 'Goatis\' reactiecamera uit een andere video is over een informatieve video geplakt over 3D-geprinte steak van een Israëlisch bedrijf. Goatis "crashes out" (ontploft) zodra "Israeli" valt, en een onbegrijpelijke mix van geluid, visuele effecten en andere elementen wordt gecombineerd om dit woedemoment van Goatis te parodiëren.',
  slop: 'Bewust chaotische, overvolle edits die geluidseffecten, muziek, visuele effecten en reactieclips opstapelen op verder gewone beelden van Goatis, tot het resultaat nauwelijks nog te volgen is. De chaos is de grap.',
  slaveFood: 'Een combinatie van satirisch toegevoegd geluid en visuele effecten en elementen bovenop Goatis die een vrouw bekritiseert om haar dieet, dat volgens Goatis vooral uit "slave food" bestaat. De video is erg willekeurig en moeilijk te volgen.',
  roids: 'Goatis die in de sportschool traint, met de titel "Goatis working out on roids part 2", wat suggereert dat Goatis in deze clips steroïden gebruikt. De twist is dat hij dat doet op een manier die het hele punt mist: zo min mogelijk moeite, en echte oefeningen alleen nadoen. Tussendoor klinken af en toe geluids- en reactieclips van Goatis om de video verder te parodiëren. Dit alles terwijl op de achtergrond het hoofdthema van "Bad Piggies" speelt. De video heeft hetzelfde chaotische karakter als de vorige en is grotendeels onbegrijpelijk.',
  ghoul: 'Door AI gemaakte beelden en video\'s van een "ghoulified" Goatis, meestal mager, ondervoed en griezelig, vaak met echte audio van hem eronder. Het trekt het "Vegatis"-idee uit de gezichtsscans helemaal door.',
  bicycles: 'Verschillende AI-beelden en echte audioclips van Goatis over oude, roestige fietsen die door de maatschappij als gevaarlijk worden gezien, terwijl ze in werkelijkheid lang niet zo gevaarlijk zijn als gedacht. Bijna alle beelden draaien om een spookachtige, ondervoede versie van Goatis.',
  sonion: 'Een door AI gemaakte video van een spookachtige Goatis zonder shirt, in dit geval een Goatis-variant met meer buikvet, waarbij het minder om het ondervoede aspect draait.',
}

const s = computed(() => (nl.value ? NL : EN))
</script>

<template>
  <article class="page">
    <h1>Satire</h1>

    <p>{{ s.intro }}</p>

    <h2 class="category">Face Scan</h2>

    <p>{{ s.faceScan }}</p>

    <MediaImage src="/media/satire-ascension-scan.png" :alt="s.scanAlt" :caption="s.scanCaption" :width="689" :height="646" />

    <MediaVideo src="/media/satire-exhibit-b.mp4" :aspect="9 / 16" title="Face Scan: toxic seeds" :caption="s.chocolate" />

    <h2 class="category">Rage</h2>

    <p>{{ s.rage }}</p>

    <MediaVideo src="/media/rage-shut-up.mp4" :aspect="1" title="Rage: shut up" :caption="s.shutUp" />

    <MediaVideo src="/media/rage-crashout.mp4" :aspect="9 / 16" title="Rage: slight crashout" :caption="s.crashout" />

    <h2 class="category">Slop</h2>

    <p>{{ s.slop }}</p>

    <MediaVideo src="/media/slop-slave-food.mp4" :aspect="9 / 16" title="Slop: slave food" :caption="s.slaveFood" />

    <MediaVideo src="/media/slop-roids-part-2.mp4" :aspect="9 / 16" title="Slop: working out on roids part 2" :caption="s.roids" />

    <h2 class="category">Ghoul</h2>

    <p>{{ s.ghoul }}</p>

    <MediaVideo src="/media/ghoul-bicycles.mp4" :aspect="1" title="Ghoul: rusty bicycles" :caption="s.bicycles" />

    <MediaVideo src="/media/ghoul-sonion.mp4" :aspect="9 / 16" title="Ghoul: shirtless" :caption="s.sonion" />
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
