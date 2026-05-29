<template>
  <div class="holland-result">
    <div class="header">
      <span class="step-label">RESULTADO · PERFIS HOLLAND</span>
      <h2>SEUS <span class="hl">TOP 3</span> PERFIS</h2>
      <p class="sub">Escolha o perfil com o qual você mais se identifica para continuar sua jornada.</p>
    </div>

    <div class="profiles-grid">
      <div
        v-for="(p, i) in top3"
        :key="p.code"
        class="profile-card"
        :class="{ selected: selected === p.code, rank1: i === 0 }"
        :style="{ '--c': p.color, '--cg': p.glow }"
        @click="select(p.code)"
      >
        <div class="rank-badge">{{ i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉' }}</div>
        <div class="card-img">
          <img :src="p.image" :alt="p.name" />
        </div>
        <div class="card-body">
          <div class="card-letter">{{ p.code }}</div>
          <div class="card-info">
            <span class="card-name">{{ p.name }}</span>
            <div class="score-bar">
              <div class="score-fill" :style="{ width: `${p.percentage}%` }"></div>
            </div>
            <span class="score-text">{{ p.percentage }}% de compatibilidade</span>
            <p class="card-desc">{{ p.description }}</p>
          </div>
        </div>
        <div v-if="selected === p.code" class="selected-indicator">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          SELECIONADO
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="confirm-btn" :disabled="!selected" @click="confirm">
        <span>CONFIRMAR PERFIL</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <p class="hint">Você pode refazer o questionário depois</p>
    </div>
  </div>
</template>

<script setup>
import { profiles } from './data.js'

const props = defineProps({
  results: { type: Array, required: true }
})

const emit = defineEmits(['confirm'])

const selected = ref(null)

const top3 = computed(() => {
  return props.results
    .filter(r => r.category === 'holland')
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(r => ({
      ...r,
      ...profiles[r.code],
      percentage: Math.round(parseFloat(r.percentage))
    }))
})

function select(code) {
  selected.value = code
}

function confirm() {
  if (!selected.value) return
  const profile = profiles[selected.value]
  emit('confirm', { code: selected.value, profile })
}
</script>

<style lang="sass" scoped>
.holland-result
  width: 900px
  max-width: calc(100vw - 32px)
  max-height: calc(100vh - 48px)
  overflow-y: auto
  padding: 36px 40px
  background: linear-gradient(180deg, rgba(15,22,40,0.92), rgba(8,13,26,0.96))
  border: 1px solid rgba(245,201,122,0.25)
  border-radius: 20px
  backdrop-filter: blur(24px)
  box-shadow: 0 0 60px rgba(245,201,122,0.1), 0 24px 64px rgba(0,0,0,0.6)
  display: flex
  flex-direction: column
  gap: 28px

  &::-webkit-scrollbar
    width: 3px
  &::-webkit-scrollbar-thumb
    background: rgba(255,255,255,0.1)

.header
  text-align: center

.step-label
  font-family: var(--font-display)
  font-size: 10px
  letter-spacing: 3px
  color: var(--gold)
  opacity: 0.7

h2
  margin: 8px 0 10px
  font-family: var(--font-display)
  font-size: 32px
  font-weight: 900
  letter-spacing: 2px
  color: var(--ink-0)

  .hl
    color: var(--gold)
    text-shadow: 0 0 20px rgba(245,201,122,0.5)

.sub
  margin: 0
  color: var(--ink-2)
  font-family: var(--font-body)
  font-size: 14px

.profiles-grid
  display: grid
  grid-template-columns: repeat(3, 1fr)
  gap: 16px

.profile-card
  position: relative
  border-radius: 14px
  border: 2px solid color-mix(in srgb, var(--c) 30%, rgba(255,255,255,0.08))
  overflow: hidden
  cursor: pointer
  transition: all 0.25s
  background: linear-gradient(180deg, rgba(10,14,28,0.8), rgba(5,8,18,0.95))

  &:hover
    transform: translateY(-4px)
    border-color: color-mix(in srgb, var(--c) 60%, transparent)
    box-shadow: 0 0 24px var(--cg)

  &.selected
    border-color: var(--c)
    box-shadow: 0 0 32px var(--cg)
    transform: translateY(-4px)

  &.rank1
    .card-img img
      filter: brightness(1.05)

.rank-badge
  position: absolute
  top: 10px
  left: 10px
  font-size: 20px
  z-index: 2
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8))

.card-img
  width: 100%
  aspect-ratio: 1 / 1
  overflow: hidden

  img
    width: 100%
    height: 100%
    object-fit: cover
    object-position: top center
    display: block

.card-body
  display: flex
  align-items: center
  gap: 12px
  padding: 14px 16px
  background: rgba(5,8,18,0.95)
  border-top: 1px solid color-mix(in srgb, var(--c) 20%, transparent)

.card-letter
  font-family: var(--font-display)
  font-size: 28px
  font-weight: 900
  color: var(--c)
  text-shadow: 0 0 14px var(--cg)
  line-height: 1
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
  transition: width 0.8s ease

.score-text
  font-family: var(--font-body)
  font-size: 11px
  color: var(--ink-2)

.card-desc
  margin: 4px 0 0
  font-family: var(--font-body)
  font-size: 11px
  color: var(--ink-2)
  line-height: 1.4
  font-style: italic

.selected-indicator
  display: flex
  align-items: center
  justify-content: center
  gap: 8px
  padding: 8px
  background: color-mix(in srgb, var(--c) 15%, transparent)
  font-family: var(--font-display)
  font-size: 10px
  letter-spacing: 2px
  color: var(--c)
  border-top: 1px solid color-mix(in srgb, var(--c) 30%, transparent)

.actions
  display: flex
  flex-direction: column
  align-items: center
  gap: 10px

.confirm-btn
  display: inline-flex
  align-items: center
  gap: 12px
  padding: 14px 48px
  background: linear-gradient(180deg, rgba(245,201,122,0.22), rgba(245,201,122,0.08))
  border: 1px solid var(--gold)
  border-radius: 10px
  color: var(--gold)
  font-family: var(--font-display)
  font-weight: 700
  font-size: 13px
  letter-spacing: 2px
  cursor: pointer
  box-shadow: 0 0 24px rgba(245,201,122,0.2)
  transition: all 0.2s

  &:hover:not(:disabled)
    background: linear-gradient(180deg, rgba(245,201,122,0.38), rgba(245,201,122,0.18))
    box-shadow: 0 0 40px rgba(245,201,122,0.4)
    transform: translateY(-2px)

  &:disabled
    opacity: 0.4
    cursor: not-allowed

.hint
  margin: 0
  font-family: var(--font-body)
  font-size: 12px
  color: var(--ink-3)
</style>