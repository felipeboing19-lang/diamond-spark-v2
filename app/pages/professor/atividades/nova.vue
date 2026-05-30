<template>
  <div class="professor-page">
    <ProfessorNav />
    <main class="content">
      <div class="page-header">
        <NuxtLink to="/professor/atividades" class="back-link">← ATIVIDADES</NuxtLink>
        <h1>NOVA ATIVIDADE</h1>
      </div>
      <div class="form-card">
        <div class="field">
          <label>TURMA *</label>
          <select v-model="form.class_id">
            <option value="">Selecione uma turma</option>
            <option v-for="c in classes" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
        <div class="field">
          <label>TÍTULO *</label>
          <input v-model="form.title" type="text" placeholder="Ex: Desafio de Empatia" />
        </div>
        <div class="field">
          <label>DESCRIÇÃO *</label>
          <textarea v-model="form.description" placeholder="Descreva a atividade..." rows="3"></textarea>
        </div>
        <div class="field">
          <label>CANVAS DA ATIVIDADE * <span class="field-hint">(serão executados nesta ordem pela equipe)</span></label>
          <CanvasTemplatePicker v-model="form.canvas_sequence" />
        </div>
        <div class="field">
          <label>QUEM PARTICIPA *</label>
          <div class="audience-toggle">
            <button :class="['aud-btn', { active: form.audience === 'all' }]" @click="form.audience = 'all'">
              Todos os alunos da turma
            </button>
            <button :class="['aud-btn', { active: form.audience === 'selected' }]" @click="form.audience = 'selected'">
              Selecionar alunos
            </button>
          </div>
          <div v-if="form.audience === 'selected'" class="students-box">
            <p v-if="!form.class_id" class="students-hint">Selecione uma turma primeiro.</p>
            <p v-else-if="loadingStudents" class="students-hint">Carregando alunos...</p>
            <p v-else-if="students.length === 0" class="students-hint">Esta turma ainda não tem alunos.</p>
            <template v-else>
              <div class="students-actions">
                <button class="link-btn" @click="selectAllStudents">Todos</button>
                <button class="link-btn" @click="form.selected = []">Limpar</button>
              </div>
              <label v-for="s in students" :key="s.id" class="student-row">
                <input type="checkbox" :value="s.id" v-model="form.selected" />
                <span>{{ s.name }}</span>
              </label>
            </template>
          </div>
        </div>
        <div class="field">
          <label>OBJETIVO PEDAGÓGICO</label>
          <textarea v-model="form.objective" placeholder="Qual é o objetivo desta atividade?" rows="2"></textarea>
        </div>
        <div class="field">
          <label>ETAPAS HABILITADAS</label>
          <div class="stages-picker">
            <button v-for="s in allStages" :key="s.key" :class="['stage-btn', s.key, { active: form.stages_enabled.includes(s.key) }]" @click="toggleStage(s.key)">
              {{ s.label }}
            </button>
          </div>
        </div>
        <div class="field">
          <label>CONFIGURAÇÕES</label>
          <div class="config-row">
            <label class="toggle-label">
              <input type="checkbox" v-model="form.sequential" />
              <span>Etapas sequenciais</span>
            </label>
            <label class="toggle-label">
              <input type="checkbox" v-model="form.team_mode" />
              <span>Trabalho em equipe</span>
            </label>
            <label class="toggle-label">
              <input type="checkbox" v-model="form.allow_peer_review" />
              <span>Avaliação entre pares</span>
            </label>
          </div>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="form-actions">
          <NuxtLink to="/professor/atividades" class="btn-cancel">CANCELAR</NuxtLink>
          <button class="btn-submit" :disabled="loading || !canSubmit" @click="createActivity">
            {{ loading ? 'CRIANDO...' : 'CRIAR ATIVIDADE' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default', middleware: 'professor' })
const supabase = useSupabaseClient()
const router = useRouter()
const classes = ref([])
const students = ref([])
const loadingStudents = ref(false)
const loading = ref(false)
const error = ref('')
const form = ref({
  class_id: '', title: '', description: '', canvas_sequence: [], objective: '',
  audience: 'all', selected: [],
  stages_enabled: ['sentir', 'imaginar', 'fazer', 'compartilhar'],
  sequential: true, team_mode: true, allow_peer_review: false
})
const allStages = [
  { key: 'sentir', label: 'SENTIR' },
  { key: 'imaginar', label: 'IMAGINAR' },
  { key: 'fazer', label: 'FAZER' },
  { key: 'compartilhar', label: 'COMPARTILHAR' },
]
const canSubmit = computed(() =>
  !!form.value.class_id &&
  !!form.value.title.trim() &&
  !!form.value.description.trim() &&
  form.value.canvas_sequence.length > 0 &&
  (form.value.audience === 'all' || form.value.selected.length > 0)
)
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase.from('classes').select('id, name').eq('teacher_id', user.id).eq('active', true)
  classes.value = data || []
})
async function loadStudents(classId) {
  if (!classId) { students.value = []; return }
  loadingStudents.value = true
  const { data: cs } = await supabase.from('class_students').select('student_id').eq('class_id', classId)
  const ids = (cs || []).map(x => x.student_id)
  if (ids.length === 0) { students.value = []; loadingStudents.value = false; return }
  const { data: profs } = await supabase.from('profiles').select('id, name').in('id', ids)
  students.value = profs || []
  loadingStudents.value = false
}
watch(() => form.value.class_id, (id) => {
  form.value.selected = []
  if (form.value.audience === 'selected') loadStudents(id)
})
watch(() => form.value.audience, (aud) => {
  if (aud === 'selected') loadStudents(form.value.class_id)
})
function selectAllStudents() {
  form.value.selected = students.value.map(s => s.id)
}
function toggleStage(key) {
  const idx = form.value.stages_enabled.indexOf(key)
  if (idx > -1) form.value.stages_enabled.splice(idx, 1)
  else form.value.stages_enabled.push(key)
}
async function createActivity() {
  error.value = ''
  if (!form.value.description.trim()) { error.value = 'A descrição da atividade é obrigatória.'; return }
  if (form.value.canvas_sequence.length === 0) { error.value = 'Escolha ao menos um canvas.'; return }
  if (form.value.audience === 'selected' && form.value.selected.length === 0) {
    error.value = 'Selecione ao menos um aluno.'; return
  }
  loading.value = true
  const { data: { user } } = await supabase.auth.getUser()

  // 1) cria a atividade
  const { data: act, error: err } = await supabase.from('activities').insert({
    teacher_id: user.id,
    class_id: form.value.class_id,
    title: form.value.title,
    description: form.value.description,
    canvas_sequence: form.value.canvas_sequence,
    audience: form.value.audience,
    objective: form.value.objective || null,
    stages_enabled: form.value.stages_enabled,
    sequential: form.value.sequential,
    team_mode: form.value.team_mode,
    allow_peer_review: form.value.allow_peer_review,
  }).select('id').single()
  if (err) { error.value = err.message; loading.value = false; return }

  // 2) define os participantes
  let participantIds = []
  if (form.value.audience === 'all') {
    const { data: cs } = await supabase.from('class_students').select('student_id').eq('class_id', form.value.class_id)
    participantIds = (cs || []).map(x => x.student_id)
  } else {
    participantIds = form.value.selected
  }

  // 3) cria a equipe automática da atividade e vincula os participantes
  const { data: team, error: teamErr } = await supabase.from('teams')
    .insert({ activity_id: act.id, name: form.value.title, color: '#ffc14d' })
    .select('id').single()
  if (teamErr) { error.value = 'Atividade criada, mas falhou ao montar a equipe: ' + teamErr.message; loading.value = false; return }

  if (participantIds.length > 0) {
    const rows = participantIds.map(sid => ({ team_id: team.id, student_id: sid }))
    const { error: memErr } = await supabase.from('team_members').insert(rows)
    if (memErr) { error.value = 'Atividade criada, mas falhou ao vincular alunos: ' + memErr.message; loading.value = false; return }
  }

  loading.value = false
  router.push('/professor/atividades')
}
</script>
<style scoped>
.professor-page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 720px; margin: 0 auto; }
.back-link { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--ink-2); text-decoration: none; display: inline-block; margin-bottom: 16px; }
.back-link:hover { color: var(--gold); }
h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 32px; }
.form-card { padding: 32px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; display: flex; flex-direction: column; gap: 20px; }
.field { display: flex; flex-direction: column; gap: 8px; }
.field label { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); }
.field-hint { font-family: var(--font-body); letter-spacing: 0; text-transform: none; color: var(--ink-2); font-size: 11px; }
.audience-toggle { display: flex; gap: 8px; }
.aud-btn { flex: 1; padding: 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: var(--ink-2); font-family: var(--font-body); font-size: 13px; cursor: pointer; transition: all 0.2s; }
.aud-btn.active { border-color: var(--gold); color: var(--gold); background: rgba(245,201,122,0.08); }
.students-box { margin-top: 12px; padding: 14px; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; background: rgba(255,255,255,0.02); max-height: 240px; overflow-y: auto; }
.students-hint { color: var(--ink-3); font-size: 13px; margin: 0; }
.students-actions { display: flex; gap: 14px; margin-bottom: 10px; }
.link-btn { background: none; border: none; color: var(--gold); font-size: 12px; cursor: pointer; padding: 0; }
.link-btn:hover { text-decoration: underline; }
.student-row { display: flex; align-items: center; gap: 10px; padding: 7px 0; cursor: pointer; font-size: 14px; color: var(--ink-1); }
.student-row input { width: 16px; height: 16px; accent-color: var(--gold); }
.field input, .field textarea, .field select { padding: 12px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--ink-0); font-family: var(--font-body); font-size: 15px; outline: none; transition: all 0.2s; resize: vertical; }
.field input:focus, .field textarea:focus, .field select:focus { border-color: rgba(245,201,122,0.4); background: rgba(245,201,122,0.04); }
.field select option { background: var(--bg-1); }
.stages-picker { display: flex; gap: 8px; flex-wrap: wrap; }
.stage-btn { padding: 8px 18px; background: transparent; border-radius: 999px; font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1); color: var(--ink-2); }
.stage-btn.sentir.active { color: #ff6b6b; border-color: #ff6b6b; background: rgba(255,107,107,0.1); }
.stage-btn.imaginar.active { color: #ffc14d; border-color: #ffc14d; background: rgba(255,193,77,0.1); }
.stage-btn.fazer.active { color: #3fe0a8; border-color: #3fe0a8; background: rgba(63,224,168,0.1); }
.stage-btn.compartilhar.active { color: #3fb4ff; border-color: #3fb4ff; background: rgba(63,180,255,0.1); }
.config-row { display: flex; flex-direction: column; gap: 10px; }
.toggle-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 14px; color: var(--ink-1); }
.toggle-label input { width: 16px; height: 16px; accent-color: var(--gold); }
.error { color: #ff6b8b; font-size: 13px; padding: 10px 14px; background: rgba(255,107,139,0.08); border: 1px solid rgba(255,107,139,0.25); border-radius: 8px; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; }
.btn-cancel { padding: 12px 24px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--ink-2); font-family: var(--font-display); font-size: 12px; letter-spacing: 1.5px; text-decoration: none; }
.btn-submit { padding: 12px 28px; background: linear-gradient(180deg, rgba(245,201,122,0.22), rgba(245,201,122,0.08)); border: 1px solid var(--gold); border-radius: 10px; color: var(--gold); font-family: var(--font-display); font-size: 12px; font-weight: 700; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; }
.btn-submit:hover:not(:disabled) { background: linear-gradient(180deg, rgba(245,201,122,0.38), rgba(245,201,122,0.18)); }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
