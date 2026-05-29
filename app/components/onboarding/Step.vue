<template>
  <div class="step" :style="{ '--c': step.color, '--cg': hexToGlow(step.color) }">
    <span class="corner tl"></span><span class="corner tr"></span>
    <span class="corner bl"></span><span class="corner br"></span>

    <!-- Aura orb -->
    <div class="aura-wrap" v-if="showAuraEffect">
      <div class="aura-ring" v-for="n in 3" :key="n" :style="{ animationDelay: `${(n-1) * 0.2}s` }"></div>
      <div class="aura-core">
        <span class="aura-text">+AURA</span>
        <span class="aura-xp">+{{ lastXp }}</span>
      </div>
    </div>

    <!-- Barra de aura total -->
    <div class="aura-bar-wrap">
      <div class="aura-bar-label">
        <span class="aura-icon">✦</span>
        <span>AURA</span>
        <span class="aura-total">{{ totalAura }}</span>
      </div>
      <div class="aura-bar">
        <div class="aura-fill" :style="{ width: `${auraPercent}%`, background: `linear-gradient(90deg, ${step.color}, ${step.color}88)` }"></div>
        <div class="aura-particles">
          <span v-for="p in auraParticles" :key="p.id" class="aura-particle" :style="{ left: p.x + '%', animationDelay: p.delay + 's', color: step.color }">✦</span>
        </div>
      </div>
    </div>

    <header>
      <div class="step-info">
        <span class="step-num">ETAPA {{ String(index + 1).padStart(2, '0') }} / {{ String(total).padStart(2, '0') }}</span>
        <h2>{{ step.title }}</h2>
        <p>{{ step.description }}</p>
      </div>
      <div class="counter" :class="{ active: answeredCount > 0 }">
        <span class="num">{{ answeredCount }}</span>
        <span class="sep">/</span>
        <span class="den">{{ questions.length }}</span>
      </div>
    </header>

    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${((index + 1) / total) * 100}%` }"></div>
    </div>

    <p class="instruction">Marque as frases que <strong>combinam com você</strong>.</p>

    <ul class="q-list">
      <li
        v-for="(q, i) in questions"
        :key="q.id"
        :class="{ checked: answers[q.id] === true }"
        @click="toggle(q.id)"
      >
        <div class="q-row">
          <span class="q-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <p class="q-text">{{ q.text }}</p>
          <div class="checkbox" :class="{ checked: answers[q.id] === true }">
            <svg v-if="answers[q.id] === true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
      </li>
    </ul>

    <div v-if="showMinError" class="min-error">
      ⚠ Marque pelo menos <strong>1 frase</strong> para continuar.
    </div>

    <footer>
      <button v-if="index > 0" class="back-btn" @click="$emit('back')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        ANTERIOR
      </button>
      <span v-else></span>
      <span class="hint">{{ answeredCount }} de {{ questions.length }} marcadas</span>
      <button class="next-btn" @click="tryNext">
        <span>{{ index === total - 1 ? 'CONCLUIR' : 'PRÓXIMA ETAPA' }}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </footer>
  </div>
</template>

<script setup>
const props = defineProps({
  step: { type: Object, required: true },
  questions: { type: Array, required: true },
  index: { type: Number, required: true },
  total: { type: Number, required: true },
  initialAnswers: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['next', 'back'])

const answers = ref({ ...props.initialAnswers })
const showMinError = ref(false)

const answeredCount = computed(() =>
  Object.values(answers.value).filter(v => v === true).length
)

// Aura system
const totalAura = ref(0)
const showAuraEffect = ref(false)
const lastXp = ref(0)
const auraParticles = ref([])
let particleId = 0
let auraTimer = null

const auraPercent = computed(() => Math.min((totalAura.value % 100), 100))

function triggerAura() {
  const xp = Math.floor(Math.random() * 15) + 10
  lastXp.value = xp
  totalAura.value += xp
  showAuraEffect.value = true

  // Adicionar partícula na barra
  const p = { id: particleId++, x: auraPercent.value, delay: 0 }
  auraParticles.value.push(p)
  setTimeout(() => {
    auraParticles.value = auraParticles.value.filter(ap => ap.id !== p.id)
  }, 1200)

  clearTimeout(auraTimer)
  auraTimer = setTimeout(() => { showAuraEffect.value = false }, 1200)
}

function toggle(questionId) {
  const current = answers.value[questionId]
  const newVal = current ? undefined : true
  answers.value = { ...answers.value, [questionId]: newVal }
  if (showMinError.value && answeredCount.value > 0) showMinError.value = false
  if (newVal === true) triggerAura()
}

function tryNext() {
  if (answeredCount.value === 0) { showMinError.value = true; return }
  emit('next', { answers: answers.value, textAnswers: {} })
}

function hexToGlow(hex) {
  const h = (hex || '#3fb4ff').replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, 0.45)`
}
</script>

<style lang="sass" scoped>
.step
  position: relative
  width: 780px
  max-width: calc(100vw - 32px)
  max-height: calc(100vh - 64px)
  padding: 28px 36px
  background: linear-gradient(180deg, rgba(15,22,40,0.88), rgba(8,13,26,0.95))
  border: 1px solid color-mix(in srgb, var(--c) 30%, rgba(255,255,255,0.08))
  border-radius: 16px
  backdrop-filter: blur(20px)
  display: flex
  flex-direction: column
  gap: 14px
  font-family: var(--font-body)
  box-shadow: 0 0 48px var(--cg), 0 24px 64px rgba(0,0,0,0.5)

.corner
  position: absolute
  width: 18px
  height: 18px
  border-color: var(--c)
  border-style: solid
  border-width: 0

.tl
  top: -1px
  left: -1px
  border-top-width: 2px
  border-left-width: 2px
  border-top-left-radius: 8px
.tr
  top: -1px
  right: -1px
  border-top-width: 2px
  border-right-width: 2px
  border-top-right-radius: 8px
.bl
  bottom: -1px
  left: -1px
  border-bottom-width: 2px
  border-left-width: 2px
  border-bottom-left-radius: 8px
.br
  bottom: -1px
  right: -1px
  border-bottom-width: 2px
  border-right-width: 2px
  border-bottom-right-radius: 8px

header
  position: relative
  z-index: 1
  display: flex
  justify-content: space-between
  align-items: flex-start
  gap: 20px

.step-num
  font-family: var(--font-display)
  font-size: 10px
  letter-spacing: 2.5px
  color: var(--c)
  display: block
  margin-bottom: 4px

h2
  margin: 0 0 3px
  font-family: var(--font-display)
  font-size: 22px
  font-weight: 700
  color: var(--ink-0)
  text-shadow: 0 0 12px var(--cg)

.step-info p
  margin: 0
  color: var(--ink-2)
  font-size: 12px

.counter
  display: flex
  align-items: baseline
  gap: 3px
  padding: 8px 14px
  background: rgba(0,0,0,0.4)
  border: 1px solid rgba(255,255,255,0.08)
  border-radius: 10px
  transition: all 0.3s
  flex-shrink: 0

  &.active
    border-color: color-mix(in srgb, var(--c) 60%, transparent)
    box-shadow: 0 0 12px var(--cg)

  .num
    font-family: var(--font-display)
    font-size: 22px
    font-weight: 800
    color: var(--c)

  .sep, .den
    font-family: var(--font-display)
    font-size: 13px
    color: var(--ink-3)

.progress-bar
  position: relative
  z-index: 1
  height: 3px
  background: rgba(255,255,255,0.05)
  border-radius: 2px
  overflow: hidden

.progress-fill
  height: 100%
  background: var(--c)
  box-shadow: 0 0 8px var(--cg)
  transition: width 0.4s ease

.instruction
  position: relative
  z-index: 1
  margin: 0
  font-size: 12px
  color: var(--ink-3)
  font-style: italic

  strong
    color: var(--ink-1)
    font-style: normal

.q-list
  position: relative
  z-index: 1
  list-style: none
  margin: 0
  padding: 0 4px 0 0
  flex: 1
  overflow-y: auto
  display: flex
  flex-direction: column
  gap: 6px

  &::-webkit-scrollbar
    width: 3px
  &::-webkit-scrollbar-thumb
    background: rgba(255,255,255,0.1)
    border-radius: 2px

  li
    padding: 12px 16px
    background: rgba(0,0,0,0.2)
    border: 1px solid rgba(255,255,255,0.06)
    border-radius: 10px
    cursor: pointer
    transition: all 0.2s

    &:hover
      background: color-mix(in srgb, var(--c) 6%, rgba(0,0,0,0.3))
      border-color: color-mix(in srgb, var(--c) 30%, transparent)

    &.checked
      background: color-mix(in srgb, var(--c) 10%, rgba(0,0,0,0.3))
      border-color: color-mix(in srgb, var(--c) 55%, transparent)
      box-shadow: 0 0 10px var(--cg)

.q-row
  display: grid
  grid-template-columns: 28px 1fr 28px
  align-items: center
  gap: 12px

.q-num
  font-family: var(--font-display)
  font-size: 10px
  font-weight: 700
  color: var(--ink-3)

.q-text
  margin: 0
  font-size: 14px
  line-height: 1.4
  color: var(--ink-0)
  font-family: var(--font-body)

.checkbox
  width: 24px
  height: 24px
  border-radius: 6px
  border: 2px solid rgba(255,255,255,0.15)
  display: flex
  align-items: center
  justify-content: center
  transition: all 0.2s
  flex-shrink: 0

  &.checked
    background: var(--c)
    border-color: var(--c)
    box-shadow: 0 0 10px var(--cg)
    color: #05060d

// Aura orb effect
.aura-wrap
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  z-index: 20
  display: flex
  align-items: center
  justify-content: center
  pointer-events: none
  animation: aura-pop 1.2s ease forwards

@keyframes aura-pop
  0%
    opacity: 0
    transform: translate(-50%, -50%) scale(0.5)
  20%
    opacity: 1
    transform: translate(-50%, -50%) scale(1.1)
  60%
    opacity: 1
    transform: translate(-50%, -50%) scale(1)
  100%
    opacity: 0
    transform: translate(-50%, -60%) scale(0.9)

.aura-ring
  position: absolute
  width: 120px
  height: 120px
  border-radius: 50%
  border: 2px solid var(--c)
  animation: aura-ring-out 1.2s ease forwards
  animation-delay: var(--delay)

@keyframes aura-ring-out
  0%
    transform: scale(0.3)
    opacity: 0.9
  100%
    transform: scale(2)
    opacity: 0

.aura-core
  position: relative
  z-index: 1
  display: flex
  flex-direction: column
  align-items: center
  gap: 2px
  padding: 14px 20px
  background: rgba(5,6,13,0.85)
  border: 1px solid var(--c)
  border-radius: 12px
  box-shadow: 0 0 24px var(--cg)

.aura-text
  font-family: var(--font-display)
  font-size: 11px
  letter-spacing: 3px
  color: var(--c)

.aura-xp
  font-family: var(--font-display)
  font-size: 28px
  font-weight: 900
  color: var(--c)
  text-shadow: 0 0 16px var(--cg)

// Barra de aura
.aura-bar-wrap
  position: relative
  z-index: 1
  display: flex
  flex-direction: column
  gap: 5px

.aura-bar-label
  display: flex
  align-items: center
  gap: 6px
  font-family: var(--font-display)
  font-size: 10px
  letter-spacing: 2px
  color: var(--c)

.aura-icon
  animation: spin 4s linear infinite

@keyframes spin
  from
    transform: rotate(0deg)
  to
    transform: rotate(360deg)

.aura-total
  margin-left: auto
  font-size: 11px
  color: var(--ink-2)

.aura-bar
  position: relative
  height: 6px
  background: rgba(255,255,255,0.05)
  border-radius: 3px
  overflow: visible
  border: 1px solid rgba(255,255,255,0.06)

.aura-fill
  height: 100%
  border-radius: 3px
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)
  box-shadow: 0 0 8px var(--cg)
  position: relative

  &::after
    content: ''
    position: absolute
    right: -1px
    top: -2px
    width: 10px
    height: 10px
    border-radius: 50%
    background: var(--c)
    box-shadow: 0 0 10px var(--cg), 0 0 20px var(--cg)

.aura-particles
  position: absolute
  inset: 0
  pointer-events: none

.aura-particle
  position: absolute
  top: -6px
  font-size: 10px
  animation: particle-float 1.2s ease forwards

@keyframes particle-float
  0%
    transform: translateY(0) scale(1)
    opacity: 1
  100%
    transform: translateY(-20px) scale(0.5)
    opacity: 0

.min-error
  padding: 10px 14px
  background: rgba(255,107,139,0.1)
  border: 1px solid rgba(255,107,139,0.3)
  border-radius: 8px
  color: #ff6b8b
  font-size: 13px
  text-align: center

  strong
    color: #ff8fa3

footer
  position: relative
  z-index: 1
  display: grid
  grid-template-columns: 1fr auto 1fr
  align-items: center
  gap: 12px
  padding-top: 10px
  border-top: 1px solid rgba(255,255,255,0.05)

.back-btn
  justify-self: start
  display: inline-flex
  align-items: center
  gap: 6px
  padding: 9px 16px
  background: transparent
  border: 1px solid rgba(255,255,255,0.08)
  border-radius: 8px
  color: var(--ink-3)
  font-family: var(--font-display)
  font-size: 10px
  font-weight: 700
  letter-spacing: 1.5px
  cursor: pointer
  transition: all 0.2s

  &:hover
    border-color: rgba(255,255,255,0.2)
    color: var(--ink-1)

.hint
  font-size: 11px
  color: var(--ink-3)
  text-align: center
  font-family: var(--font-display)
  letter-spacing: 1px

.next-btn
  justify-self: end
  display: inline-flex
  align-items: center
  gap: 8px
  padding: 10px 22px
  background: color-mix(in srgb, var(--c) 12%, rgba(0,0,0,0.4))
  border: 1px solid var(--c)
  border-radius: 8px
  color: var(--c)
  font-family: var(--font-display)
  font-size: 11px
  font-weight: 700
  letter-spacing: 1.5px
  cursor: pointer
  box-shadow: 0 0 14px var(--cg)
  transition: all 0.2s

  &:hover
    background: color-mix(in srgb, var(--c) 22%, rgba(0,0,0,0.3))
    box-shadow: 0 0 24px var(--cg)
    transform: translateY(-1px)
</style>