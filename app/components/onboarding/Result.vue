<template>
  <div class="result" :style="{ '--c': profile.color, '--cg': profile.glow }">

    <div class="badge-top">RESULTADO DA SUA JORNADA</div>

    <div class="main-layout">
      <!-- Card do personagem -->
      <div class="char-card">
        <div class="card-img">
          <img :src="avatarImage" :alt="profile.name" @error="onImgError" />
          <div class="card-gradient"></div>
        </div>
        <div class="card-footer">
          <span class="card-letter">{{ profile.letter }}</span>
          <div class="card-info">
            <span class="card-name">{{ profile.name }}</span>
            <div class="score-bar">
              <div class="score-fill" :style="{ width: `${compatibility}%` }"></div>
            </div>
            <span class="score-text">{{ compatibility }}% de compatibilidade</span>
          </div>
        </div>
      </div>

      <!-- Informações -->
      <div class="info-col">
        <div class="speech-block">
          <p class="speech">"{{ profile.speech }}"</p>
        </div>

        <p class="description">{{ profile.description }}</p>

        <div class="section">
          <h3>ÁREAS DE ATUAÇÃO</h3>
          <div class="careers">
            <span v-for="c in profile.careers" :key="c" class="career-tag">{{ c }}</span>
          </div>
        </div>

        <div v-if="intelligence" class="section">
          <h3>INTELIGÊNCIA PREDOMINANTE</h3>
          <div class="intel-card" :style="{ '--ic': intelligence.color }">
            <span class="intel-name">{{ intelligence.name }}</span>
            <p>{{ intelligence.description }}</p>
          </div>
        </div>

        <div class="actions">
          <button class="redo-btn" @click="$emit('redo')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
            REFAZER
          </button>
          <button class="accept-btn" @click="$emit('accept')">
            <span>ACEITAR ESTE PERFIL</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { intelligences, getAvatarPath } from './data.js'

const props = defineProps({
  profile: { type: Object, required: true },
  compatibility: { type: Number, default: 85 },
  intelligenceCode: { type: String, default: null }
})

defineEmits(['accept', 'redo'])

const { gender, loadProfile } = useProfile()
onMounted(() => loadProfile())

const avatarImage = computed(() =>
  getAvatarPath(props.profile?.avatarIndex || 1, gender.value)
)

const intelligence = computed(() =>
  props.intelligenceCode ? intelligences[props.intelligenceCode] : null
)

function onImgError(e) {
  e.target.style.display = 'none'
}
</script>

<style lang="sass" scoped>
.result
  position: relative
  width: 920px
  max-width: calc(100vw - 32px)
  max-height: calc(100vh - 48px)
  overflow-y: auto
  padding: 32px 36px
  background: linear-gradient(180deg, rgba(15,22,40,0.92), rgba(8,13,26,0.96))
  border: 1px solid color-mix(in srgb, var(--c) 30%, rgba(255,255,255,0.08))
  border-radius: 20px
  backdrop-filter: blur(24px)
  box-shadow: 0 0 60px var(--cg), 0 24px 64px rgba(0,0,0,0.6)
  display: flex
  flex-direction: column
  gap: 24px

  &::-webkit-scrollbar
    width: 3px
  &::-webkit-scrollbar-thumb
    background: rgba(255,255,255,0.1)

.badge-top
  font-family: var(--font-display)
  font-size: 10px
  letter-spacing: 3px
  color: var(--gold)
  text-align: center
  opacity: 0.8

.main-layout
  display: grid
  grid-template-columns: 280px 1fr
  gap: 28px
  align-items: start

// Card do personagem
.char-card
  border-radius: 16px
  overflow: hidden
  border: 2px solid color-mix(in srgb, var(--c) 50%, transparent)
  box-shadow: 0 0 30px var(--cg)

.card-img
  position: relative
  aspect-ratio: 3 / 4
  overflow: hidden

  img
    width: 100%
    height: 100%
    object-fit: cover
    object-position: top center
    display: block

  .card-gradient
    position: absolute
    inset: 0
    background: linear-gradient(to bottom, transparent 50%, rgba(5,8,18,0.98) 100%)

.card-footer
  display: flex
  align-items: center
  gap: 12px
  padding: 14px 16px
  background: rgba(5,8,18,0.98)
  border-top: 1px solid color-mix(in srgb, var(--c) 25%, transparent)

.card-letter
  font-family: var(--font-display)
  font-size: 28px
  font-weight: 900
  color: var(--c)
  text-shadow: 0 0 12px var(--cg)
  flex-shrink: 0

.card-info
  flex: 1
  display: flex
  flex-direction: column
  gap: 5px

.card-name
  font-family: var(--font-display)
  font-size: 10px
  letter-spacing: 2px
  color: var(--c)

.score-bar
  height: 4px
  background: rgba(255,255,255,0.08)
  border-radius: 2px
  overflow: hidden

.score-fill
  height: 100%
  background: var(--c)
  box-shadow: 0 0 6px var(--cg)
  border-radius: 2px
  transition: width 1s ease

.score-text
  font-family: var(--font-body)
  font-size: 11px
  color: var(--ink-2)

// Coluna de info
.info-col
  display: flex
  flex-direction: column
  gap: 18px

.speech-block
  padding: 16px 20px
  background: color-mix(in srgb, var(--c) 6%, rgba(0,0,0,0.3))
  border-left: 3px solid var(--c)
  border-radius: 0 10px 10px 0

.speech
  margin: 0
  font-family: var(--font-body)
  font-size: 16px
  font-style: italic
  color: var(--ink-0)
  line-height: 1.6

.description
  margin: 0
  font-family: var(--font-body)
  font-size: 14px
  color: var(--ink-1)
  line-height: 1.7

.section
  display: flex
  flex-direction: column
  gap: 10px

  h3
    font-family: var(--font-display)
    font-size: 10px
    letter-spacing: 2.5px
    color: var(--ink-3)
    margin: 0

.careers
  display: flex
  flex-wrap: wrap
  gap: 8px

.career-tag
  padding: 5px 14px
  background: color-mix(in srgb, var(--c) 10%, transparent)
  border: 1px solid color-mix(in srgb, var(--c) 35%, transparent)
  border-radius: 999px
  font-family: var(--font-display)
  font-size: 10px
  letter-spacing: 1px
  color: var(--c)

.intel-card
  padding: 14px 16px
  background: color-mix(in srgb, var(--ic, var(--c)) 8%, rgba(0,0,0,0.3))
  border: 1px solid color-mix(in srgb, var(--ic, var(--c)) 35%, transparent)
  border-radius: 10px

  .intel-name
    font-family: var(--font-display)
    font-size: 13px
    font-weight: 700
    color: var(--ic, var(--c))
    display: block
    margin-bottom: 6px

  p
    margin: 0
    color: var(--ink-2)
    font-size: 13px
    font-family: var(--font-body)

.actions
  display: flex
  gap: 12px
  justify-content: flex-end
  padding-top: 8px
  border-top: 1px solid rgba(255,255,255,0.06)
  margin-top: auto

.redo-btn
  display: inline-flex
  align-items: center
  gap: 8px
  padding: 10px 18px
  background: transparent
  border: 1px solid rgba(255,255,255,0.1)
  border-radius: 8px
  color: var(--ink-2)
  font-family: var(--font-display)
  font-size: 10px
  letter-spacing: 1.5px
  cursor: pointer
  transition: all 0.2s

  &:hover
    border-color: rgba(255,255,255,0.25)
    color: var(--ink-0)

.accept-btn
  display: inline-flex
  align-items: center
  gap: 10px
  padding: 12px 28px
  background: linear-gradient(180deg, color-mix(in srgb, var(--c) 25%, transparent), color-mix(in srgb, var(--c) 10%, transparent))
  border: 1px solid var(--c)
  border-radius: 8px
  color: var(--c)
  font-family: var(--font-display)
  font-size: 11px
  font-weight: 700
  letter-spacing: 1.5px
  cursor: pointer
  box-shadow: 0 0 16px var(--cg)
  transition: all 0.2s

  &:hover
    box-shadow: 0 0 28px var(--cg)
    transform: translateY(-1px)

@media screen and (max-width: 640px)
  .main-layout
    grid-template-columns: 1fr
  
  .char-card
    max-width: 240px
    margin: 0 auto
</style>