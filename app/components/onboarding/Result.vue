<template>
  <div class="result" :style="{ '--c': profile.color, '--cg': profile.glow }">
    <span class="corner tl"></span><span class="corner tr"></span>
    <span class="corner bl"></span><span class="corner br"></span>

    <div class="badge-top">RESULTADO DA SUA JORNADA</div>

    <div class="profile-block">
      <div class="avatar">
        <img :src="profile.image" :alt="profile.name" @error="onImgError" />
        <span class="letter-badge">{{ profile.letter }}</span>
      </div>
      <div class="profile-info">
        <span class="compat">{{ compatibility }}% DE COMPATIBILIDADE</span>
        <h2>{{ profile.name }}</h2>
        <span class="role">{{ profile.role }}</span>
        <p class="speech">"{{ profile.speech }}"</p>
      </div>
    </div>

    <p class="description">{{ profile.description }}</p>

    <div class="section">
      <h3>ÁREAS DE ATUAÇÃO EM TECNOLOGIA</h3>
      <div class="careers">
        <span v-for="c in profile.careers" :key="c" class="career-tag">{{ c }}</span>
      </div>
    </div>

    <div v-if="intelligence" class="section intel-section">
      <h3>SUA INTELIGÊNCIA PREDOMINANTE</h3>
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
</template>

<script setup>
import { intelligences } from './data.js'

const props = defineProps({
  profile: { type: Object, required: true },
  compatibility: { type: Number, default: 85 },
  intelligenceCode: { type: String, default: null }
})

defineEmits(['accept', 'redo'])

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
  width: 680px
  max-width: calc(100vw - 32px)
  max-height: calc(100vh - 64px)
  overflow-y: auto
  padding: 36px 40px
  background: linear-gradient(180deg, rgba(20,28,60,0.88), rgba(10,14,31,0.95))
  border: 1px solid rgba(255,255,255,0.08)
  border-radius: 20px
  backdrop-filter: blur(20px)
  font-family: 'Rajdhani', sans-serif
  box-shadow: 0 0 60px var(--cg)

  &::-webkit-scrollbar
    width: 3px
  &::-webkit-scrollbar-thumb
    background: rgba(255,255,255,0.1)

.corner
  position: absolute
  width: 20px
  height: 20px
  border-color: var(--c)
  border-style: solid
  border-width: 0

.tl
  top: -1px
  left: -1px
  border-top-width: 2px
  border-left-width: 2px
  border-top-left-radius: 10px
.tr
  top: -1px
  right: -1px
  border-top-width: 2px
  border-right-width: 2px
  border-top-right-radius: 10px
.bl
  bottom: -1px
  left: -1px
  border-bottom-width: 2px
  border-left-width: 2px
  border-bottom-left-radius: 10px
.br
  bottom: -1px
  right: -1px
  border-bottom-width: 2px
  border-right-width: 2px
  border-bottom-right-radius: 10px

.badge-top
  font-family: 'Orbitron', sans-serif
  font-size: 10px
  letter-spacing: 3px
  color: var(--gold)
  text-align: center
  margin-bottom: 24px
  opacity: 0.8

.profile-block
  display: flex
  gap: 24px
  align-items: center
  margin-bottom: 20px

.avatar
  position: relative
  width: 120px
  height: 120px
  border-radius: 50%
  border: 3px solid var(--c)
  overflow: hidden
  flex-shrink: 0
  box-shadow: 0 0 30px var(--cg)
  background: linear-gradient(135deg, rgba(10,14,31,0.9), rgba(5,6,13,1))

  img
    width: 100%
    height: 100%
    object-fit: cover

.letter-badge
  position: absolute
  inset: 0
  display: flex
  align-items: center
  justify-content: center
  font-family: 'Cinzel', serif
  font-size: 36px
  font-weight: 700
  color: var(--c)
  text-shadow: 0 0 16px var(--cg)

.compat
  font-family: 'Orbitron', sans-serif
  font-size: 10px
  letter-spacing: 2px
  color: var(--c)
  display: block
  margin-bottom: 6px

h2
  margin: 0 0 4px
  font-family: 'Cinzel', serif
  font-size: 28px
  font-weight: 700
  color: var(--ink-0)
  text-shadow: 0 0 12px var(--cg)

.role
  display: block
  font-family: 'Orbitron', sans-serif
  font-size: 11px
  letter-spacing: 2px
  color: var(--c)
  margin-bottom: 10px

.speech
  margin: 0
  font-style: italic
  color: var(--ink-2)
  font-size: 14px
  line-height: 1.5

.description
  color: var(--ink-1)
  font-size: 14px
  line-height: 1.6
  margin-bottom: 20px
  padding: 16px
  background: rgba(0,0,0,0.2)
  border-radius: 10px
  border-left: 3px solid var(--c)

.section
  margin-bottom: 20px

  h3
    font-family: 'Orbitron', sans-serif
    font-size: 10px
    letter-spacing: 2.5px
    color: var(--ink-2)
    margin-bottom: 12px

.careers
  display: flex
  flex-wrap: wrap
  gap: 8px

.career-tag
  padding: 5px 12px
  background: color-mix(in srgb, var(--c) 12%, transparent)
  border: 1px solid color-mix(in srgb, var(--c) 40%, transparent)
  border-radius: 999px
  font-family: 'Orbitron', sans-serif
  font-size: 10px
  letter-spacing: 1px
  color: var(--c)

.intel-section
  .intel-card
    padding: 14px 16px
    background: color-mix(in srgb, var(--ic, var(--c)) 8%, rgba(0,0,0,0.3))
    border: 1px solid color-mix(in srgb, var(--ic, var(--c)) 35%, transparent)
    border-radius: 10px

    .intel-name
      font-family: 'Orbitron', sans-serif
      font-size: 13px
      font-weight: 700
      color: var(--ic, var(--c))
      display: block
      margin-bottom: 6px

    p
      margin: 0
      color: var(--ink-2)
      font-size: 13px

.actions
  display: flex
  gap: 12px
  justify-content: flex-end
  padding-top: 8px
  border-top: 1px solid rgba(255,255,255,0.06)

.redo-btn
  display: inline-flex
  align-items: center
  gap: 8px
  padding: 10px 18px
  background: transparent
  border: 1px solid rgba(255,255,255,0.1)
  border-radius: 8px
  color: var(--ink-2)
  font-family: 'Orbitron', sans-serif
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
  padding: 12px 24px
  background: linear-gradient(180deg, color-mix(in srgb, var(--c) 25%, transparent), color-mix(in srgb, var(--c) 10%, transparent))
  border: 1px solid var(--c)
  border-radius: 8px
  color: var(--c)
  font-family: 'Orbitron', sans-serif
  font-size: 11px
  font-weight: 700
  letter-spacing: 1.5px
  cursor: pointer
  box-shadow: 0 0 16px var(--cg)
  transition: all 0.2s

  &:hover
    box-shadow: 0 0 28px var(--cg)
    transform: translateY(-1px)
</style>
