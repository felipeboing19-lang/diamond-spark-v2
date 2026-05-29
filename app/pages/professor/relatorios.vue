<template>
  <div class="professor-page">
    <ProfessorNav />
    <main class="content">
      <div class="page-header">
        <h1>RELATÓRIOS</h1>
        <p>Visão geral das suas turmas e alunos.</p>
      </div>

      <div class="select-class">
        <label>SELECIONAR TURMA</label>
        <select v-model="selectedClass" @change="loadData">
          <option value="">Todas as turmas</option>
          <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>

      <div class="reports-grid">
        <div class="report-card">
          <h3>DISTRIBUIÇÃO RIASEC</h3>
          <div v-if="profileData.length === 0" class="no-data">Sem dados ainda</div>
          <div v-else class="chart">
            <div v-for="p in profileData" :key="p.code" class="chart-bar">
              <span class="bar-letter" :style="{ color: p.color }">{{ p.code }}</span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: p.pct + '%', background: p.color }"></div>
              </div>
              <span class="bar-count">{{ p.count }}</span>
            </div>
          </div>
        </div>

        <div class="report-card">
          <h3>INTELIGÊNCIAS MÚLTIPLAS</h3>
          <div v-if="intelData.length === 0" class="no-data">Sem dados ainda</div>
          <div v-else class="intel-list">
            <div v-for="i in intelData" :key="i.code" class="intel-item">
              <span class="intel-name">{{ i.name }}</span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: i.pct + '%', background: '#a073ff' }"></div>
              </div>
              <span class="bar-count">{{ i.count }}</span>
            </div>
          </div>
        </div>

        <div class="report-card full">
          <h3>STATUS DO ONBOARDING</h3>
          <div class="onboarding-stats">
            <div class="ob-item">
              <span class="ob-num" style="color: var(--col-s)">{{ onboardingStats.done }}</span>
              <span class="ob-label">CONCLUÍDO</span>
            </div>
            <div class="ob-item">
              <span class="ob-num" style="color: #ff6b8b">{{ onboardingStats.pending }}</span>
              <span class="ob-label">PENDENTE</span>
            </div>
            <div class="ob-item">
              <span class="ob-num">{{ onboardingStats.total }}</span>
              <span class="ob-label">TOTAL DE ALUNOS</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'professor' })
const supabase = useSupabaseClient()
const classes = ref([])
const selectedClass = ref('')
const profileData = ref([])
const intelData = ref([])
const onboardingStats = ref({ done: 0, pending: 0, total: 0 })

const profileColors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }
const intelNames = { NAT: 'Naturalista', MUS: 'Musical', LOG: 'Lógico-Mat.', EXI: 'Existencial', INT: 'Interpessoal', COR: 'Corporal', LIN: 'Linguística', INA: 'Intrapessoal', ESP: 'Espacial' }

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase.from('classes').select('id, name').eq('teacher_id', user.id)
  classes.value = data || []
  await loadData()
})

async function loadData() {
  const { data: { user } } = await supabase.auth.getUser()
  const { data: myClasses } = await supabase.from('classes').select('id').eq('teacher_id', user.id)
  if (!myClasses?.length) return

  const classIds = selectedClass.value ? [selectedClass.value] : myClasses.map(c => c.id)
  const { data: cs } = await supabase.from('class_students').select('student_id').in('class_id', classIds)
  if (!cs?.length) {
    profileData.value = []
    intelData.value = []
    onboardingStats.value = { done: 0, pending: 0, total: 0 }
    return
  }

  const ids = [...new Set(cs.map(c => c.student_id))]
  const { data: profiles } = await supabase.from('profiles').select('riasec_profile, intelligence_profile, onboarding_done').in('id', ids)

  const rCounts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
  profiles?.forEach(p => { if (p.riasec_profile) rCounts[p.riasec_profile]++ })
  const maxR = Math.max(...Object.values(rCounts), 1)
  profileData.value = Object.entries(rCounts).map(([code, count]) => ({
    code, count, color: profileColors[code], pct: (count / maxR) * 100
  }))

  const iCounts = {}
  profiles?.forEach(p => { if (p.intelligence_profile) iCounts[p.intelligence_profile] = (iCounts[p.intelligence_profile] || 0) + 1 })
  const maxI = Math.max(...Object.values(iCounts), 1)
  intelData.value = Object.entries(iCounts).sort((a, b) => b[1] - a[1]).map(([code, count]) => ({
    code, name: intelNames[code] || code, count, pct: (count / maxI) * 100
  }))

  const done = profiles?.filter(p => p.onboarding_done).length || 0
  onboardingStats.value = { done, pending: ids.length - done, total: ids.length }
}
</script>

<style scoped>
.professor-page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 1200px; margin: 0 auto; }
.page-header { margin-bottom: 32px; }
h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 6px; }
.page-header p { color: var(--ink-2); font-size: 14px; margin: 0; }
.select-class { display: flex; flex-direction: column; gap: 8px; margin-bottom: 32px; max-width: 320px; }
.select-class label { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); }
.select-class select { padding: 12px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--ink-0); font-family: var(--font-body); font-size: 14px; outline: none; }
.select-class select option { background: var(--bg-1); }
.reports-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.report-card { padding: 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
.report-card.full { grid-column: 1 / -1; }
.report-card h3 { font-family: var(--font-display); font-size: 12px; letter-spacing: 2px; color: var(--ink-2); margin: 0 0 20px; }
.no-data { text-align: center; color: var(--ink-3); padding: 20px; font-size: 13px; }
.chart { display: flex; flex-direction: column; gap: 12px; }
.chart-bar { display: grid; grid-template-columns: 20px 1fr 28px; align-items: center; gap: 12px; }
.bar-letter { font-family: var(--font-display); font-size: 16px; font-weight: 900; }
.bar-track { height: 10px; background: rgba(255,255,255,0.06); border-radius: 5px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 5px; transition: width 0.6s ease; }
.bar-count { font-family: var(--font-display); font-size: 13px; color: var(--ink-2); text-align: right; }
.intel-list { display: flex; flex-direction: column; gap: 10px; }
.intel-item { display: grid; grid-template-columns: 110px 1fr 28px; align-items: center; gap: 12px; }
.intel-name { font-size: 12px; color: var(--ink-1); }
.onboarding-stats { display: flex; gap: 48px; }
.ob-item { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.ob-num { font-family: var(--font-display); font-size: 48px; font-weight: 900; }
.ob-label { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); }
</style>
