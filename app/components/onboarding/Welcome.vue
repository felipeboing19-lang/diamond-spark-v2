<template>
  <div class="welcome">
    <div class="bg-glow r1"></div>
    <div class="bg-glow r2"></div>

    <!-- Header -->
    <header class="top">
      <span class="badge">PERFIS HOLLAND <span class="amp">×</span> INTELIGÊNCIAS MÚLTIPLAS</span>
      <div class="title-block">
        <h1>DESCUBRA<br><span class="hl">SEU PERFIL</span></h1>
        <p class="sub">Responda perguntas e encontre qual personagem representa você no mundo digital.</p>
      </div>
    </header>

    <!-- Cards grid -->
    <div class="cards-grid">
      <div
        v-for="(c, i) in characters"
        :key="c.letter"
        class="char-card"
        :style="{ '--c': c.color, '--cg': c.glow, '--delay': `${i * 0.08}s` }"
      >
        <div class="card-img">
          <img :src="c.image" :alt="c.name" />
          <div class="card-overlay"></div>
        </div>
        <div class="card-footer">
          <span class="card-letter">{{ c.letter }}</span>
          <div class="card-info">
            <span class="card-name">{{ c.name }}</span>
            <span class="card-speech">"{{ c.speech }}"</span>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="cta-wrap">
      <button class="start-btn" @click="$emit('start')">
        <span>COMEÇAR JORNADA</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="13 17 18 12 13 7"/>
          <polyline points="6 17 11 12 6 7"/>
        </svg>
      </button>
      <p class="hint">15 etapas · cerca de 5 minutos</p>
    </div>
  </div>
</template>

<script setup>
import { getAvatarPath } from './data.js'

defineEmits(['start'])

const { gender, loadProfile } = useProfile()

onMounted(() => loadProfile())

const baseCharacters = [
  { letter: 'R', name: 'REALISTA',      color: '#ffc14d', glow: 'rgba(255,193,77,0.6)',  index: 1, speech: 'Se quebrou, eu conserto. Se não existe, eu construo.' },
  { letter: 'I', name: 'INVESTIGATIVO', color: '#00e5ff', glow: 'rgba(0,229,255,0.6)',   index: 2, speech: 'Cada dado guarda uma resposta. Eu vou encontrá-la.' },
  { letter: 'A', name: 'ARTÍSTICO',     color: '#ff5fb1', glow: 'rgba(255,95,177,0.6)',  index: 3, speech: 'Vejo o que ninguém viu. Crio o que ninguém imaginou.' },
  { letter: 'S', name: 'SOCIAL',        color: '#3fe0a8', glow: 'rgba(63,224,168,0.6)',  index: 4, speech: 'Pessoas no centro. Sempre. O futuro é coletivo.' },
  { letter: 'E', name: 'EMPREENDEDOR',  color: '#a073ff', glow: 'rgba(160,115,255,0.6)', index: 5, speech: 'Onde os outros veem risco, eu vejo oportunidade.' },
  { letter: 'C', name: 'CONVENCIONAL',  color: '#3fb4ff', glow: 'rgba(63,180,255,0.6)',  index: 6, speech: 'Ordem, processo e precisão. É assim que se constrói.' }
]

const characters = computed(() =>
  baseCharacters.map(c => ({ ...c, image: getAvatarPath(c.index, gender.value) }))
)
</script>

<style lang="sass" scoped>
.welcome
  position: relative
  width: 100%
  min-height: 100vh
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 32px
  padding: 32px 48px 40px
  overflow: hidden

// Background glows
.bg-glow
  position: fixed
  border-radius: 50%
  filter: blur(80px)
  pointer-events: none
  z-index: 0

  &.r1
    width: 500px
    height: 500px
    top: -100px
    left: -100px
    background: rgba(42,123,255,0.12)

  &.r2
    width: 400px
    height: 400px
    bottom: -80px
    right: -80px
    background: rgba(138,92,255,0.10)

// Header
.top
  position: relative
  z-index: 1
  display: flex
  align-items: center
  gap: 48px
  width: 100%
  max-width: 1200px

.badge
  flex-shrink: 0
  font-family: var(--font-display)
  font-size: 10px
  letter-spacing: 2.5px
  color: var(--gold)
  padding: 7px 18px
  border: 1px solid rgba(245,201,122,0.35)
  border-radius: 999px
  white-space: nowrap

  .amp
    margin: 0 5px
    opacity: 0.5

.title-block
  display: flex
  align-items: baseline
  gap: 24px

h1
  margin: 0
  font-family: var(--font-display)
  font-weight: 900
  font-size: clamp(28px, 3vw, 48px)
  line-height: 1.05
  letter-spacing: 2px
  color: var(--ink-0)
  white-space: nowrap

  .hl
    color: var(--gold)
    text-shadow: 0 0 20px rgba(245,201,122,0.5)

.sub
  margin: 0
  color: var(--ink-2)
  font-family: var(--font-body)
  font-size: 14px
  line-height: 1.6
  max-width: 320px

// Cards grid
.cards-grid
  position: relative
  z-index: 1
  display: grid
  grid-template-columns: repeat(6, 1fr)
  gap: 16px
  width: 100%
  max-width: 1200px

.char-card
  position: relative
  border-radius: 16px
  overflow: hidden
  border: 1px solid color-mix(in srgb, var(--c) 35%, transparent)
  box-shadow: 0 0 20px var(--cg), 0 8px 32px rgba(0,0,0,0.4)
  cursor: pointer
  opacity: 0
  transform: translateY(20px)
  animation: card-in 0.6s ease forwards
  animation-delay: var(--delay)
  transition: transform 0.3s ease, box-shadow 0.3s ease

  &:hover
    transform: translateY(-6px) scale(1.02)
    box-shadow: 0 0 36px var(--cg), 0 16px 48px rgba(0,0,0,0.5)

    .card-overlay
      opacity: 0.3

@keyframes card-in
  to
    opacity: 1
    transform: translateY(0)

.card-img
  position: relative
  aspect-ratio: 1 / 1.2
  overflow: hidden

  img
    width: 100%
    height: 100%
    object-fit: cover
    object-position: top center
    display: block

  .card-overlay
    position: absolute
    inset: 0
    background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)
    opacity: 0
    transition: opacity 0.3s

// Gradient bottom always visible
.card-img::after
  content: ''
  position: absolute
  inset: 0
  background: linear-gradient(to bottom, transparent 50%, rgba(5,6,13,0.95) 100%)
  pointer-events: none

.card-footer
  display: flex
  align-items: center
  gap: 10px
  padding: 12px 14px
  background: rgba(5,6,13,0.95)
  border-top: 1px solid color-mix(in srgb, var(--c) 25%, transparent)

.card-letter
  font-family: var(--font-display)
  font-size: 22px
  font-weight: 900
  color: var(--c)
  text-shadow: 0 0 12px var(--cg)
  line-height: 1
  flex-shrink: 0

.card-info
  display: flex
  flex-direction: column
  gap: 2px
  overflow: hidden

.card-name
  font-family: var(--font-display)
  font-size: 9px
  letter-spacing: 2px
  color: var(--c)
  text-transform: uppercase
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.card-speech
  font-family: var(--font-body)
  font-size: 10px
  color: var(--ink-2)
  font-style: italic
  line-height: 1.3
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden

// CTA
.cta-wrap
  position: relative
  z-index: 1
  display: flex
  flex-direction: column
  align-items: center
  gap: 10px

.start-btn
  display: inline-flex
  align-items: center
  gap: 14px
  padding: 16px 48px
  background: linear-gradient(180deg, rgba(245,201,122,0.22), rgba(245,201,122,0.08))
  border: 1px solid var(--gold)
  border-radius: 10px
  color: var(--gold)
  font-family: var(--font-display)
  font-weight: 700
  font-size: 14px
  letter-spacing: 2.5px
  cursor: pointer
  box-shadow: 0 0 28px rgba(245,201,122,0.22), inset 0 0 16px rgba(245,201,122,0.06)
  transition: all 0.25s

  &:hover
    background: linear-gradient(180deg, rgba(245,201,122,0.38), rgba(245,201,122,0.18))
    box-shadow: 0 0 44px rgba(245,201,122,0.42)
    transform: translateY(-2px)

.hint
  margin: 0
  font-family: var(--font-body)
  font-size: 12px
  color: var(--ink-3)
  letter-spacing: 1px

// Mobile
@media screen and (max-width: 900px)
  .welcome
    padding: 24px 20px 32px
    gap: 24px

  .top
    flex-direction: column
    gap: 16px

  .title-block
    flex-direction: column
    gap: 8px

  .cards-grid
    grid-template-columns: repeat(3, 1fr)
    gap: 12px

  h1
    font-size: 28px

@media screen and (max-width: 480px)
  .cards-grid
    grid-template-columns: repeat(2, 1fr)
</style>
