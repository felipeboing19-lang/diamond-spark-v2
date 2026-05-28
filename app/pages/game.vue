<template>
  <div class="game-page">
    <div class="bg-stars"></div>
    <div class="bg-grid"></div>
    <nav class="topbar">
      <div class="brand">
        <span class="brand-mark">◆</span>
        <span class="brand-name">DIAMOND SPARK</span>
      </div>
      <div class="nav-links">
        <NuxtLink to="/game">JORNADA</NuxtLink>
        <NuxtLink to="/perfil">PERFIL</NuxtLink>
        <NuxtLink to="/turmas">TURMAS</NuxtLink>
        <NuxtLink to="/dashboard">DASHBOARD</NuxtLink>
      </div>
      <button class="logout-btn" @click="logout">SAIR</button>
    </nav>
    <main class="content">
      <div class="welcome-block">
        <h1>BEM-VINDO À JORNADA</h1>
        <p>Suas missões e atividades aparecerão aqui.</p>
      </div>
    </main>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default', middleware: 'auth' })
const supabase = useSupabaseClient()
const router = useRouter()
async function logout() {
  await supabase.auth.signOut()
  router.push('/')
}
</script>
<style lang="sass" scoped>
.game-page
  min-height: 100vh
  background: var(--bg-0)
  position: relative
.bg-stars
  position: fixed
  inset: 0
  background-image: radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.9), transparent), radial-gradient(1px 1px at 60% 70%, rgba(200,220,255,0.7), transparent)
  background-size: 700px 700px
  z-index: 0
  pointer-events: none
.bg-grid
  position: fixed
  inset: 0
  background-image: linear-gradient(rgba(63,180,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(63,180,255,0.03) 1px, transparent 1px)
  background-size: 80px 80px
  z-index: 0
  pointer-events: none
.topbar
  position: relative
  z-index: 10
  display: flex
  align-items: center
  justify-content: space-between
  padding: 14px 32px
  background: linear-gradient(180deg, rgba(20,28,60,0.9), rgba(10,14,31,0.9))
  border-bottom: 1px solid rgba(200,210,255,0.08)
  backdrop-filter: blur(10px)
.brand
  display: flex
  align-items: center
  gap: 10px
.brand-mark
  color: var(--gold)
  font-size: 20px
.brand-name
  font-family: 'Cinzel', serif
  font-size: 16px
  letter-spacing: 0.2em
  color: var(--ink-0)
.nav-links
  display: flex
  gap: 8px
  a
    font-family: 'Orbitron', sans-serif
    font-size: 11px
    letter-spacing: 0.15em
    color: var(--ink-2)
    padding: 8px 14px
    border-radius: 8px
    border: 1px solid transparent
    transition: all 0.2s
    &:hover, &.router-link-active
      color: var(--gold)
      border-color: rgba(245,201,122,0.3)
.logout-btn
  font-family: 'Orbitron', sans-serif
  font-size: 11px
  letter-spacing: 0.15em
  color: var(--ink-2)
  background: transparent
  border: 1px solid rgba(200,210,255,0.12)
  padding: 8px 14px
  border-radius: 8px
  cursor: pointer
  transition: all 0.2s
  &:hover
    color: #ff6b8b
    border-color: rgba(255,107,139,0.4)
.content
  position: relative
  z-index: 1
  padding: 48px 32px
.welcome-block
  text-align: center
  padding: 80px 20px
  h1
    font-family: 'Cinzel', serif
    font-size: 36px
    letter-spacing: 0.15em
    color: var(--gold)
    margin-bottom: 16px
    text-shadow: 0 0 30px rgba(245,201,122,0.4)
  p
    color: var(--ink-2)
    font-size: 16px
</style>
