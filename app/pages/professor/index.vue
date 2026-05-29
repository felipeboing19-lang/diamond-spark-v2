<template>
  <div class="professor-page">
    <ProfessorNav />
    <main class="content">
      <div class="page-header">
        <h1>PAINEL DO PROFESSOR</h1>
        <p>Gerencie suas turmas e acompanhe o progresso dos alunos.</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-icon">🏫</span>
          <div>
            <span class="stat-num">{{ stats.classes }}</span>
            <span class="stat-label">TURMAS</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">👥</span>
          <div>
            <span class="stat-num">{{ stats.students }}</span>
            <span class="stat-label">ALUNOS</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📋</span>
          <div>
            <span class="stat-num">{{ stats.activities }}</span>
            <span class="stat-label">ATIVIDADES</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">✅</span>
          <div>
            <span class="stat-num">{{ stats.deliveries }}</span>
            <span class="stat-label">ENTREGAS</span>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>AÇÕES RÁPIDAS</h2>
        <div class="actions-grid">
          <NuxtLink to="/professor/turmas/nova" class="action-btn">
            <span class="action-icon">➕</span>
            <span>CRIAR TURMA</span>
          </NuxtLink>
          <NuxtLink to="/professor/atividades/nova" class="action-btn">
            <span class="action-icon">📝</span>
            <span>NOVA ATIVIDADE</span>
          </NuxtLink>
          <NuxtLink to="/professor/turmas" class="action-btn secondary">
            <span class="action-icon">🏫</span>
            <span>VER TURMAS</span>
          </NuxtLink>
          <NuxtLink to="/professor/relatorios" class="action-btn secondary">
            <span class="action-icon">📊</span>
            <span>RELATÓRIOS</span>
          </NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'professor' })

const supabase = useSupabaseClient()
const stats = ref({ classes: 0, students: 0, activities: 0, deliveries: 0 })

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const [{ count: classes }, { count: activities }] = await Promise.all([
    supabase.from('classes').select('*', { count: 'exact', head: true }).eq('teacher_id', user.id),
    supabase.from('activities').select('*', { count: 'exact', head: true }).eq('teacher_id', user.id),
  ])

  const { data: classIds } = await supabase.from('classes').select('id').eq('teacher_id', user.id)
  let students = 0
  if (classIds?.length) {
    const ids = classIds.map(c => c.id)
    const { count } = await supabase.from('class_students').select('*', { count: 'exact', head: true }).in('class_id', ids)
    students = count || 0
  }

  stats.value = { classes: classes || 0, students, activities: activities || 0, deliveries: 0 }
})
</script>

<style scoped>
.professor-page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 1200px; margin: 0 auto; }
.page-header { margin-bottom: 32px; }
.page-header h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 8px; }
.page-header p { color: var(--ink-2); font-size: 14px; margin: 0; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
.stat-card { display: flex; align-items: center; gap: 16px; padding: 20px 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; }
.stat-icon { font-size: 28px; }
.stat-num { display: block; font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--gold); }
.stat-label { display: block; font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); margin-top: 2px; }
.quick-actions h2 { font-family: var(--font-display); font-size: 14px; letter-spacing: 2px; color: var(--ink-2); margin: 0 0 16px; }
.actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.action-btn { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 24px 16px; background: linear-gradient(180deg, rgba(245,201,122,0.15), rgba(245,201,122,0.05)); border: 1px solid rgba(245,201,122,0.3); border-radius: 14px; color: var(--gold); font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; text-decoration: none; transition: all 0.2s; }
.action-btn:hover { background: linear-gradient(180deg, rgba(245,201,122,0.25), rgba(245,201,122,0.1)); box-shadow: 0 0 20px rgba(245,201,122,0.2); transform: translateY(-2px); }
.action-btn.secondary { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); color: var(--ink-1); }
.action-btn.secondary:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); }
.action-icon { font-size: 24px; }
</style>
