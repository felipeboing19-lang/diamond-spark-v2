<template>
  <div class="professor-page">
    <ProfessorNav />
    <main class="content">
      <div class="page-header">
        <NuxtLink to="/professor/turmas" class="back-link">← TURMAS</NuxtLink>
        <div class="header-row">
          <div>
            <h1>{{ turma?.name }}</h1>
            <p>{{ turma?.description || 'Sem descrição' }}</p>
          </div>
          <div class="header-actions">
            <div class="code-box">
              <span class="code-label">CÓDIGO DE ENTRADA</span>
              <span class="code-value">{{ turma?.code }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tabs">
        <button :class="{ active: tab === 'alunos' }" @click="tab = 'alunos'">ALUNOS ({{ students.length }})</button>
        <button :class="{ active: tab === 'perfis' }" @click="tab = 'perfis'">PERFIS RIASEC</button>
      </div>

      <!-- Alunos -->
      <div v-if="tab === 'alunos'">
        <div v-if="students.length === 0" class="empty">
          <p>Nenhum aluno nesta turma ainda.</p>
          <p class="hint">Compartilhe o código <strong>{{ turma?.code }}</strong> com seus alunos.</p>
        </div>
        <div v-else class="students-grid">
          <div v-for="s in students" :key="s.id" class="student-card">
            <div class="student-avatar" :style="getAvatarStyle(s.riasec_profile)">
              {{ s.riasec_profile || '?' }}
            </div>
            <div class="student-info">
              <span class="student-name">{{ s.name }}</span>
              <span class="student-email">{{ s.email }}</span>
              <div class="student-tags">
                <span v-if="s.riasec_profile" class="tag riasec" :style="{ color: getColor(s.riasec_profile) }">
                  {{ getProfileName(s.riasec_profile) }}
                </span>
                <span v-if="s.intelligence_profile" class="tag intel">
                  {{ getIntelName(s.intelligence_profile) }}
                </span>
                <span v-if="!s.onboarding_done" class="tag pending">ONBOARDING PENDENTE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Perfis RIASEC -->
      <div v-if="tab === 'perfis'" class="profiles-view">
        <div class="profiles-chart">
          <div v-for="(p, code) in profileCounts" :key="code" class="profile-bar-item">
            <span class="profile-letter" :style="{ color: getColor(code) }">{{ code }}</span>
            <div class="bar-wrap">
              <div class="bar-fill" :style="{ width: barWidth(p) + '%', background: getColor(code) }"></div>
            </div>
            <span class="bar-count">{{ p }}</span>
            <span class="bar-name">{{ getProfileName(code) }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'professor' })

const route = useRoute()
const supabase = useSupabaseClient()
const turma = ref(null)
const students = ref([])
const tab = ref('alunos')

const profileColors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }
const profileNames = { R: 'Realista', I: 'Investigativo', A: 'Artístico', S: 'Social', E: 'Empreendedor', C: 'Convencional' }
const intelNames = { NAT: 'Naturalista', MUS: 'Musical', LOG: 'Lógico-Mat.', EXI: 'Existencial', INT: 'Interpessoal', COR: 'Corporal', LIN: 'Linguística', INA: 'Intrapessoal', ESP: 'Espacial' }

const profileCounts = computed(() => {
  const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  students.value.forEach(s => { if (s.riasec_profile) counts[s.riasec_profile]++ })
  return counts
})

const maxCount = computed(() => Math.max(...Object.values(profileCounts.value), 1))

function barWidth(count) { return (count / maxCount.value) * 100 }
function getColor(code) { return profileColors[code] || '#fff' }
function getProfileName(code) { return profileNames[code] || code }
function getIntelName(code) { return intelNames[code] || code }
function getAvatarStyle(code) {
  const c = profileColors[code] || '#fff'
  return { background: `color-mix(in srgb, ${c} 15%, rgba(0,0,0,0.4))`, border: `1px solid ${c}`, color: c }
}

onMounted(async () => {
  const { data: t } = await supabase.from('classes').select('*').eq('id', route.params.id).single()
  turma.value = t

  const { data: cs } = await supabase.from('class_students').select('student_id').eq('class_id', route.params.id)
  if (cs?.length) {
    const ids = cs.map(c => c.student_id)
    const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids)
    students.value = profiles || []
  }
})
</script>

<style scoped>
.professor-page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 1200px; margin: 0 auto; }
.back-link { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--ink-2); text-decoration: none; display: inline-block; margin-bottom: 16px; }
.back-link:hover { color: var(--gold); }
.header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 32px; }
h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 6px; }
.header-row > div > p { color: var(--ink-2); font-size: 14px; margin: 0; }
.code-box { padding: 16px 24px; background: rgba(245,201,122,0.08); border: 1px solid rgba(245,201,122,0.3); border-radius: 12px; text-align: center; }
.code-label { display: block; font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; color: var(--ink-3); margin-bottom: 6px; }
.code-value { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--gold); letter-spacing: 6px; }
.tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0; }
.tabs button { padding: 10px 20px; background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--ink-3); font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; margin-bottom: -1px; }
.tabs button.active { color: var(--gold); border-bottom-color: var(--gold); }
.empty { text-align: center; padding: 60px; color: var(--ink-2); }
.empty .hint { margin-top: 8px; font-size: 14px; }
.empty strong { color: var(--gold); letter-spacing: 3px; }
.students-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.student-card { display: flex; align-items: center; gap: 14px; padding: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
.student-avatar { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 18px; font-weight: 900; flex-shrink: 0; }
.student-name { display: block; font-family: var(--font-display); font-size: 13px; color: var(--ink-0); margin-bottom: 2px; }
.student-email { display: block; font-size: 12px; color: var(--ink-3); margin-bottom: 6px; }
.student-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.tag { font-family: var(--font-display); font-size: 9px; letter-spacing: 1.5px; padding: 2px 8px; border-radius: 999px; border: 1px solid currentColor; }
.tag.intel { color: var(--ink-2); }
.tag.pending { color: #ff6b8b; }
.profiles-view { padding: 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
.profiles-chart { display: flex; flex-direction: column; gap: 16px; }
.profile-bar-item { display: grid; grid-template-columns: 24px 1fr 32px 120px; align-items: center; gap: 16px; }
.profile-letter { font-family: var(--font-display); font-size: 18px; font-weight: 900; text-align: center; }
.bar-wrap { height: 12px; background: rgba(255,255,255,0.06); border-radius: 6px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 6px; transition: width 0.6s ease; }
.bar-count { font-family: var(--font-display); font-size: 14px; color: var(--ink-0); text-align: center; }
.bar-name { font-size: 13px; color: var(--ink-2); }
</style>
