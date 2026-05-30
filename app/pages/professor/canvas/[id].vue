<template>
  <div class="prof-canvas-page">
    <ProfessorNav />
    <main class="content">
      <div v-if="loading" class="loading">Carregando canvas...</div>
      <div v-else-if="!activity" class="loading">Atividade não encontrada.</div>
      <div v-else-if="teams.length === 0" class="loading">Nenhuma equipe vinculada a esta atividade ainda.</div>

      <div v-else>
        <div class="header">
          <button class="back-link" @click="$router.back()">← VOLTAR</button>
          <div class="header-row">
            <div>
              <h1>{{ activity.title }}</h1>
              <p>{{ activity.description }}</p>
            </div>
            <span class="live-badge"><i></i> AO VIVO</span>
          </div>
        </div>

        <!-- seletor de equipe (se houver mais de uma) -->
        <div class="team-switch" v-if="teams.length > 1">
          <span class="ts-label">EQUIPE:</span>
          <select v-model="selectedTeamId" @change="switchTeam">
            <option v-for="t in teams" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
        </div>

        <div class="arena-grid" v-if="sequence.length">
          <div class="arena-main">
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

            <div class="canvas-wrap" v-if="currentTemplate">
              <div class="canvas-head">
                <span class="canvas-step">CANVAS {{ currentIndex + 1 }} DE {{ sequence.length }}</span>
                <h2>{{ currentTemplate.icon }} {{ currentTemplate.name }}</h2>
                <p>{{ currentTemplate.desc }}</p>
              </div>

              <CanvasBoard
                :template="currentTemplate"
                :postits="currentPostits"
                :editors-by-postit="editorsByPostit"
                :readonly="true"
              />
            </div>
          </div>

          <TeamPanel :team="currentTeam" :members="members" :online-ids="onlineIds" :editing-ids="editingIds" :completed-ids="completedIds" />
        </div>

        <div v-else class="loading">Esta atividade não tem canvas configurado.</div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'professor' })
import { getCanvasTemplate } from '~/composables/useCanvasTemplates'

const route = useRoute()
const supabase = useSupabaseClient()

const loading = ref(true)
const activity = ref(null)
const teams = ref([])
const selectedTeamId = ref('')
const members = ref([])
let membersMap = {}
const postits = ref([])

const currentIndex = ref(0)
const onlineIds = ref([])
const editingIds = ref([])
const completedIds = ref([])
const editorsByPostit = ref({})

let channel = null

const sequence = computed(() => (activity.value?.canvas_sequence || []).map(getCanvasTemplate).filter(Boolean))
const currentTemplate = computed(() => sequence.value[currentIndex.value] || null)
const currentTeam = computed(() => teams.value.find(t => t.id === selectedTeamId.value) || { name: '', color: '' })
const currentPostits = computed(() =>
  currentTemplate.value ? postits.value.filter(p => p.template === currentTemplate.value.key) : []
)

function decorate(p) { return { ...p, author_name: membersMap[p.author_id] || '' } }

async function loadData() {
  const id = route.params.id
  if (!id) return

  const { data: a } = await supabase.from('activities').select('*').eq('id', id).single()
  activity.value = a

  const { data: ts } = await supabase.from('teams').select('id, name, color').eq('activity_id', id).order('created_at', { ascending: true })
  teams.value = ts || []

  const { data: comps } = await supabase.from('activity_completions').select('student_id').eq('activity_id', id)
  completedIds.value = (comps || []).map(c => c.student_id)

  if (teams.value.length > 0) {
    selectedTeamId.value = teams.value[0].id
    await loadTeam()
  }
  loading.value = false
}

async function loadTeam() {
  const teamId = selectedTeamId.value

  const { data: tm } = await supabase.from('team_members').select('student_id').eq('team_id', teamId)
  const ids = (tm || []).map(x => x.student_id)
  const { data: profs } = ids.length ? await supabase.from('profiles').select('id, name').in('id', ids) : { data: [] }
  members.value = profs || []
  membersMap = Object.fromEntries((profs || []).map(p => [p.id, p.name]))

  const { data: notes } = await supabase.from('canvas_postits').select('*').eq('team_id', teamId)
  postits.value = (notes || []).map(decorate)

  setupRealtime(teamId)
}

async function switchTeam() {
  if (channel) supabase.removeChannel(channel)
  onlineIds.value = []; editingIds.value = []; editorsByPostit.value = {}
  await loadTeam()
}

function setupRealtime(teamId) {
  if (channel) supabase.removeChannel(channel)
  channel = supabase.channel('canvas:' + teamId, { config: { presence: { key: 'prof-' + Math.random().toString(36).slice(2) } } })

  channel
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'canvas_postits', filter: `team_id=eq.${teamId}` }, ({ new: row }) => {
      if (!postits.value.some(p => p.id === row.id)) postits.value.push(decorate(row))
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'canvas_postits', filter: `team_id=eq.${teamId}` }, ({ new: row }) => {
      const i = postits.value.findIndex(p => p.id === row.id)
      if (i !== -1) postits.value[i] = decorate(row)
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
      const metas = Object.values(channel.presenceState()).flat()
      onlineIds.value = [...new Set(metas.map(m => m.user_id).filter(Boolean))]
      editingIds.value = [...new Set(metas.filter(m => m.editing).map(m => m.user_id))]
      const eb = {}
      metas.forEach(m => { if (m.editing) (eb[m.editing] ||= []).push(m.name || 'Aluno') })
      editorsByPostit.value = eb
    })
    .subscribe()
}

onMounted(loadData)
onBeforeUnmount(() => { if (channel) supabase.removeChannel(channel) })
</script>

<style scoped>
.prof-canvas-page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 28px 40px; max-width: 1240px; margin: 0 auto; }
.loading { text-align: center; padding: 80px; color: var(--ink-2); }

.back-link { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--ink-2); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 16px; display: inline-block; }
.back-link:hover { color: var(--gold); }
.header { margin-bottom: 18px; }
.header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
h1 { font-family: var(--font-display); font-size: 26px; color: var(--gold); margin: 0 0 6px; }
.header-row p { color: var(--ink-2); font-size: 14px; margin: 0; }
.live-badge { display: inline-flex; align-items: center; gap: 7px; font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; color: #ff6b6b; border: 1px solid rgba(255,107,107,.3); background: rgba(255,107,107,.08); padding: 6px 12px; border-radius: 999px; white-space: nowrap; }
.live-badge i { width: 8px; height: 8px; border-radius: 50%; background: #ff6b6b; animation: pulse 1.4s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .3; } }

.team-switch { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.ts-label { font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; color: var(--ink-3); }
.team-switch select { padding: 8px 12px; background: var(--bg-1); border: 1px solid var(--bg-3); border-radius: 8px; color: var(--ink-0); font-family: var(--font-body); font-size: 14px; outline: none; }

.arena-grid { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
@media (max-width: 980px) { .arena-grid { grid-template-columns: 1fr; } }

.steps { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 22px; }
.step { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 12px; cursor: pointer; transition: all .18s; background: var(--bg-1); border: 1px solid var(--bg-3); color: var(--ink-2); }
.step:hover { border-color: color-mix(in srgb, var(--gold) 45%, transparent); }
.step.active { border-color: var(--gold); background: color-mix(in srgb, var(--gold) 8%, var(--bg-1)); color: var(--ink-0); }
.step-num { width: 20px; height: 20px; display: grid; place-items: center; border-radius: 6px; background: var(--bg-3); color: var(--ink-1); font-size: 11px; font-weight: 800; font-family: var(--font-display); }
.step.active .step-num { background: var(--gold); color: var(--bg-0); }
.step-icon { font-size: 16px; }
.step-name { font-family: var(--font-display); font-size: 10px; letter-spacing: 1px; }

.canvas-wrap { background: rgba(255,255,255,0.02); border: 1px solid var(--bg-3); border-radius: 18px; padding: 22px; margin-bottom: 22px; }
.canvas-head { margin-bottom: 18px; }
.canvas-step { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); display: block; margin-bottom: 6px; }
.canvas-head h2 { font-family: var(--font-display); font-size: 20px; color: var(--ink-0); margin: 0 0 6px; }
.canvas-head p { color: var(--ink-2); font-size: 13.5px; margin: 0; }
</style>
