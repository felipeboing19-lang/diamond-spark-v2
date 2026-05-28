<template>
  <div class="login-page">
    <div class="bg-stars"></div>
    <div class="bg-grid"></div>
    <div class="overlay"></div>

    <div class="login-wrap">
      <div class="brand">
        <span class="brand-mark">◆</span>
        <h1>DIAMOND <span>SPARK</span></h1>
      </div>
      <p class="tagline">Descubra seu perfil. Desenvolva suas habilidades. Transforme o futuro.</p>

      <div class="tabs">
        <button :class="{ active: tab === 'login' }" @click="tab = 'login'">ENTRAR</button>
        <button :class="{ active: tab === 'register' }" @click="tab = 'register'">CADASTRAR</button>
      </div>

      <form class="form" @submit.prevent="tab === 'login' ? handleLogin() : handleRegister()">
        <div v-if="tab === 'register'" class="field">
          <label>NOME</label>
          <input v-model="name" type="text" placeholder="Seu nome completo" required />
        </div>
        <div v-if="tab === 'register'" class="field">
          <label>TIPO DE CONTA</label>
          <select v-model="role">
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
          </select>
        </div>
        <div class="field">
          <label>E-MAIL</label>
          <input v-model="email" type="email" placeholder="seu@email.com" required />
        </div>
        <div class="field">
          <label>SENHA</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span>{{ loading ? 'AGUARDE...' : tab === 'login' ? 'ENTRAR' : 'CADASTRAR' }}</span>
        </button>
      </form>
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
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })
  loading.value = false
  if (err) { error.value = err.message; return }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, onboarding_done')
    .eq('id', (await supabase.auth.getUser()).data.user.id)
    .single()
  if (profile?.role === 'professor') return router.push('/professor')
  if (!profile?.onboarding_done) return router.push('/onboarding')
  router.push('/game')
}

async function handleRegister() {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: { data: { name: name.value, role: role.value } }
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
  background: var(--bg-0)

.bg-stars
  position: fixed
  inset: 0
  background-image: radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.9), transparent), radial-gradient(1px 1px at 50% 70%, rgba(200,220,255,0.7), transparent), radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 10% 80%, rgba(180,200,255,0.6), transparent), radial-gradient(1.5px 1.5px at 70% 50%, rgba(255,255,255,0.5), transparent)
  background-size: 700px 700px
  background-repeat: repeat
  z-index: 0
  pointer-events: none

.bg-grid
  position: fixed
  inset: 0
  background-image: linear-gradient(rgba(63,180,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(63,180,255,0.04) 1px, transparent 1px)
  background-size: 80px 80px
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%)
  z-index: 0
  pointer-events: none

.overlay
  position: fixed
  inset: 0
  background: radial-gradient(ellipse at 20% 10%, rgba(63,180,255,0.10) 0%, transparent 45%), radial-gradient(ellipse at 85% 30%, rgba(160,115,255,0.10) 0%, transparent 45%)
  z-index: 0
  pointer-events: none

.login-wrap
  position: relative
  z-index: 1
  width: 440px
  max-width: calc(100vw - 32px)
  padding: 48px 40px
  background: linear-gradient(180deg, rgba(20,28,60,0.75), rgba(10,14,31,0.85))
  border: 1px solid rgba(200,210,255,0.12)
  border-radius: 20px
  backdrop-filter: blur(20px)
  box-shadow: 0 0 60px rgba(63,180,255,0.08), 0 0 120px rgba(160,115,255,0.05)

.brand
  display: flex
  align-items: center
  gap: 12px
  margin-bottom: 8px

.brand-mark
  font-size: 28px
  color: var(--gold)
  text-shadow: 0 0 20px rgba(245,201,122,0.6)

.brand h1
  font-family: 'Cinzel', serif
  font-size: 24px
  letter-spacing: 0.2em
  color: var(--ink-0)
  span
    color: var(--gold)

.tagline
  font-size: 12px
  color: var(--ink-2)
  letter-spacing: 0.05em
  margin-bottom: 32px
  line-height: 1.5

.tabs
  display: flex
  gap: 4px
  margin-bottom: 28px
  background: rgba(0,0,0,0.3)
  padding: 4px
  border-radius: 10px

  button
    flex: 1
    padding: 10px
    background: transparent
    border: none
    border-radius: 8px
    color: var(--ink-2)
    font-family: 'Orbitron', sans-serif
    font-size: 11px
    letter-spacing: 0.15em
    cursor: pointer
    transition: all 0.2s

    &.active
      background: linear-gradient(180deg, rgba(245,201,122,0.2), rgba(245,201,122,0.05))
      color: var(--gold)
      box-shadow: 0 0 14px rgba(245,201,122,0.2)

.form
  display: flex
  flex-direction: column
  gap: 16px

.field
  display: flex
  flex-direction: column
  gap: 6px

  label
    font-family: 'Orbitron', sans-serif
    font-size: 10px
    letter-spacing: 0.2em
    color: var(--ink-2)

  input, select
    padding: 12px 16px
    background: rgba(0,0,0,0.35)
    border: 1px solid rgba(200,210,255,0.12)
    border-radius: 8px
    color: var(--ink-0)
    font-family: 'Rajdhani', sans-serif
    font-size: 15px
    transition: all 0.2s
    outline: none

    &:focus
      border-color: rgba(245,201,122,0.5)
      box-shadow: 0 0 12px rgba(245,201,122,0.15)

    option
      background: var(--bg-1)

.error
  color: #ff6b8b
  font-size: 13px
  text-align: center

.submit-btn
  margin-top: 8px
  padding: 14px
  background: linear-gradient(180deg, rgba(245,201,122,0.25), rgba(245,201,122,0.1))
  border: 1px solid var(--gold)
  border-radius: 10px
  color: var(--gold)
  font-family: 'Orbitron', sans-serif
  font-size: 13px
  font-weight: 700
  letter-spacing: 0.2em
  cursor: pointer
  transition: all 0.2s
  text-shadow: 0 0 8px rgba(245,201,122,0.5)
  box-shadow: 0 0 20px rgba(245,201,122,0.15)

  &:hover:not(:disabled)
    background: linear-gradient(180deg, rgba(245,201,122,0.4), rgba(245,201,122,0.2))
    box-shadow: 0 0 30px rgba(245,201,122,0.3)

  &:disabled
    opacity: 0.5
    cursor: not-allowed
</style>
