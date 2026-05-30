<template>
  <div class="page">
    <AlunoNav />
    <main class="content">
      <a href="/turmas" class="back-link">VOLTAR</a>

      <div v-if="loading" class="loading">Carregando...</div>

      <div v-else>
        <h1 class="title">{{ turma ? turma.name : 'Turma' }}</h1>
        <p class="subtitle">{{ turma ? turma.description : '' }}</p>

        <div class="tabs">
          <button :class="{ active: tab === 'atividades' }" @click="tab = 'atividades'">ATIVIDADES</button>
          <button :class="{ active: tab === 'alunos' }" @click="tab = 'alunos'">ALUNOS</button>
        </div>

        <div v-if="tab === 'atividades'">
          <div v-if="atividades.length === 0" class="empty">
            <p>Nenhuma atividade disponivel ainda.</p>
          </div>
          <div v-else class="grid">
            <div v-for="a in atividades" :key="a.id" class="card" :class="a.status">
              <span class="badge" :class="a.status">{{ statusLabel(a.status) }}</span>
              <h3>{{ a.title }}</h3>
              <p>{{ a.description }}</p>
              <div class="card-footer">
                <span class="date">{{ formatDate(a.created_at) }}</span>
                <a v-if="a.status === 'active'" :href="'/arena/' + a.id" class="btn-enter">ENTRAR NA ARENA</a>
                <span v-else class="btn-disabled">{{ a.status === 'draft' ? 'EM PREPARACAO' : 'ENCERRADA' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="tab === 'alunos'">
          <div v-if="alunos.length === 0" class="empty"><p>Sem alunos ainda.</p></div>
          <div v-else class="alunos-grid">
            <div v-for="a in alunos" :key="a.id" class="aluno-card">
              <div class="avatar" :style="{ color: getColor(a.riasec_profile), borderColor: getColor(a.riasec_profile) }">
                {{ a.riasec_profile || '?' }}
              </div>
              <span class="aluno-name">{{ a.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'auth' })
const route = useRoute()
const supabase = useSupabaseClient()

const turma = ref(null)
const atividades = ref([])
const alunos = ref([])
const loading = ref(true)
const tab = ref('atividades')

const colors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }
function getColor(code) { return colors[code] || '#f5c97a' }
function statusLabel(s) { return { draft: 'RASCUNHO', active: 'ATIVA', closed: 'ENCERRADA' }[s] || s }
function formatDate(d) { return d ? new Date(d).toLocaleDateString('pt-BR') : '' }

onMounted(async () => {
  try {
    const id = route.params.id
    const { data: t } = await supabase.from('classes').select('*').eq('id', id).single()
    turma.value = t

    const { data: a } = await supabase.from('activities').select('*').eq('class_id', id).order('created_at', { ascending: false })
    atividades.value = a || []

    const { data: cs } = await supabase.from('class_students').select('student_id, profiles(id, name, riasec_profile)').eq('class_id', id)
    alunos.value = (cs || []).map(c => c.profiles).filter(Boolean)

    loading.value = false
  } catch (e) {
    console.error(e)
    loading.value = false
  }
})
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 900px; margin: 0 auto; }
.back-link { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--ink-2); text-decoration: none; display: inline-block; margin-bottom: 20px; }
.back-link:hover { color: var(--gold); }
.loading { text-align: center; padding: 80px; color: var(--ink-2); }
.title { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 6px; }
.subtitle { color: var(--ink-2); font-size: 14px; margin: 0 0 32px; }
.tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
.tabs button { padding: 10px 20px; background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--ink-3); font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; cursor: pointer; }
.tabs button.active { color: var(--gold); border-bottom-color: var(--gold); }
.empty { text-align: center; padding: 60px; color: var(--ink-2); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.card { padding: 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; display: flex; flex-direction: column; gap: 10px; }
.card.active { border-color: rgba(63,224,168,0.2); }
.badge { font-family: var(--font-display); font-size: 9px; letter-spacing: 1.5px; padding: 4px 10px; border-radius: 999px; width: fit-content; }
.badge.active { color: #3fe0a8; border: 1px solid #3fe0a8; background: rgba(63,224,168,0.08); }
.badge.draft { color: var(--ink-3); border: 1px solid rgba(255,255,255,0.15); }
.badge.closed { color: var(--ink-3); border: 1px solid rgba(255,255,255,0.08); }
.card h3 { font-family: var(--font-display); font-size: 15px; color: var(--ink-0); margin: 0; }
.card p { font-size: 13px; color: var(--ink-2); margin: 0; }
.card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); }
.date { font-size: 12px; color: var(--ink-3); }
.btn-enter { padding: 8px 14px; background: linear-gradient(180deg, rgba(245,201,122,0.15), rgba(245,201,122,0.05)); border: 1px solid rgba(245,201,122,0.3); border-radius: 8px; color: var(--gold); font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; text-decoration: none; }
.btn-disabled { font-family: var(--font-display); font-size: 10px; color: var(--ink-3); }
.alunos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; }
.aluno-card { text-align: center; padding: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.avatar { width: 50px; height: 50px; border-radius: 50%; border: 2px solid; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 18px; font-weight: 900; }
.aluno-name { font-size: 12px; color: var(--ink-0); }
</style>
