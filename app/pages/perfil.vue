<template>
  <div class="page">
    <AlunoNav />
    <main class="content">
      <div v-if="loading" class="loading">Carregando...</div>

      <div v-else-if="profile" class="profile">
        <div class="profile-hero" :style="{ '--c': profileColor }">
          <div class="avatar">{{ profile.riasec_profile || '?' }}</div>
          <div class="profile-info">
            <span class="label">SEU PERFIL</span>
            <h1>{{ profile.name }}</h1>
            <p>{{ profileDesc }}</p>
          </div>
          <div class="xp-block">
            <span class="xp-num">{{ profile.level || 1 }}</span>
            <span class="xp-label">NIVEL</span>
          </div>
        </div>

        <div class="section">
          <h2>INFORMACOES</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">EMAIL</span>
              <span class="info-value">{{ profile.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">PERFIL RIASEC</span>
              <span class="info-value" :style="{ color: profileColor }">{{ profile.riasec_profile || 'Pendente' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">INTELIGENCIA</span>
              <span class="info-value">{{ profile.intelligence_profile || 'Pendente' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">XP TOTAL</span>
              <span class="info-value">{{ profile.xp || 0 }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <a href="/onboarding" class="btn-redo">REFAZER QUESTIONARIO DE PERFIL</a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'auth' })
const supabase = useSupabaseClient()
const profile = ref(null)
const loading = ref(true)

const colors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }
const descs = {
  R: 'Realista - Pratico, tecnico, gosta de trabalho concreto.',
  I: 'Investigativo - Analitico, curioso, resolve problemas complexos.',
  A: 'Artistico - Criativo, expressivo, pensa fora da caixa.',
  S: 'Social - Empatico, colaborativo, gosta de ajudar.',
  E: 'Empreendedor - Lider, persuasivo, gosta de desafios.',
  C: 'Convencional - Organizado, preciso, gosta de estrutura.',
}

const profileColor = computed(() => colors[profile.value?.riasec_profile] || '#f5c97a')
const profileDesc = computed(() => descs[profile.value?.riasec_profile] || 'Perfil nao definido ainda.')

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  profile.value = data
  loading.value = false
})
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 32px; }
.loading { text-align: center; padding: 80px; color: var(--ink-2); }
.profile-hero { display: grid; grid-template-columns: 100px 1fr auto; gap: 24px; align-items: center; padding: 28px; background: rgba(255,255,255,0.04); border: 1px solid color-mix(in srgb, var(--c) 30%, rgba(255,255,255,0.08)); border-radius: 20px; box-shadow: 0 0 28px color-mix(in srgb, var(--c) 12%, transparent); }
.avatar { width: 100px; height: 100px; border-radius: 50%; border: 2px solid var(--c); background: color-mix(in srgb, var(--c) 15%, rgba(0,0,0,0.5)); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 36px; font-weight: 900; color: var(--c); flex-shrink: 0; }
.label { font-family: var(--font-display); font-size: 10px; letter-spacing: 3px; color: var(--ink-3); display: block; margin-bottom: 4px; }
h1 { font-family: var(--font-display); font-size: 24px; color: var(--ink-0); margin: 0 0 8px; }
.profile-info p { margin: 0; color: var(--ink-2); font-size: 14px; }
.xp-block { text-align: center; }
.xp-num { display: block; font-family: var(--font-display); font-size: 36px; font-weight: 900; color: var(--gold); }
.xp-label { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); }
.section h2 { font-family: var(--font-display); font-size: 12px; letter-spacing: 2px; color: var(--ink-2); margin: 0 0 16px; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.info-item { padding: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; }
.info-label { display: block; font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; color: var(--ink-3); margin-bottom: 6px; }
.info-value { font-size: 14px; color: var(--ink-0); }
.btn-redo { display: inline-block; padding: 12px 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--ink-2); font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; text-decoration: none; transition: all 0.2s; }
.btn-redo:hover { border-color: rgba(255,255,255,0.2); color: var(--ink-0); }
</style>
