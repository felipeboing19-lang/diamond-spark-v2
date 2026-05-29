<template>
  <div class="page">
    <AlunoNav />
    <main class="content">
      <div class="page-header">
        <h1>MINHAS TURMAS</h1>
        <p>Entre em uma turma usando o código fornecido pelo seu professor.</p>
      </div>

      <!-- Entrar em turma -->
      <div class="join-card">
        <h2>ENTRAR EM UMA TURMA</h2>
        <div class="join-row">
          <input
            v-model="code"
            type="text"
            placeholder="Digite o código da turma (ex: CB8065)"
            maxlength="6"
            @keyup.enter="joinClass"
            style="text-transform: uppercase"
          />
          <button class="join-btn" :disabled="loading || code.length < 6" @click="joinClass">
            {{ loading ? 'ENTRANDO...' : 'ENTRAR' }}
          </button>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
      </div>

      <!-- Turmas do aluno -->
      <div class="section-title">TURMAS MATRICULADAS</div>

      <div v-if="loadingClasses" class="loading">Carregando...</div>

      <div v-else-if="classes.length === 0" class="empty">
        <span class="empty-icon">🏫</span>
        <p>Você ainda não está em nenhuma turma.</p>
        <p class="hint">Peça o código ao seu professor e entre acima.</p>
      </div>

      <div v-else class="classes-grid">
        <div v-for="c in classes" :key="c.id" class="class-card">
          <div class="class-top">
            <div class="class-icon">🏫</div>
            <div>
              <h3>{{ c.name }}</h3>
              <p>{{ c.description || 'Sem descrição' }}</p>
            </div>
          </div>
          <div class="class-footer">
            <span class="class-date">Desde {{ formatDate(c.joined_at) }}</span>
            <NuxtLink :to="`/game`" class="btn-enter">VER ATIVIDADES →</NuxtLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'auth' })
const supabase = useSupabaseClient()
const code = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const loadingClasses = ref(true)
const classes = ref([])

onMounted(async () => {
  await loadClasses()
})

async function loadClasses() {
  loadingClasses.value = true
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase
    .from('class_students')
    .select('joined_at, classes(id, name, description, active)')
    .eq('student_id', user.id)
    .order('joined_at', { ascending: false })
  classes.value = (data || []).map(cs => ({ ...cs.classes, joined_at: cs.joined_at }))
  loadingClasses.value = false
}

async function joinClass() {
  if (code.value.length < 6) return
  loading.value = true
  error.value = ''
  success.value = ''
  const { data: { user } } = await supabase.auth.getUser()

  const { data: turma } = await supabase
    .from('classes')
    .select('id, name, active')
    .eq('code', code.value.toUpperCase())
    .single()

  if (!turma) { error.value = 'Turma não encontrada. Verifique o código.'; loading.value = false; return }
  if (!turma.active) { error.value = 'Esta turma está inativa.'; loading.value = false; return }

  const { data: existing } = await supabase
    .from('class_students')
    .select('id')
    .eq('class_id', turma.id)
    .eq('student_id', user.id)
    .single()

  if (existing) { error.value = 'Você já está nesta turma!'; loading.value = false; return }

  const { error: err } = await supabase.from('class_students').insert({
    class_id: turma.id,
    student_id: user.id
  })

  loading.value = false
  if (err) { error.value = err.message; return }
  success.value = `Você entrou na turma "${turma.name}" com sucesso!`
  code.value = ''
  await loadClasses()
}

function formatDate(d) { return new Date(d).toLocaleDateString('pt-BR') }
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 1000px; margin: 0 auto; }
.page-header { margin-bottom: 32px; }
h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 6px; }
.page-header p { color: var(--ink-2); font-size: 14px; margin: 0; }
.join-card { padding: 28px 32px; background: rgba(255,255,255,0.04); border: 1px solid rgba(245,201,122,0.2); border-radius: 16px; margin-bottom: 40px; }
.join-card h2 { font-family: var(--font-display); font-size: 14px; letter-spacing: 2px; color: var(--gold); margin: 0 0 16px; }
.join-row { display: flex; gap: 12px; }
.join-row input { flex: 1; padding: 14px 18px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--ink-0); font-family: var(--font-display); font-size: 18px; letter-spacing: 4px; outline: none; transition: all 0.2s; }
.join-row input:focus { border-color: rgba(245,201,122,0.5); background: rgba(245,201,122,0.04); }
.join-row input::placeholder { letter-spacing: 1px; font-size: 14px; color: var(--ink-3); font-family: var(--font-body); }
.join-btn { padding: 14px 28px; background: linear-gradient(180deg, rgba(245,201,122,0.22), rgba(245,201,122,0.08)); border: 1px solid var(--gold); border-radius: 10px; color: var(--gold); font-family: var(--font-display); font-size: 13px; font-weight: 700; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.join-btn:hover:not(:disabled) { background: linear-gradient(180deg, rgba(245,201,122,0.38), rgba(245,201,122,0.18)); box-shadow: 0 0 20px rgba(245,201,122,0.2); }
.join-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.error { margin: 10px 0 0; color: #ff6b8b; font-size: 13px; }
.success { margin: 10px 0 0; color: var(--col-s); font-size: 13px; }
.section-title { font-family: var(--font-display); font-size: 12px; letter-spacing: 2px; color: var(--ink-2); margin-bottom: 16px; }
.loading { text-align: center; padding: 40px; color: var(--ink-2); }
.empty { text-align: center; padding: 60px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.empty-icon { font-size: 40px; }
.empty p { color: var(--ink-2); margin: 0; }
.empty .hint { color: var(--ink-3); font-size: 13px; }
.classes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
.class-card { padding: 20px 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; display: flex; flex-direction: column; gap: 16px; transition: all 0.2s; }
.class-card:hover { border-color: rgba(245,201,122,0.25); box-shadow: 0 0 16px rgba(245,201,122,0.06); }
.class-top { display: flex; gap: 14px; align-items: flex-start; }
.class-icon { font-size: 28px; flex-shrink: 0; }
.class-top h3 { font-family: var(--font-display); font-size: 15px; color: var(--ink-0); margin: 0 0 4px; }
.class-top p { color: var(--ink-3); font-size: 13px; margin: 0; }
.class-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
.class-date { font-size: 12px; color: var(--ink-3); }
.btn-enter { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--gold); text-decoration: none; transition: all 0.2s; }
.btn-enter:hover { text-shadow: 0 0 8px rgba(245,201,122,0.5); }
</style>
