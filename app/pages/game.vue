<template>
  <div class="page">
    <AlunoNav />
    <main class="content">
      <div class="welcome-hero" :style="{ '--c': profileColor, '--cg': profileGlow }">
        <div class="hero-avatar">
          <img :src="avatarSrc" :alt="profile?.name" @error="onImgError" />
          <span class="hero-letter">{{ profile?.riasec_profile || '?' }}</span>
        </div>
        <div class="hero-text">
          <span class="greeting">OLÁ,</span>
          <h1>{{ profile?.name }}</h1>
          <p>{{ profileDesc }}</p>
        </div>
      </div>

      <div class="quick-actions">
        <NuxtLink to="/turmas" class="action-card">
          <span class="action-icon">🏫</span>
          <span class="action-title">MINHAS TURMAS</span>
          <span class="action-desc">Veja suas turmas e atividades</span>
        </NuxtLink>
        <NuxtLink to="/perfil" class="action-card">
          <span class="action-icon">👤</span>
          <span class="action-title">MEU PERFIL</span>
          <span class="action-desc">Seu perfil RIASEC e inteligências</span>
        </NuxtLink>
        <NuxtLink to="/turmas" class="action-card secondary">
          <span class="action-icon">➕</span>
          <span class="action-title">ENTRAR EM TURMA</span>
          <span class="action-desc">Use o código do professor</span>
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup>
import { profiles, getAvatarPath } from '~/components/onboarding/data.js'
definePageMeta({ layout: 'default', middleware: 'auth' })
const supabase = useSupabaseClient()
const profile = ref(null)
const profileColors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }
const profileColor = computed(() => profileColors[profile.value?.riasec_profile] || '#f5c97a')
const profileGlow = computed(() => profileColor.value.replace(')', ', 0.3)').replace('rgb', 'rgba'))
const profileDesc = computed(() => profiles[profile.value?.riasec_profile]?.speech || 'Bem-vindo ao Diamond Spark!')
const avatarSrc = computed(() => {
  const idx = profiles[profile.value?.riasec_profile]?.avatarIndex || 1
  return getAvatarPath(idx, profile.value?.gender || 'neutral')
})
function onImgError(e) { e.target.style.display = 'none' }
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  profile.value = data
})
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 32px; }
.welcome-hero { display: grid; grid-template-columns: 140px 1fr; gap: 28px; align-items: center; padding: 32px; background: rgba(255,255,255,0.04); border: 1px solid color-mix(in srgb, var(--c) 30%, rgba(255,255,255,0.08)); border-radius: 20px; box-shadow: 0 0 32px var(--cg); }
.hero-avatar { position: relative; width: 140px; height: 140px; border-radius: 50%; border: 2px solid var(--c); overflow: hidden; box-shadow: 0 0 20px var(--cg); background: rgba(5,8,18,0.9); }
.hero-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.hero-letter { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 42px; font-weight: 900; color: var(--c); }
.greeting { font-family: var(--font-display); font-size: 11px; letter-spacing: 3px; color: var(--ink-3); display: block; margin-bottom: 6px; }
h1 { font-family: var(--font-display); font-size: 32px; color: var(--ink-0); margin: 0 0 10px; }
.hero-text p { margin: 0; font-size: 15px; color: var(--ink-2); font-style: italic; line-height: 1.6; }
.quick-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.action-card { display: flex; flex-direction: column; gap: 8px; padding: 24px; background: linear-gradient(180deg, rgba(245,201,122,0.12), rgba(245,201,122,0.04)); border: 1px solid rgba(245,201,122,0.25); border-radius: 16px; text-decoration: none; transition: all 0.2s; }
.action-card:hover { background: linear-gradient(180deg, rgba(245,201,122,0.22), rgba(245,201,122,0.08)); box-shadow: 0 0 20px rgba(245,201,122,0.15); transform: translateY(-2px); }
.action-card.secondary { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); }
.action-icon { font-size: 28px; }
.action-title { font-family: var(--font-display); font-size: 12px; letter-spacing: 1.5px; color: var(--gold); }
.action-card.secondary .action-title { color: var(--ink-1); }
.action-desc { font-size: 13px; color: var(--ink-2); }
</style>
