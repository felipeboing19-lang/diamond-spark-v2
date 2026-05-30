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
        <button class="action-card" @click="$router.push('/turmas')">
          <span class="icon">🏫</span>
          <span class="label">MINHAS TURMAS</span>
          <span class="desc">Entre em turmas e veja atividades</span>
        </button>
        <button class="action-card" @click="$router.push('/perfil')">
          <span class="icon">👤</span>
          <span class="label">MEU PERFIL</span>
          <span class="desc">Seu perfil RIASEC e inteligencias</span>
        </button>
      </div>

      <!-- Atividades disponíveis -->
      <section class="activities">
        <h2 class="section-title">ATIVIDADES DISPONÍVEIS</h2>
        <div v-if="loadingActivities" class="act-state">Carregando atividades...</div>
        <div v-else-if="activities.length === 0" class="act-state">
          Nenhuma atividade disponível no momento.
        </div>
        <div v-else class="act-grid">
          <button v-for="a in activities" :key="a.id" class="act-card" @click="openActivity(a.id)">
            <div class="act-top">
              <span class="act-icon">🎯</span>
              <span class="act-class" v-if="a.class_name">{{ a.class_name }}</span>
            </div>
            <h3>{{ a.title }}</h3>
            <p v-if="a.description">{{ a.description }}</p>
            <span class="act-open">ABRIR CANVAS →</span>
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'aluno' })
const supabase = useSupabaseClient()
const profile = ref(null)
const activities = ref([])
const loadingActivities = ref(true)

const colors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }
const descs = {
  R: 'Voce e pratico e gosta de trabalhar com suas maos.',
  I: 'Voce e curioso e adora resolver problemas complexos.',
  A: 'Voce e criativo e expressa suas ideias de forma unica.',
  S: 'Voce e empatico e gosta de ajudar as pessoas.',
  E: 'Voce e lider e gosta de desafios e oportunidades.',
  C: 'Voce e organizado e gosta de estrutura e precisao.',
}

const profileColor = computed(() => colors[profile.value?.riasec_profile] || '#f5c97a')
const profileDesc = computed(() => descs[profile.value?.riasec_profile] || 'Bem-vindo ao Diamond Spark!')

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  profile.value = data
  await loadActivities(user.id)
})

function openActivity(id) {
  window.location.href = `/arena/${id}`
}

async function loadActivities(uid) {
  // atividades onde o aluno é participante (team_members -> teams -> activities)
  const { data } = await supabase
    .from('team_members')
    .select('teams!inner(activity_id, activities!inner(id, title, description, status, class_id, classes(name)))')
    .eq('student_id', uid)

  const seen = new Set()
  const list = []
  ;(data || []).forEach(row => {
    const act = row.teams?.activities
    if (!act || seen.has(act.id)) return
    if (act.status !== 'active') return          // só atividades publicadas
    seen.add(act.id)
    list.push({
      id: act.id, title: act.title, description: act.description,
      class_name: act.classes?.name || '',
    })
  })
  activities.value = list
  loadingActivities.value = false
}
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
.action-card { display: flex; flex-direction: column; gap: 8px; padding: 24px; background: linear-gradient(180deg, rgba(245,201,122,0.1), rgba(245,201,122,0.04)); border: 1px solid rgba(245,201,122,0.2); border-radius: 16px; cursor: pointer; transition: all 0.2s; text-align: left; }
.action-card:hover { background: linear-gradient(180deg, rgba(245,201,122,0.2), rgba(245,201,122,0.08)); transform: translateY(-2px); }
.icon { font-size: 28px; }
.label { font-family: var(--font-display); font-size: 13px; letter-spacing: 1.5px; color: var(--gold); }
.desc { font-size: 13px; color: var(--ink-2); }

/* atividades */
.section-title { font-family: var(--font-display); font-size: 12px; letter-spacing: 2px; color: var(--ink-3); margin: 0 0 16px; }
.act-state { padding: 28px; text-align: center; color: var(--ink-3); font-size: 14px; background: rgba(255,255,255,0.02); border: 1px dashed var(--bg-3); border-radius: 14px; }
.act-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
@media (max-width: 640px) { .act-grid { grid-template-columns: 1fr; } }
.act-card { display: flex; flex-direction: column; gap: 8px; padding: 20px; text-align: left; cursor: pointer;
  background: rgba(255,255,255,0.04); border: 1px solid var(--bg-3); border-radius: 16px; transition: all 0.2s; }
.act-card:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--gold) 50%, transparent); box-shadow: 0 10px 26px -14px var(--gold); }
.act-top { display: flex; align-items: center; justify-content: space-between; }
.act-icon { font-size: 22px; }
.act-class { font-size: 11px; color: var(--ink-3); }
.act-card h3 { font-family: var(--font-display); font-size: 15px; color: var(--ink-0); margin: 4px 0 0; }
.act-card p { margin: 0; font-size: 13px; color: var(--ink-2); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.act-open { margin-top: auto; padding-top: 8px; font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; color: var(--gold); }
</style>
