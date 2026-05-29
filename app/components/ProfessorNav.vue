<template>
  <nav class="professor-nav">
    <div class="nav-brand">
      <span class="brand-mark">◆</span>
      <span class="brand-name">DIAMOND SPARK</span>
      <span class="role-badge">PROFESSOR</span>
    </div>
    <div class="nav-links">
      <NuxtLink to="/professor" exact-active-class="active">PAINEL</NuxtLink>
      <NuxtLink to="/professor/turmas" active-class="active">TURMAS</NuxtLink>
      <NuxtLink to="/professor/atividades" active-class="active">ATIVIDADES</NuxtLink>
      <NuxtLink to="/professor/relatorios" active-class="active">RELATÓRIOS</NuxtLink>
    </div>
    <button class="logout-btn" @click="logout">SAIR</button>
  </nav>
</template>

<script setup>
const supabase = useSupabaseClient()
const router = useRouter()
async function logout() {
  await supabase.auth.signOut()
  router.push('/')
}
</script>

<style scoped>
.professor-nav { display: flex; align-items: center; justify-content: space-between; padding: 14px 48px; background: rgba(8,12,28,0.9); border-bottom: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 50; }
.nav-brand { display: flex; align-items: center; gap: 10px; }
.brand-mark { font-size: 20px; color: var(--gold); }
.brand-name { font-family: var(--font-display); font-size: 16px; letter-spacing: 0.2em; color: var(--ink-0); }
.role-badge { font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; color: var(--col-i); border: 1px solid var(--col-i); padding: 3px 8px; border-radius: 999px; }
.nav-links { display: flex; gap: 4px; }
.nav-links a { font-family: var(--font-display); font-size: 11px; letter-spacing: 0.15em; color: var(--ink-2); padding: 8px 16px; border-radius: 8px; border: 1px solid transparent; text-decoration: none; transition: all 0.2s; }
.nav-links a:hover, .nav-links a.active { color: var(--gold); border-color: rgba(245,201,122,0.3); background: rgba(245,201,122,0.06); }
.logout-btn { font-family: var(--font-display); font-size: 11px; letter-spacing: 0.15em; color: var(--ink-2); background: transparent; border: 1px solid rgba(255,255,255,0.1); padding: 8px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.logout-btn:hover { color: #ff6b8b; border-color: rgba(255,107,139,0.4); }
</style>
