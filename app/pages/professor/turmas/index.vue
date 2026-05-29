<template>
  <div class="professor-page">
    <ProfessorNav />
    <main class="content">
      <div class="page-header">
        <div>
          <h1>TURMAS</h1>
          <p>Gerencie suas turmas e acompanhe os alunos.</p>
        </div>
        <NuxtLink to="/professor/turmas/nova" class="create-btn">
          ➕ CRIAR TURMA
        </NuxtLink>
      </div>

      <div v-if="loading" class="loading">Carregando...</div>

      <div v-else-if="classes.length === 0" class="empty">
        <span class="empty-icon">🏫</span>
        <h3>Nenhuma turma ainda</h3>
        <p>Crie sua primeira turma para começar.</p>
        <NuxtLink to="/professor/turmas/nova" class="create-btn">CRIAR TURMA</NuxtLink>
      </div>

      <div v-else class="classes-grid">
        <div v-for="c in classes" :key="c.id" class="class-card">
          <div class="class-header">
            <div>
              <h3>{{ c.name }}</h3>
              <p>{{ c.description || 'Sem descrição' }}</p>
            </div>
            <span class="class-status" :class="c.active ? 'active' : 'inactive'">
              {{ c.active ? 'ATIVA' : 'INATIVA' }}
            </span>
          </div>
          <div class="class-info">
            <div class="info-item">
              <span class="info-label">CÓDIGO</span>
              <span class="info-value code">{{ c.code }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">ALUNOS</span>
              <span class="info-value">{{ c.student_count || 0 }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">CRIADA EM</span>
              <span class="info-value">{{ formatDate(c.created_at) }}</span>
            </div>
          </div>
          <div class="class-actions">
            <NuxtLink :to="`/professor/turmas/${c.id}`" class="btn-primary">VER DETALHES</NuxtLink>
            <button class="btn-secondary" @click="toggleActive(c)">
              {{ c.active ? 'DESATIVAR' : 'ATIVAR' }}
            </button>
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
const loading = ref(true)

onMounted(async () => {
  await loadClasses()
})

async function loadClasses() {
  loading.value = true
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase
    .from('classes')
    .select('*, class_students(count)')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  classes.value = (data || []).map(c => ({
    ...c,
    student_count: c.class_students?.[0]?.count || 0
  }))
  loading.value = false
}

async function toggleActive(c) {
  await supabase.from('classes').update({ active: !c.active }).eq('id', c.id)
  await loadClasses()
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('pt-BR')
}
</script>

<style scoped>
.professor-page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 1200px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
.page-header h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 6px; }
.page-header p { color: var(--ink-2); font-size: 14px; margin: 0; }
.create-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(180deg, rgba(245,201,122,0.2), rgba(245,201,122,0.08)); border: 1px solid var(--gold); border-radius: 10px; color: var(--gold); font-family: var(--font-display); font-size: 12px; letter-spacing: 1.5px; text-decoration: none; cursor: pointer; transition: all 0.2s; }
.create-btn:hover { background: linear-gradient(180deg, rgba(245,201,122,0.35), rgba(245,201,122,0.15)); box-shadow: 0 0 20px rgba(245,201,122,0.2); }
.loading { text-align: center; padding: 80px; color: var(--ink-2); font-family: var(--font-display); }
.empty { text-align: center; padding: 80px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-icon { font-size: 48px; }
.empty h3 { font-family: var(--font-display); font-size: 18px; color: var(--ink-0); margin: 0; }
.empty p { color: var(--ink-2); margin: 0; }
.classes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px; }
.class-card { padding: 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; display: flex; flex-direction: column; gap: 16px; transition: all 0.2s; }
.class-card:hover { border-color: rgba(245,201,122,0.3); box-shadow: 0 0 20px rgba(245,201,122,0.08); }
.class-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.class-header h3 { font-family: var(--font-display); font-size: 16px; color: var(--ink-0); margin: 0 0 4px; }
.class-header p { color: var(--ink-2); font-size: 13px; margin: 0; }
.class-status { font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; padding: 4px 10px; border-radius: 999px; flex-shrink: 0; }
.class-status.active { color: var(--col-s); border: 1px solid var(--col-s); background: rgba(63,224,168,0.08); }
.class-status.inactive { color: var(--ink-3); border: 1px solid rgba(255,255,255,0.1); }
.class-info { display: flex; gap: 20px; padding: 14px; background: rgba(0,0,0,0.2); border-radius: 10px; }
.info-item { display: flex; flex-direction: column; gap: 3px; }
.info-label { font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; color: var(--ink-3); }
.info-value { font-family: var(--font-display); font-size: 14px; color: var(--ink-0); }
.info-value.code { color: var(--gold); letter-spacing: 3px; font-size: 16px; }
.class-actions { display: flex; gap: 8px; }
.btn-primary { flex: 1; padding: 10px; background: linear-gradient(180deg, rgba(245,201,122,0.15), rgba(245,201,122,0.05)); border: 1px solid rgba(245,201,122,0.3); border-radius: 8px; color: var(--gold); font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; text-align: center; text-decoration: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: linear-gradient(180deg, rgba(245,201,122,0.25), rgba(245,201,122,0.1)); }
.btn-secondary { padding: 10px 16px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ink-2); font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; }
.btn-secondary:hover { border-color: rgba(255,255,255,0.2); color: var(--ink-0); }
</style>
