<template>
  <nav class="aluno-nav">
    <div class="nav-brand">
      <span class="brand-mark">◆</span>
      <span class="brand-name">DIAMOND SPARK</span>
    </div>
    <div class="nav-links">
      <NuxtLink to="/game" exact-active-class="active">INÍCIO</NuxtLink>
      <NuxtLink to="/turmas" active-class="active">TURMAS</NuxtLink>
      <NuxtLink to="/perfil" active-class="active">PERFIL</NuxtLink>
    </div>
    <div class="nav-right">
      <div class="nav-avatar" :style="{ '--c': profileColor }">{{ initial }}</div>
      <button class="logout-btn" @click="logout">SAIR</button>
    </div>
  </nav>
</template>

<script setup>
const supabase = useSupabaseClient()
const router = useRouter()
const profile = ref(null)
const profileColors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }
const profileColor = computed(() => profileColors[profile.value?.riasec_profile] || '#f5c97a')
const initial = computed(() => profile.value?.name?.charAt(0)?.toUpperCase() || '?')
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data } = await supabase.from('profiles').select('name, riasec_profile').eq('id', user.id).single()
  profile.value = data
})
async function logout() {
  await supabase.auth.signOut()
  router.push('/')
}
</script>

<style scoped>
.aluno-nav { display: flex; align-items: center; justify-content: space-between; padding: 14px 48px; background: rgba(8,12,28,0.9); border-bottom: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 50; }
.nav-brand { display: flex; align-items: center; gap: 10px; }
.brand-mark { font-size: 20px; color: var(--gold); text-shadow: 0 0 12px rgba(245,201,122,0.5); }
.brand-name { font-family: var(--font-display); font-size: 16px; letter-spacing: 0.2em; color: var(--ink-0); }
.nav-links { display: flex; gap: 4px; }
.nav-links a { font-family: var(--font-display); font-size: 11px; letter-spacing: 0.15em; color: var(--ink-2); padding: 8px 16px; border-radius: 8px; border: 1px solid transparent; text-decoration: none; transition: all 0.2s; }
.nav-links a:hover, .nav-links a.active { color: var(--gold); border-color: rgba(245,201,122,0.3); background: rgba(245,201,122,0.06); }
.nav-right { display: flex; align-items: center; gap: 12px; }
.nav-avatar { width: 34px; height: 34px; border-radius: 50%; background: color-mix(in srgb, var(--c) 20%, rgba(0,0,0,0.5)); border: 1px solid var(--c); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--c); }
.logout-btn { font-family: var(--font-display); font-size: 11px; letter-spacing: 0.15em; color: var(--ink-2); background: transparent; border: 1px solid rgba(255,255,255,0.1); padding: 8px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.logout-btn:hover { color: #ff6b8b; border-color: rgba(255,107,139,0.4); }
</style>
