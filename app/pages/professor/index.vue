<template>
  <div class="page">
    <div class="bg-stars"></div>
    <nav class="topbar">
      <div class="brand">
        <span class="brand-mark">◆</span>
        <span class="brand-name">DIAMOND SPARK</span>
        <span class="role-badge">PROFESSOR</span>
      </div>
      <div class="nav-links">
        <NuxtLink to="/professor">PAINEL</NuxtLink>
        <NuxtLink to="/professor/turmas">TURMAS</NuxtLink>
        <NuxtLink to="/professor/atividades">ATIVIDADES</NuxtLink>
        <NuxtLink to="/professor/relatorios">RELATÓRIOS</NuxtLink>
      </div>
      <button class="logout-btn" @click="logout">SAIR</button>
    </nav>
    <main class="content">
      <div class="welcome-block">
        <h1>PAINEL DO PROFESSOR</h1>
        <p>Gerencie suas turmas, atividades e acompanhe o progresso dos alunos.</p>
      </div>
    </main>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default', middleware: 'professor' })
const supabase = useSupabaseClient()
const router = useRouter()
async function logout() {
  await supabase.auth.signOut()
  router.push('/')
}
</script>
<style lang="sass" scoped>
.page
  min-height: 100vh
  background: var(--bg-0)
  position: relative
.bg-stars
  position: fixed
  inset: 0
  background-image: radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.9), transparent)
  background-size: 700px 700px
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
.role-badge
  font-family: 'Orbitron', sans-serif
  font-size: 9px
  letter-spacing: 0.2em
  color: var(--col-i)
  border: 1px solid var(--col-i)
  padding: 3px 8px
  border-radius: 999px
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
  color: var(--ink-2)
  background: transparent
  border: 1px solid rgba(200,210,255,0.12)
  padding: 8px 14px
  border-radius: 8px
  cursor: pointer
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
