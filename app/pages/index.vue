<template>
  <div class="login-page">
    <div class="bg-stars"></div>
    <div class="bg-grid"></div>
    <div class="bg-glow g1"></div>
    <div class="bg-glow g2"></div>
    <div class="bg-glow g3"></div>

    <!-- Partículas flutuantes -->
    <div class="particles">
      <span v-for="i in 12" :key="i" class="particle" :style="particleStyle(i)">{{ particleSyms[i % particleSyms.length] }}</span>
    </div>

    <div class="login-wrap">
      <!-- Logo -->
      <div class="brand">
        <div class="brand-diamond">◆</div>
        <div class="brand-text">
          <span class="brand-name">DIAMOND SPARK</span>
          <span class="brand-sub">Plataforma Educacional</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button :class="{ active: tab === 'login' }" @click="tab = 'login'">ENTRAR</button>
        <button :class="{ active: tab === 'register' }" @click="tab = 'register'">CADASTRAR</button>
      </div>

      <!-- LOGIN -->
      <Transition name="fade" mode="out-in">
        <div v-if="tab === 'login'" key="login" class="form">
          <div class="field">
            <label>E-MAIL</label>
            <input v-model="email" type="email" placeholder="seu@email.com" @keyup.enter="handleLogin" />
          </div>
          <div class="field">
            <label>SENHA</label>
            <input v-model="password" type="password" placeholder="••••••••" @keyup.enter="handleLogin" />
          </div>
          <p v-if="error" class="error">{{ error }}</p>
          <button class="submit-btn" :disabled="loading" @click="handleLogin">
            <span>{{ loading ? 'AGUARDE...' : 'ENTRAR' }}</span>
            <svg v-if="!loading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <!-- CADASTRO -->
        <div v-else key="register" class="form">
          <div class="field">
            <label>NOME</label>
            <input v-model="name" type="text" placeholder="Seu nome completo" />
          </div>

          <div class="field">
            <label>TIPO DE CONTA</label>
            <div class="role-picker">
              <button v-for="r in roles" :key="r.value" :class="['role-btn', { active: role === r.value }]" @click="role = r.value">
                <span class="role-icon">{{ r.icon }}</span>
                <span>{{ r.label }}</span>
              </button>
            </div>
          </div>

          <div class="field">
            <label>COMO VOCÊ SE IDENTIFICA</label>
            <div class="gender-picker">
              <button
                v-for="g in genders"
                :key="g.value"
                :class="['gender-btn', { active: gender === g.value }]"
                :style="{ '--gc': g.color }"
                @click="gender = g.value"
              >
                <span class="gender-icon">{{ g.icon }}</span>
                <span class="gender-label">{{ g.label }}</span>
                <span v-if="gender === g.value" class="gender-check">✓</span>
              </button>
            </div>
          </div>

          <div class="field">
            <label>E-MAIL</label>
            <input v-model="email" type="email" placeholder="seu@email.com" />
          </div>
          <div class="field">
            <label>SENHA</label>
            <input v-model="password" type="password" placeholder="Mínimo 6 caracteres" />
          </div>

          <p v-if="error" class="error">{{ error }}</p>
          <button class="submit-btn" :disabled="loading" @click="handleRegister">
            <span>{{ loading ? 'AGUARDE...' : 'CADASTRAR' }}</span>
            <svg v-if="!loading" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </Transition>

      <p class="footer-text">© 2026 Diamond Spark · Design for Change</p>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const router = useRouter()

const tab = ref('login')
const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('aluno')
const gender = ref('neutral')
const error = ref('')
const loading = ref(false)

const particleSyms = ['◆', '✦', '◈', '⬡', '❋', '✿', '⊕', '▲', '★', '◇', '⬟', '❖']

function particleStyle(i) {
  const colors = ['#ffc14d','#00e5ff','#ff5fb1','#3fe0a8','#a073ff','#3fb4ff']
  return {
    '--pc': colors[i % colors.length],
    left: `${(i * 8.3) % 100}%`,
    top: `${(i * 13.7) % 100}%`,
    animationDelay: `${i * 0.7}s`,
    animationDuration: `${8 + (i % 5)}s`,
    fontSize: `${12 + (i % 3) * 6}px`,
  }
}

const roles = [
  { value: 'aluno',     label: 'ALUNO',    icon: '🎮' },
  { value: 'professor', label: 'PROFESSOR', icon: '📡' },
]

const genders = [
  { value: 'male',    label: 'MASCULINO', icon: '⚔️', color: '#3fb4ff' },
  { value: 'female',  label: 'FEMININO',  icon: '✨', color: '#ff5fb1' },
  { value: 'neutral', label: 'NEUTRO',    icon: '◆',  color: '#a073ff' },
]

async function handleLogin() {
  loading.value = true; error.value = ''
  const { error: err } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
  loading.value = false
  if (err) { error.value = err.message; return }
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role, onboarding_done').eq('id', user.id).single()
  if (profile?.role === 'professor') return router.push('/professor')
  if (!profile?.onboarding_done) return router.push('/onboarding')
  router.push('/game')
}

async function handleRegister() {
  loading.value = true; error.value = ''
  const { error: err } = await supabase.auth.signUp({
    email: email.value, password: password.value,
    options: { data: { name: name.value, role: role.value, gender: gender.value } }
  })
  loading.value = false
  if (err) { error.value = err.message; return }
  if (role.value === 'professor') return router.push('/professor')
  router.push('/onboarding')
}
</script>

<style lang="sass" scoped>
.login-page
  position: relative
  width: 100vw
  min-height: 100vh
  display: flex
  align-items: center
  justify-content: center
  overflow: hidden
  background: #05060d

// Backgrounds
.bg-stars
  position: fixed
  inset: 0
  background-image: radial-gradient(1px 1px at 10% 20%, rgba(255,255,255,0.9), transparent), radial-gradient(1px 1px at 30% 65%, rgba(200,220,255,0.7), transparent), radial-gradient(1px 1px at 55% 10%, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 75% 80%, rgba(180,200,255,0.6), transparent), radial-gradient(1.5px 1.5px at 85% 35%, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 45% 50%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 20% 90%, rgba(200,220,255,0.6), transparent), radial-gradient(1px 1px at 90% 70%, rgba(255,255,255,0.8), transparent)
  background-size: 700px 700px
  background-repeat: repeat
  z-index: 0
  pointer-events: none
  animation: drift 200s linear infinite

@keyframes drift
  from
    background-position: 0 0
  to
    background-position: 700px 700px

.bg-grid
  position: fixed
  inset: 0
  background-image: linear-gradient(rgba(63,180,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(63,180,255,0.03) 1px, transparent 1px)
  background-size: 60px 60px
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%)
  z-index: 0
  pointer-events: none

.bg-glow
  position: fixed
  border-radius: 50%
  filter: blur(120px)
  pointer-events: none
  z-index: 0

  &.g1
    width: 700px
    height: 700px
    top: -200px
    left: -200px
    background: rgba(42,123,255,0.07)

  &.g2
    width: 500px
    height: 500px
    bottom: -150px
    right: -100px
    background: rgba(138,92,255,0.07)

  &.g3
    width: 400px
    height: 400px
    top: 40%
    left: 40%
    background: rgba(0,229,255,0.04)

// Partículas flutuantes
.particles
  position: fixed
  inset: 0
  z-index: 0
  pointer-events: none

.particle
  position: absolute
  color: var(--pc)
  opacity: 0.15
  animation: float linear infinite
  text-shadow: 0 0 12px var(--pc)

@keyframes float
  0%
    transform: translateY(0) rotate(0deg)
    opacity: 0
  10%
    opacity: 0.15
  90%
    opacity: 0.15
  100%
    transform: translateY(-100vh) rotate(360deg)
    opacity: 0

// Card central
.login-wrap
  position: relative
  z-index: 1
  width: 440px
  max-width: calc(100vw - 32px)
  padding: 44px 40px
  background: linear-gradient(180deg, rgba(15,22,44,0.82), rgba(8,12,28,0.92))
  border: 1px solid rgba(200,210,255,0.1)
  border-radius: 24px
  backdrop-filter: blur(24px)
  box-shadow: 0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(42,123,255,0.06)
  display: flex
  flex-direction: column
  gap: 28px

// Brand
.brand
  display: flex
  align-items: center
  gap: 14px

.brand-diamond
  font-size: 36px
  color: var(--gold)
  text-shadow: 0 0 24px rgba(245,201,122,0.7), 0 0 48px rgba(245,201,122,0.3)
  animation: diamond-pulse 3s ease-in-out infinite

@keyframes diamond-pulse
  0%, 100%
    text-shadow: 0 0 24px rgba(245,201,122,0.7), 0 0 48px rgba(245,201,122,0.3)
  50%
    text-shadow: 0 0 36px rgba(245,201,122,1), 0 0 72px rgba(245,201,122,0.5)

.brand-text
  display: flex
  flex-direction: column
  gap: 2px

.brand-name
  font-family: var(--font-display)
  font-size: 20px
  font-weight: 900
  letter-spacing: 0.18em
  color: var(--ink-0)

.brand-sub
  font-family: var(--font-body)
  font-size: 11px
  color: var(--ink-3)
  letter-spacing: 0.1em

// Tabs
.tabs
  display: flex
  gap: 4px
  padding: 4px
  background: rgba(0,0,0,0.3)
  border: 1px solid rgba(255,255,255,0.06)
  border-radius: 12px

  button
    flex: 1
    padding: 11px
    background: transparent
    border: none
    border-radius: 9px
    color: var(--ink-3)
    font-family: var(--font-display)
    font-size: 11px
    letter-spacing: 0.15em
    cursor: pointer
    transition: all 0.25s

    &.active
      background: linear-gradient(180deg, rgba(245,201,122,0.18), rgba(245,201,122,0.05))
      color: var(--gold)
      box-shadow: 0 0 16px rgba(245,201,122,0.12), inset 0 0 0 1px rgba(245,201,122,0.15)

// Form
.form
  display: flex
  flex-direction: column
  gap: 14px

.field
  display: flex
  flex-direction: column
  gap: 7px

  label
    font-family: var(--font-display)
    font-size: 10px
    letter-spacing: 0.2em
    color: var(--ink-3)

  input
    padding: 13px 16px
    background: rgba(255,255,255,0.04)
    border: 1px solid rgba(255,255,255,0.08)
    border-radius: 10px
    color: var(--ink-0)
    font-family: var(--font-body)
    font-size: 15px
    outline: none
    transition: all 0.2s

    &::placeholder
      color: var(--ink-3)

    &:focus
      border-color: rgba(245,201,122,0.4)
      background: rgba(245,201,122,0.04)
      box-shadow: 0 0 16px rgba(245,201,122,0.08)

// Role picker
.role-picker
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 8px

.role-btn
  display: flex
  align-items: center
  justify-content: center
  gap: 8px
  padding: 12px
  background: rgba(255,255,255,0.04)
  border: 1px solid rgba(255,255,255,0.08)
  border-radius: 10px
  color: var(--ink-2)
  font-family: var(--font-display)
  font-size: 10px
  letter-spacing: 0.12em
  cursor: pointer
  transition: all 0.2s

  &:hover
    border-color: rgba(245,201,122,0.3)
    color: var(--ink-0)

  &.active
    border-color: var(--gold)
    background: rgba(245,201,122,0.08)
    color: var(--gold)
    box-shadow: 0 0 12px rgba(245,201,122,0.15)

.role-icon
  font-size: 16px

// Gender picker
.gender-picker
  display: grid
  grid-template-columns: repeat(3, 1fr)
  gap: 8px

.gender-btn
  position: relative
  display: flex
  flex-direction: column
  align-items: center
  gap: 5px
  padding: 12px 6px
  background: rgba(255,255,255,0.04)
  border: 1px solid rgba(255,255,255,0.08)
  border-radius: 10px
  cursor: pointer
  transition: all 0.2s

  &:hover
    border-color: color-mix(in srgb, var(--gc) 50%, transparent)
    background: color-mix(in srgb, var(--gc) 5%, transparent)

  &.active
    border-color: var(--gc)
    background: color-mix(in srgb, var(--gc) 10%, transparent)
    box-shadow: 0 0 14px color-mix(in srgb, var(--gc) 30%, transparent)

.gender-icon
  font-size: 18px

.gender-label
  font-family: var(--font-display)
  font-size: 9px
  letter-spacing: 1.5px
  color: var(--ink-2)

.gender-check
  position: absolute
  top: 5px
  right: 8px
  font-size: 10px
  color: var(--gc)

// Erro
.error
  margin: 0
  padding: 10px 14px
  background: rgba(255,107,139,0.08)
  border: 1px solid rgba(255,107,139,0.25)
  border-radius: 8px
  color: #ff6b8b
  font-size: 13px
  font-family: var(--font-body)

// Botão
.submit-btn
  display: flex
  align-items: center
  justify-content: center
  gap: 10px
  padding: 14px
  background: linear-gradient(180deg, rgba(245,201,122,0.22), rgba(245,201,122,0.08))
  border: 1px solid var(--gold)
  border-radius: 12px
  color: var(--gold)
  font-family: var(--font-display)
  font-size: 13px
  font-weight: 700
  letter-spacing: 0.2em
  cursor: pointer
  transition: all 0.25s
  box-shadow: 0 0 20px rgba(245,201,122,0.12)
  margin-top: 4px

  &:hover:not(:disabled)
    background: linear-gradient(180deg, rgba(245,201,122,0.38), rgba(245,201,122,0.18))
    box-shadow: 0 0 36px rgba(245,201,122,0.28)
    transform: translateY(-1px)

  &:disabled
    opacity: 0.5
    cursor: not-allowed

// Footer
.footer-text
  margin: 0
  font-size: 11px
  color: var(--ink-3)
  font-family: var(--font-body)
  text-align: center
  letter-spacing: 0.05em

// Transitions
.fade-enter-active, .fade-leave-active
  transition: opacity 0.2s ease, transform 0.2s ease

.fade-enter-from
  opacity: 0
  transform: translateY(6px)

.fade-leave-to
  opacity: 0
  transform: translateY(-6px)

// Mobile
@media screen and (max-width: 480px)
  .login-wrap
    padding: 32px 24px
</style>