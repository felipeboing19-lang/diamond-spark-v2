<template>
  <div class="professor-page">
    <ProfessorNav />
    <main class="content">
      <div class="page-header">
        <div>
          <h1>ATIVIDADES</h1>
          <p>Gerencie as atividades das suas turmas.</p>
        </div>
        <NuxtLink to="/professor/atividades/nova" class="create-btn">➕ NOVA ATIVIDADE</NuxtLink>
      </div>
      <div v-if="loading" class="loading">Carregando...</div>
      <div v-else-if="activities.length === 0" class="empty">
        <span class="empty-icon">📋</span>
        <h3>Nenhuma atividade ainda</h3>
        <p>Crie sua primeira atividade para uma turma.</p>
        <NuxtLink to="/professor/atividades/nova" class="create-btn">NOVA ATIVIDADE</NuxtLink>
      </div>
      <div v-else class="activities-list">
        <div v-for="a in activities" :key="a.id" class="activity-card">
          <div class="activity-header">
            <div>
              <h3>{{ a.title }}</h3>
              <span class="class-name">{{ a.classes?.name }}</span>
            </div>
            <span class="status-badge" :class="a.status">{{ statusLabel(a.status) }}</span>
          </div>
          <p v-if="a.description" class="activity-desc">{{ a.description }}</p>
          <div class="stages-row">
            <span v-for="s in a.stages_enabled" :key="s" class="stage-tag" :class="s">{{ s.toUpperCase() }}</span>
          </div>
          <div class="activity-footer">
            <span class="date">{{ formatDate(a.created_at) }}</span>
            <div class="activity-actions">
              <NuxtLink :to="`/professor/atividades/${a.id}`" class="btn-view">VER</NuxtLink>
              <button class="btn-status" @click="cycleStatus(a)">
                {{ a.status === 'draft' ? 'PUBLICAR' : a.status === 'active' ? 'ENCERRAR' : 'REABRIR' }}
              </button>
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
const activities = ref([])
const loading = ref(true)
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase.from('activities').select('*, classes(name)').eq('teacher_id', user.id).order('created_at', { ascending: false })
  activities.value = data || []
  loading.value = false
})
function statusLabel(s) { return { draft: 'RASCUNHO', active: 'ATIVA', closed: 'ENCERRADA' }[s] || s }
function formatDate(d) { return new Date(d).toLocaleDateString('pt-BR') }
async function cycleStatus(a) {
  const next = { draft: 'active', active: 'closed', closed: 'active' }[a.status]
  await supabase.from('activities').update({ status: next }).eq('id', a.id)
  a.status = next
}
</script>
<style scoped>
.professor-page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 1200px; margin: 0 auto; }
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 6px; }
.page-header p { color: var(--ink-2); font-size: 14px; margin: 0; }
.create-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(180deg, rgba(245,201,122,0.2), rgba(245,201,122,0.08)); border: 1px solid var(--gold); border-radius: 10px; color: var(--gold); font-family: var(--font-display); font-size: 12px; letter-spacing: 1.5px; text-decoration: none; cursor: pointer; transition: all 0.2s; }
.create-btn:hover { background: linear-gradient(180deg, rgba(245,201,122,0.35), rgba(245,201,122,0.15)); }
.loading, .empty { text-align: center; padding: 80px; color: var(--ink-2); }
.empty { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.empty-icon { font-size: 48px; }
.empty h3 { font-family: var(--font-display); font-size: 18px; color: var(--ink-0); margin: 0; }
.activities-list { display: flex; flex-direction: column; gap: 16px; }
.activity-card { padding: 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; display: flex; flex-direction: column; gap: 12px; }
.activity-header { display: flex; justify-content: space-between; align-items: flex-start; }
.activity-header h3 { font-family: var(--font-display); font-size: 16px; color: var(--ink-0); margin: 0 0 4px; }
.class-name { font-size: 12px; color: var(--ink-3); }
.status-badge { font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; padding: 4px 10px; border-radius: 999px; flex-shrink: 0; }
.status-badge.draft { color: var(--ink-2); border: 1px solid rgba(255,255,255,0.15); }
.status-badge.active { color: var(--col-s); border: 1px solid var(--col-s); background: rgba(63,224,168,0.08); }
.status-badge.closed { color: var(--ink-3); border: 1px solid rgba(255,255,255,0.08); }
.activity-desc { margin: 0; font-size: 13px; color: var(--ink-2); line-height: 1.5; }
.stages-row { display: flex; gap: 8px; }
.stage-tag { font-family: var(--font-display); font-size: 9px; letter-spacing: 1.5px; padding: 3px 10px; border-radius: 999px; }
.stage-tag.sentir { color: #ff6b6b; border: 1px solid #ff6b6b; background: rgba(255,107,107,0.08); }
.stage-tag.imaginar { color: #ffc14d; border: 1px solid #ffc14d; background: rgba(255,193,77,0.08); }
.stage-tag.fazer { color: #3fe0a8; border: 1px solid #3fe0a8; background: rgba(63,224,168,0.08); }
.stage-tag.compartilhar { color: #3fb4ff; border: 1px solid #3fb4ff; background: rgba(63,180,255,0.08); }
.activity-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); }
.date { font-size: 12px; color: var(--ink-3); }
.activity-actions { display: flex; gap: 8px; }
.btn-view { padding: 8px 16px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ink-2); font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; text-decoration: none; transition: all 0.2s; }
.btn-view:hover { border-color: var(--gold); color: var(--gold); }
.btn-status { padding: 8px 16px; background: linear-gradient(180deg, rgba(245,201,122,0.15), rgba(245,201,122,0.05)); border: 1px solid rgba(245,201,122,0.3); border-radius: 8px; color: var(--gold); font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; }
.btn-status:hover { background: linear-gradient(180deg, rgba(245,201,122,0.25), rgba(245,201,122,0.1)); }
</style>
