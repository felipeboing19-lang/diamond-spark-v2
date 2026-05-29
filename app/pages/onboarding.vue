<template>
  <div class="onboarding">
    <div class="bg-stars"></div>
    <div class="bg-grid"></div>
    <div class="overlay"></div>

    <button class="audio-toggle" @click="toggleAudio">
      <svg v-if="audioPlaying" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
    </button>

    <div class="stage">
      <Transition name="slide" mode="out-in">

        <!-- 1. Boas vindas -->
        <OnbWelcome v-if="stage === 'welcome'" key="welcome" @start="start" />

        <!-- 2. Steps Holland (R,I,A,S,E,C) -->
        <OnbStep
          v-else-if="stage === 'holland' && currentStep"
          :key="`holland-${currentStepIndex}`"
          :step="currentStep"
          :questions="currentStepQuestions"
          :index="currentStepIndex"
          :total="hollandSteps.length"
          :initial-answers="answersForStep"
          @next="onStepNext"
          @back="onStepBack"
        />

        <!-- 3. Loading Holland -->
        <OnbLoading v-else-if="stage === 'loading-holland'" key="loading-h" @done="onHollandLoadingDone" />

        <!-- 4. Resultado Holland — Top 3 -->
        <OnbHollandResult
          v-else-if="stage === 'holland-result'"
          key="holland-result"
          :results="hollandResults"
          @confirm="onHollandConfirm"
        />

        <!-- 5. Tela de transição -->
        <OnbTransition
          v-else-if="stage === 'transition'"
          key="transition"
          :profile="winner"
          @continue="onTransitionContinue"
        />

        <!-- 6. Steps Inteligências -->
        <OnbStep
          v-else-if="stage === 'intelligence' && currentStep"
          :key="`intel-${currentStepIndex}`"
          :step="currentStep"
          :questions="currentStepQuestions"
          :index="currentStepIndex"
          :total="intelligenceSteps.length"
          :initial-answers="answersForStep"
          @next="onStepNext"
          @back="onStepBack"
        />

        <!-- 7. Loading Final -->
        <OnbLoading v-else-if="stage === 'loading-final'" key="loading-f" @done="onFinalLoadingDone" />

        <!-- 8. Resultado Final -->
        <OnbResult
          v-else-if="stage === 'result' && winner"
          key="result"
          :profile="winner"
          :compatibility="compatibility"
          :intelligence-code="winnerIntelligence"
          @accept="onAccept"
          @redo="onRedo"
        />

      </Transition>
    </div>

    <!-- Overlay entrada no game -->
    <Transition name="enter">
      <div v-if="entering" class="entering">
        <div class="enter-orb">
          <div class="ring r1"></div>
          <div class="ring r2"></div>
          <div class="ring r3"></div>
          <div class="core" :style="{ '--c': winner?.color || '#f5c97a', '--cg': winner?.glow || 'rgba(245,201,122,0.5)' }">
            <span>{{ winner?.letter }}</span>
          </div>
        </div>
        <h2>INICIANDO JORNADA</h2>
        <p>{{ winner?.name }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { profiles } from '~/components/onboarding/data.js'

definePageMeta({ layout: 'default', middleware: 'auth' })
useHead({ title: 'Diamond Spark — Descubra seu Perfil' })

const router = useRouter()
const supabase = useSupabaseClient()

// stage: welcome | holland | loading-holland | holland-result | transition | intelligence | loading-final | result
const stage = ref('welcome')

const allSteps = ref([])
const questionsByStep = ref({})
const answers = ref({})
const currentStepIndex = ref(0)
const currentPhase = ref('holland') // 'holland' | 'intelligence'

const hollandResults = ref([])
const winner = ref(null)
const winnerIntelligence = ref(null)
const compatibility = ref(0)
const entering = ref(false)
const userId = ref(null)

// Steps separados por categoria
const hollandSteps = computed(() => allSteps.value.filter(s => s.category === 'holland'))
const intelligenceSteps = computed(() => allSteps.value.filter(s => s.category === 'intelligence'))

const currentSteps = computed(() =>
  currentPhase.value === 'holland' ? hollandSteps.value : intelligenceSteps.value
)

const currentStep = computed(() => currentSteps.value[currentStepIndex.value])

const currentStepQuestions = computed(() =>
  currentStep.value ? (questionsByStep.value[currentStep.value.id] || []) : []
)

const answersForStep = computed(() => {
  const out = {}
  for (const q of currentStepQuestions.value) {
    if (answers.value[q.id] !== undefined) out[q.id] = answers.value[q.id]
  }
  return out
})

async function ensureUserId() {
  if (userId.value) return userId.value
  const { data } = await supabase.auth.getUser()
  if (data?.user?.id) { userId.value = data.user.id; return userId.value }
  return null
}

async function loadOnboarding() {
  const { data: stepsData } = await supabase.from('onboarding_steps').select('*').order('order_num')
  const { data: questionsData } = await supabase.from('onboarding_questions').select('*').order('order_num')
  allSteps.value = stepsData || []
  const byStep = {}
  for (const q of questionsData || []) {
    if (!byStep[q.step_id]) byStep[q.step_id] = []
    byStep[q.step_id].push(q)
  }
  questionsByStep.value = byStep
  const uid = await ensureUserId()
  if (uid) {
    const { data: prev } = await supabase.from('onboarding_responses').select('question_id, answer').eq('user_id', uid)
    const restored = {}
    for (const r of prev || []) restored[r.question_id] = r.answer
    answers.value = restored
  }
}

async function checkOnboardingDone() {
  const uid = await ensureUserId()
  if (!uid) return false
  const { data: profile } = await supabase.from('profiles').select('onboarding_done').eq('id', uid).single()
  return profile?.onboarding_done === true
}

onMounted(async () => {
  if (await checkOnboardingDone()) { window.location.href = '/game'; return }
  await loadOnboarding()
})

function start() {
  currentPhase.value = 'holland'
  currentStepIndex.value = 0
  stage.value = 'holland'
}

async function onStepNext({ answers: stepAnswers }) {
  answers.value = { ...answers.value, ...stepAnswers }
  const uid = await ensureUserId()
  if (uid) {
    const rows = Object.entries(stepAnswers)
      .filter(([, ans]) => ans !== undefined)
      .map(([qId, ans]) => ({ user_id: uid, question_id: parseInt(qId), answer: ans }))
    if (rows.length) {
      await supabase.from('onboarding_responses').upsert(rows, { onConflict: 'user_id,question_id' })
    }
  }

  const steps = currentSteps.value
  if (currentStepIndex.value < steps.length - 1) {
    currentStepIndex.value++
  } else {
    // Terminou a fase atual
    if (currentPhase.value === 'holland') {
      stage.value = 'loading-holland'
    } else {
      stage.value = 'loading-final'
    }
  }
}

function onStepBack() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  } else if (currentPhase.value === 'intelligence') {
    stage.value = 'transition'
  }
}

async function onHollandLoadingDone() {
  const uid = await ensureUserId()
  if (uid) {
    const { data: results } = await supabase.rpc('calculate_onboarding_results', { p_user_id: uid })
    if (results?.length) {
      hollandResults.value = results
      stage.value = 'holland-result'
      return
    }
  }
  stage.value = 'holland-result'
}

function onHollandConfirm({ code, profile }) {
  winner.value = profile
  compatibility.value = Math.round(
    parseFloat(hollandResults.value.find(r => r.code === code)?.percentage || 0)
  )
  if (compatibility.value < 70) compatibility.value = 70 + Math.floor(Math.random() * 20)
  stage.value = 'transition'
}

function onTransitionContinue() {
  currentPhase.value = 'intelligence'
  currentStepIndex.value = 0
  stage.value = 'intelligence'
}

async function onFinalLoadingDone() {
  const uid = await ensureUserId()
  if (uid) {
    const { data: results } = await supabase.rpc('calculate_onboarding_results', { p_user_id: uid })
    if (results?.length) {
      const intel = results.filter(r => r.category === 'intelligence').sort((a, b) => b.score - a.score)[0]
      winnerIntelligence.value = intel?.code || null
    }
  }
  stage.value = 'result'
}

async function onAccept() {
  entering.value = true
  const uid = await ensureUserId()
  if (uid && winner.value) {
    await supabase.from('profiles').update({
      riasec_profile: winner.value.letter,
      intelligence_profile: winnerIntelligence.value,
      onboarding_done: true
    }).eq('id', uid)
  }
  setTimeout(() => { window.location.href = '/game' }, 1800)
}

function onRedo() {
  winner.value = null
  currentStepIndex.value = 0
  currentPhase.value = 'holland'
  stage.value = 'welcome'
}

const audioPlaying = ref(false)
function toggleAudio() { audioPlaying.value = !audioPlaying.value }
</script>

<style lang="sass" scoped>
.onboarding
  position: relative
  width: 100vw
  min-height: 100vh
  overflow-x: hidden
  background: var(--bg-0)

.bg-stars
  position: fixed
  inset: 0
  background-image: radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.9), transparent), radial-gradient(1px 1px at 55% 65%, rgba(200,220,255,0.7), transparent), radial-gradient(1px 1px at 80% 15%, rgba(255,255,255,0.8), transparent), radial-gradient(1.5px 1.5px at 35% 80%, rgba(180,200,255,0.6), transparent)
  background-size: 600px 600px
  background-repeat: repeat
  z-index: 0
  pointer-events: none
  animation: drift 180s linear infinite

@keyframes drift
  from
    background-position: 0 0
  to
    background-position: 600px 600px

.bg-grid
  position: fixed
  inset: 0
  background-image: linear-gradient(rgba(63,180,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(63,180,255,0.03) 1px, transparent 1px)
  background-size: 80px 80px
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%)
  z-index: 0
  pointer-events: none

.overlay
  position: fixed
  inset: 0
  background: radial-gradient(ellipse at 20% 10%, rgba(42,123,255,0.08) 0%, transparent 45%), radial-gradient(ellipse at 85% 30%, rgba(138,92,255,0.06) 0%, transparent 45%)
  z-index: 0
  pointer-events: none

.audio-toggle
  position: fixed
  top: 20px
  right: 20px
  z-index: 50
  width: 36px
  height: 36px
  border-radius: 50%
  background: rgba(10,14,31,0.7)
  border: 1px solid rgba(245,201,122,0.3)
  color: var(--gold)
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  backdrop-filter: blur(8px)
  transition: all 0.2s

  &:hover
    background: rgba(245,201,122,0.15)

.stage
  position: relative
  z-index: 3
  width: 100%
  min-height: 100vh
  display: flex
  align-items: center
  justify-content: center
  padding: 32px

.slide-enter-active, .slide-leave-active
  transition: opacity 0.4s ease, transform 0.4s ease

.slide-enter-from
  opacity: 0
  transform: translateY(20px)

.slide-leave-to
  opacity: 0
  transform: translateY(-20px)

.entering
  position: fixed
  inset: 0
  z-index: 100
  background: radial-gradient(ellipse at center, rgba(10,14,31,0.97), rgba(5,6,13,1))
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 20px
  color: var(--ink-0)
  font-family: var(--font-display)

.enter-orb
  position: relative
  width: 160px
  height: 160px

.ring
  position: absolute
  inset: 0
  border-radius: 50%
  border: 2px solid var(--gold)
  animation: ring-pulse 1.4s ease-out infinite

  &.r2
    animation-delay: 0.3s
  &.r3
    animation-delay: 0.6s

@keyframes ring-pulse
  0%
    transform: scale(0.3)
    opacity: 0.9
  100%
    transform: scale(1.4)
    opacity: 0

.core
  position: absolute
  inset: 45px
  border-radius: 50%
  background: radial-gradient(circle at 30% 30%, var(--c, var(--gold)), rgba(0,0,0,0.6))
  border: 2px solid var(--c, var(--gold))
  box-shadow: 0 0 30px var(--cg, rgba(245,201,122,0.5))
  display: flex
  align-items: center
  justify-content: center
  animation: core-pop 1.2s ease

  span
    font-family: var(--font-display)
    font-size: 30px
    font-weight: 900
    color: #fff

@keyframes core-pop
  0%
    transform: scale(0.5)
    opacity: 0
  50%
    transform: scale(1.1)
  100%
    transform: scale(1)
    opacity: 1

.entering h2
  margin: 0
  font-size: 20px
  letter-spacing: 4px
  color: var(--gold)

.entering p
  margin: 0
  font-size: 14px
  letter-spacing: 2px
  color: var(--ink-2)

.enter-enter-active
  transition: opacity 0.4s ease
.enter-enter-from
  opacity: 0

@media screen and (max-width: 640px)
  .stage
    align-items: flex-start
    padding: 16px
</style>
