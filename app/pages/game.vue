<template>
  <div class="page">
    <AlunoNav />
    <main class="content">
      <div class="hero" :style="{ '--c': profileColor }">
        <div class="avatar">{{ profile?.riasec_profile || '?' }}</div>
        <div class="hero-text">
          <span class="greeting">OLA,</span>
          <h1>{{ profile?.name }}</h1>
          <p>{{ profileDesc }}</p>
        </div>
      </div>

      <div class="actions">
        <a href="/turmas" class="action-card">
          <span class="icon">🏫</span>
          <span class="label">MINHAS TURMAS</span>
          <span class="desc">Entre em turmas e veja atividades</span>
        </a>
        <a href="/perfil" class="action-card">
          <span class="icon">👤</span>
          <span class="label">MEU PERFIL</span>
          <span class="desc">Seu perfil RIASEC e inteligencias</span>
        </a>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'auth' })
const supabase = useSupabaseClient()
const profile = ref(null)

const colors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }
const descs = {
  R: 'Voce e pratico e gosta de trabalhar com suas maos.',
  I: 'Voce e curioso e adora resolver problemas complexos.',
  A: 'Voce e criativo e expressa suas ideias de forma unica.',
  S: 'Voce e empático e gosta de ajudar as pessoas.',
  E: 'Voce e lider e gosta de desafios e oportunidades.',
  C: 'Voce e organizado e gosta de estrutura e precisao.',
}

const profileColor = computed(() => colors[profile.value?.riasec_profile] || '#f5c97a')
const profileDesc = computed(() => descs[profile.value?.riasec_profile] || 'Bem-vindo ao Diamond Spark!')

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  profile.value = data
})
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 32px; }
.hero { display: flex; align-items: center; gap: 28px; padding: 32px; background: rgba(255,255,255,0.04); border: 1px solid color-mix(in srgb, var(--c) 30%, rgba(255,255,255,0.08)); border-radius: 20px; box-shadow: 0 0 32px color-mix(in srgb, var(--c) 15%, transparent); }
.avatar { width: 100px; height: 100px; border-radius: 50%; border: 2px solid var(--c); background: color-mix(in srgb, var(--c) 15%, rgba(0,0,0,0.5)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 36px; font-weight: 900; color: var(--c); flex-shrink: 0; }
.greeting { font-family: var(--font-display); font-size: 10px; letter-spacing: 3px; color: var(--ink-3); display: block; margin-bottom: 4px; }
h1 { font-family: var(--font-display); font-size: 28px; color: var(--ink-0); margin: 0 0 8px; }
.hero-text p { margin: 0; color: var(--ink-2); font-size: 15px; line-height: 1.6; }
.actions { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.action-card { display: flex; flex-direction: column; gap: 8px; padding: 24px; background: linear-gradient(180deg, rgba(245,201,122,0.1), rgba(245,201,122,0.04)); border: 1px solid rgba(245,201,122,0.2); border-radius: 16px; text-decoration: none; transition: all 0.2s; }
.action-card:hover { background: linear-gradient(180deg, rgba(245,201,122,0.2), rgba(245,201,122,0.08)); transform: translateY(-2px); }
.icon { font-size: 28px; }
.label { font-family: var(--font-display); font-size: 13px; letter-spacing: 1.5px; color: var(--gold); }
.desc { font-size: 13px; color: var(--ink-2); }
</style>
