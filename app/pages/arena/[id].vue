<template>
  <div class="arena-page">
    <AlunoNav />
    <main class="arena-content">
      <div v-if="loading" class="loading">Carregando arena...</div>

      <div v-else-if="!activity" class="loading">Atividade não encontrada.</div>

      <!-- Sem canvas configurado -->
      <div v-else-if="sequence.length === 0" class="loading">
        Esta atividade ainda não tem canvas configurado pelo professor.
      </div>

      <!-- Não faz parte da atividade -->
      <div v-else-if="!team" class="team-gate">
        <button class="back-link" @click="$router.back()">← VOLTAR</button>
        <h1>{{ activity.title }}</h1>
        <p class="gate-sub">Você não faz parte desta atividade. Fale com seu professor se acha que deveria participar.</p>
      </div>

      <!-- Arena com canvas -->
      <div v-else class="arena">
        <div class="arena-grid">
          <div class="arena-main">
            <div class="arena-header">
              <button class="back-link" @click="$router.back()">← VOLTAR</button>
              <h1>{{ activity.title }}</h1>
              <p>{{ activity.description }}</p>
            </div>

            <!-- etapas da sequência -->
            <div class="steps">
              <button
                v-for="(tpl, i) in sequence"
                :key="tpl.key"
                class="step"
                :class="{ active: currentIndex === i }"
                @click="currentIndex = i"
              >
                <span class="step-num">{{ i + 1 }}</span>
                <span class="step-icon">{{ tpl.icon }}</span>
                <span class="step-name">{{ tpl.name }}</span>
              </button>
            </div>

            <!-- canvas atual -->
            <div class="canvas-wrap">
              <div class="canvas-head">
                <span class="canvas-step">CANVAS {{ currentIndex + 1 }} DE {{ sequence.length }}</span>
                <h2>{{ currentTemplate.icon }} {{ currentTemplate.name }}</h2>
                <p>{{ currentTemplate.desc }}</p>
              </div>

              <CanvasBoard
                :template="currentTemplate"
                :postits="currentPostits"
                :editors-by-postit="editorsByPostit"
                :focused-id="focusedId"
                :current-user-id="userId"
                @add="addPostit"
                @update="updatePostit"
                @delete="deletePostit"
                @focus="onFocus"
                @blur="onBlur"
              />

              <div class="canvas-nav">
                <button class="btn-ghost" :disabled="currentIndex === 0" @click="currentIndex--">← Anterior</button>
                <button class="btn-gold" v-if="currentIndex < sequence.length - 1" @click="currentIndex++">Próximo canvas →</button>
              </div>
            </div>

            <div class="complete-box">
              <div class="complete-info">
                <span class="complete-label">{{ iCompleted ? 'Você concluiu sua parte ✓' : 'Terminou sua parte?' }}</span>
                <span class="complete-sub">{{ completedIds.length }} de {{ members.length }} concluíram • a atividade continua aberta</span>
              </div>
              <button class="btn-complete" :class="{ done: iCompleted }" @click="toggleComplete">
                {{ iCompleted ? '✓ Concluído (desfazer)' : 'Marcar como concluída' }}
              </button>
            </div>

            <div class="provocations-box" v-if="provocations.length > 0">
              <h3>MENSAGENS DO PROFESSOR</h3>
              <div v-for="p in provocations" :key="p.id" class="prov-item">
                <p>{{ p.message }}</p>
                <span class="prov-date">{{ formatDate(p.created_at) }}</span>
              </div>
            </div>
          </div>

          <TeamPanel :team="team" :members="members" :online-ids="onlineIds" :editing-ids="editingIds" :completed-ids="completedIds" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'aluno' })
import { getCanvasTemplate } from '~/composables/useCanvasTemplates'

const route = useRoute()
const supabase = useSupabaseClient()

const loading = ref(true)
const activity = ref(null)
const userId = ref('')
const myName = ref('')

const team = ref(null)
const members = ref([])
let membersMap = {}

const postits = ref([])
const provocations = ref([])

const currentIndex = ref(0)
const onlineIds = ref([])
const editingIds = ref([])
const completedIds = ref([])
const editorsByPostit = ref({})
const focusedId = ref(null)
let myEditing = null

let channel = null
const updateTimers = {}

// ---- sequência de canvases -------------------------------------------------
const sequence = computed(() => {
  const seq = activity.value?.canvas_sequence || []
  return seq.map(getCanvasTemplate).filter(Boolean)
})
const currentTemplate = computed(() => sequence.value[currentIndex.value] || null)
const currentPostits = computed(() =>
  currentTemplate.value ? postits.value.filter(p => p.template === currentTemplate.value.key) : []
)
const iCompleted = computed(() => completedIds.value.includes(userId.value))

function formatDate(d) { return d ? new Date(d).toLocaleDateString('pt-BR') : '' }

async function toggleComplete() {
  const id = route.params.id
  if (iCompleted.value) {
    completedIds.value = completedIds.value.filter(x => x !== userId.value)
    await supabase.from('activity_completions').delete().eq('activity_id', id).eq('student_id', userId.value)
  } else {
    completedIds.value = [...completedIds.value, userId.value]
    await supabase.from('activity_completions').insert({ activity_id: id, student_id: userId.value })
  }
}

// ---- carregamento ----------------------------------------------------------
async function loadData() {
  const id = route.params.id
  if (!id) return

  const { data: { user } } = await supabase.auth.getUser()
  userId.value = user.id

  const { data: prof } = await supabase.from('profiles').select('name').eq('id', user.id).single()
  myName.value = prof?.name || 'Aluno'

  const { data: a } = await supabase.from('activities').select('*').eq('id', id).single()
  activity.value = a

  const { data: p } = await supabase.from('provocations').select('*').eq('activity_id', id).order('created_at', { ascending: false })
  provocations.value = p || []

  const { data: comps } = await supabase.from('activity_completions').select('student_id').eq('activity_id', id)
  completedIds.value = (comps || []).map(c => c.student_id)

  await resolveTeam(id)

  if (team.value) {
    await loadTeamData()
    setupRealtime()
  }

  loading.value = false
}

async function resolveTeam(activityId) {
  const { data } = await supabase
    .from('teams')
    .select('id, name, color, team_members!inner(student_id)')
    .eq('activity_id', activityId)
    .eq('team_members.student_id', userId.value)
  const t = data?.[0]
  team.value = t ? { id: t.id, name: t.name, color: t.color } : null
}

async function loadTeamData() {
  // membros
  const { data: tm } = await supabase.from('team_members').select('student_id').eq('team_id', team.value.id)
  const ids = (tm || []).map(x => x.student_id)
  const { data: profs } = await supabase.from('profiles').select('id, name').in('id', ids)
  members.value = profs || []
  membersMap = Object.fromEntries((profs || []).map(p => [p.id, p.name]))

  // post-its
  const { data: notes } = await supabase.from('canvas_postits').select('*').eq('team_id', team.value.id)
  postits.value = (notes || []).map(decorate)
}

function decorate(p) {
  return { ...p, author_name: membersMap[p.author_id] || '' }
}

// ---- realtime (post-its + presença) ---------------------------------------
function setupRealtime() {
  if (channel) supabase.removeChannel(channel)
  const teamId = team.value.id

  channel = supabase.channel('canvas:' + teamId, { config: { presence: { key: userId.value } } })

  channel
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'canvas_postits', filter: `team_id=eq.${teamId}` }, ({ new: row }) => {
      if (!postits.value.some(p => p.id === row.id)) postits.value.push(decorate(row))
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'canvas_postits', filter: `team_id=eq.${teamId}` }, ({ new: row }) => {
      const i = postits.value.findIndex(p => p.id === row.id)
      if (i === -1) return
      // não sobrescreve o texto do post-it que EU estou editando
      if (row.id === focusedId.value) {
        postits.value[i] = { ...postits.value[i], color: row.color, zone: row.zone }
      } else {
        postits.value[i] = decorate(row)
      }
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'canvas_postits', filter: `team_id=eq.${teamId}` }, ({ old: row }) => {
      postits.value = postits.value.filter(p => p.id !== row.id)
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_completions', filter: `activity_id=eq.${route.params.id}` }, ({ new: row }) => {
      if (!completedIds.value.includes(row.student_id)) completedIds.value = [...completedIds.value, row.student_id]
    })
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'activity_completions', filter: `activity_id=eq.${route.params.id}` }, ({ old: row }) => {
      completedIds.value = completedIds.value.filter(x => x !== row.student_id)
    })
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const metas = Object.values(state).flat()
      onlineIds.value = [...new Set(metas.map(m => m.user_id))]
      editingIds.value = [...new Set(metas.filter(m => m.editing).map(m => m.user_id))]
      const eb = {}
      metas.forEach(m => {
        if (m.editing && m.user_id !== userId.value) {
          (eb[m.editing] ||= []).push(m.name || 'Aluno')
        }
      })
      editorsByPostit.value = eb
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') trackPresence()
    })
}

function trackPresence() {
  if (channel) channel.track({ user_id: userId.value, name: myName.value, editing: myEditing })
}

// ---- ações nos post-its ----------------------------------------------------
async function addPostit({ zone, color }) {
  const { data, error } = await supabase.from('canvas_postits').insert({
    team_id: team.value.id,
    activity_id: route.params.id,
    template: currentTemplate.value.key,
    zone,
    content: '',
    color,
    author_id: userId.value,
  }).select('*').single()
  if (error) return
  if (!postits.value.some(p => p.id === data.id)) postits.value.push(decorate(data))
}

function updatePostit({ id, content }) {
  const note = postits.value.find(p => p.id === id)
  if (!note || note.author_id !== userId.value) return  // só o autor edita
  const i = postits.value.findIndex(p => p.id === id)
  if (i !== -1) postits.value[i] = { ...postits.value[i], content }
  clearTimeout(updateTimers[id])
  updateTimers[id] = setTimeout(async () => {
    await supabase.from('canvas_postits').update({ content }).eq('id', id)
  }, 400)
}

async function deletePostit(id) {
  const note = postits.value.find(p => p.id === id)
  if (!note || note.author_id !== userId.value) return  // só o autor exclui
  const { error } = await supabase.from('canvas_postits').delete().eq('id', id)
  if (error) return                                       // se o banco recusar, não some da tela
  postits.value = postits.value.filter(p => p.id !== id) // remove só após confirmar
}

function onFocus(id) { focusedId.value = id; myEditing = id; trackPresence() }
function onBlur(id) { if (focusedId.value === id) focusedId.value = null; myEditing = null; trackPresence() }

onMounted(loadData)
onBeforeUnmount(() => { if (channel) supabase.removeChannel(channel) })
</script>

<style scoped>
.arena-page { min-height: 100vh; background: var(--bg-0); }
.arena-content { padding: 28px 40px; max-width: 1240px; margin: 0 auto; }
.loading { text-align: center; padding: 80px; color: var(--ink-2); }
.error { color: #ff6b8b; font-size: 13px; padding: 10px 14px; background: rgba(255,107,139,0.08); border: 1px solid rgba(255,107,139,0.25); border-radius: 8px; margin-top: 16px; }

.back-link { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--ink-2); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 16px; display: inline-block; }
.back-link:hover { color: var(--gold); }
h1 { font-family: var(--font-display); font-size: 26px; color: var(--gold); margin: 0 0 6px; }

/* layout principal */
.arena-grid { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
@media (max-width: 980px) { .arena-grid { grid-template-columns: 1fr; } }
.arena-header { margin-bottom: 22px; }
.arena-header p { color: var(--ink-2); font-size: 14px; margin: 0; line-height: 1.5; }

/* etapas */
.steps { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 22px; }
.step { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 12px; cursor: pointer; transition: all .18s;
  background: var(--bg-1); border: 1px solid var(--bg-3); color: var(--ink-2); }
.step:hover { border-color: color-mix(in srgb, var(--gold) 45%, transparent); }
.step.active { border-color: var(--gold); background: color-mix(in srgb, var(--gold) 8%, var(--bg-1)); color: var(--ink-0); }
.step-num { width: 20px; height: 20px; display: grid; place-items: center; border-radius: 6px; background: var(--bg-3); color: var(--ink-1); font-size: 11px; font-weight: 800; font-family: var(--font-display); }
.step.active .step-num { background: var(--gold); color: var(--bg-0); }
.step-icon { font-size: 16px; }
.step-name { font-family: var(--font-display); font-size: 10px; letter-spacing: 1px; }

/* canvas */
.canvas-wrap { background: rgba(255,255,255,0.02); border: 1px solid var(--bg-3); border-radius: 18px; padding: 22px; margin-bottom: 22px; }
.canvas-head { margin-bottom: 18px; }
.canvas-step { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); display: block; margin-bottom: 6px; }
.canvas-head h2 { font-family: var(--font-display); font-size: 20px; color: var(--ink-0); margin: 0 0 6px; }
.canvas-head p { color: var(--ink-2); font-size: 13.5px; margin: 0; }
.canvas-nav { display: flex; justify-content: space-between; gap: 12px; margin-top: 22px; }

.btn-gold { padding: 11px 22px; background: linear-gradient(180deg, rgba(245,201,122,0.22), rgba(245,201,122,0.08)); border: 1px solid var(--gold); border-radius: 10px; color: var(--gold); font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; }
.btn-gold:hover:not(:disabled) { background: linear-gradient(180deg, rgba(245,201,122,0.38), rgba(245,201,122,0.18)); }
.btn-gold:disabled { opacity: .4; cursor: not-allowed; }
.btn-ghost { padding: 11px 20px; background: transparent; border: 1px solid var(--bg-3); border-radius: 10px; color: var(--ink-2); font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; cursor: pointer; }
.btn-ghost:disabled { opacity: .35; cursor: not-allowed; }

/* gate de equipe */
.team-gate { max-width: 760px; }
.gate-sub { color: var(--ink-2); font-size: 14px; margin: 0 0 24px; }
.gate-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 720px) { .gate-grid { grid-template-columns: 1fr; } }
.gate-card { background: var(--bg-1); border: 1px solid var(--bg-3); border-radius: 16px; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
.gate-title { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); }
.gate-card input { padding: 12px 14px; background: rgba(255,255,255,0.04); border: 1px solid var(--bg-3); border-radius: 10px; color: var(--ink-0); font-family: var(--font-body); font-size: 14px; outline: none; }
.gate-card input:focus { border-color: rgba(245,201,122,0.4); }
.gate-empty { color: var(--ink-3); font-size: 13px; }
.gate-teams { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.gate-teams li { display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 10px; background: var(--bg-2); }
.gate-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
.gate-tname { flex: 1; font-size: 14px; color: var(--ink-0); }
.gate-count { font-size: 12px; color: var(--ink-2); }
.btn-join { padding: 7px 14px; background: transparent; border: 1px solid var(--gold); border-radius: 8px; color: var(--gold); font-family: var(--font-display); font-size: 10px; letter-spacing: 1px; cursor: pointer; }
.btn-join:hover { background: rgba(245,201,122,0.1); }

/* conclusão */
.complete-box { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 18px 20px; margin-bottom: 22px; background: rgba(63,224,168,0.05); border: 1px solid rgba(63,224,168,0.2); border-radius: 14px; }
.complete-info { display: flex; flex-direction: column; gap: 3px; }
.complete-label { font-family: var(--font-display); font-size: 13px; color: var(--ink-0); }
.complete-sub { font-size: 12px; color: var(--ink-2); }
.btn-complete { padding: 12px 22px; border-radius: 10px; cursor: pointer; font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 1.5px; transition: all 0.2s; background: linear-gradient(180deg, rgba(63,224,168,0.2), rgba(63,224,168,0.08)); border: 1px solid #3fe0a8; color: #3fe0a8; }
.btn-complete:hover { background: linear-gradient(180deg, rgba(63,224,168,0.32), rgba(63,224,168,0.15)); }
.btn-complete.done { background: transparent; border-color: var(--bg-3); color: var(--ink-2); }

/* provocações */
.provocations-box { padding: 20px; background: rgba(245,201,122,0.04); border: 1px solid rgba(245,201,122,0.15); border-radius: 12px; }
.provocations-box h3 { font-family: var(--font-display); font-size: 11px; letter-spacing: 2px; color: var(--gold); margin: 0 0 14px; }
.prov-item { padding: 12px; background: rgba(255,255,255,0.04); border-radius: 8px; margin-bottom: 8px; }
.prov-item p { margin: 0 0 4px; color: var(--ink-1); font-size: 13px; }
.prov-date { font-size: 11px; color: var(--ink-3); }
</style>
