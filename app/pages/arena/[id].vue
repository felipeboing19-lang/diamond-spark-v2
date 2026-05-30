<template>
  <div class="arena-page">
    <AlunoNav />
    <main class="arena-content">
      <div v-if="loading" class="loading">Carregando arena...</div>

      <div v-else-if="!activity" class="loading">Atividade nao encontrada.</div>

      <div v-else class="arena">
        <div class="arena-header">
          <a href="/turmas" class="back-link">VOLTAR</a>
          <div class="arena-title">
            <h1>{{ activity.title }}</h1>
            <p>{{ activity.description }}</p>
          </div>
        </div>

        <div class="stages-nav">
          <button
            v-for="(s, i) in stages"
            :key="s.key"
            :class="['stage-btn', s.key, { active: currentStage === i, done: completedStages.includes(s.key) }]"
            @click="goToStage(i)"
          >
            <span class="stage-icon">{{ s.icon }}</span>
            <span class="stage-name">{{ s.label }}</span>
            <span v-if="completedStages.includes(s.key)" class="check">✓</span>
          </button>
        </div>

        <div class="stage-content" :class="stages[currentStage].key">
          <div class="stage-header">
            <span class="stage-num">ETAPA {{ currentStage + 1 }} DE {{ stages.length }}</span>
            <h2>{{ stages[currentStage].label }}</h2>
            <p>{{ stages[currentStage].desc }}</p>
          </div>

          <div class="delivery-area">
            <label class="delivery-label">SUA RESPOSTA</label>
            <textarea
              v-model="answers[stages[currentStage].key]"
              :placeholder="stages[currentStage].placeholder"
              rows="8"
            ></textarea>

            <div class="delivery-actions">
              <button class="btn-save" @click="saveDraft">SALVAR RASCUNHO</button>
              <button class="btn-submit" :disabled="!answers[stages[currentStage].key]" @click="submitStage">
                {{ currentStage === stages.length - 1 ? 'FINALIZAR' : 'ENTREGAR E CONTINUAR' }}
              </button>
            </div>

            <p v-if="saveMsg" class="save-msg">{{ saveMsg }}</p>
          </div>
        </div>

        <div class="provocations-box" v-if="provocations.length > 0">
          <h3>MENSAGENS DO PROFESSOR</h3>
          <div v-for="p in provocations" :key="p.id" class="prov-item">
            <p>{{ p.message }}</p>
            <span class="prov-date">{{ formatDate(p.created_at) }}</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default', middleware: 'auth' })
const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()

const activity = ref(null)
const loading = ref(true)
const currentStage = ref(0)
const completedStages = ref([])
const answers = ref({ sentir: '', imaginar: '', fazer: '', compartilhar: '' })
const provocations = ref([])
const saveMsg = ref('')

const allStages = [
  { key: 'sentir', label: 'SENTIR', icon: '❤️', desc: 'Observe o mundo ao seu redor. O que voce ve? O que te preocupa? Quem e afetado por esse problema?', placeholder: 'Descreva o que voce sentiu e observou...' },
  { key: 'imaginar', label: 'IMAGINAR', icon: '💡', desc: 'Agora que voce entendeu o problema, o que voce imagina como solucao? Seja criativo!', placeholder: 'Descreva sua ideia de solucao...' },
  { key: 'fazer', label: 'FAZER', icon: '🔨', desc: 'Mao na massa! Coloque sua ideia em pratica. O que voce vai criar ou fazer?', placeholder: 'Descreva o que voce fez ou criou...' },
  { key: 'compartilhar', label: 'COMPARTILHAR', icon: '📣', desc: 'Mostre ao mundo! Compartilhe sua solucao e inspire outras pessoas.', placeholder: 'Como voce compartilhou sua solucao?' },
]

const stages = computed(() => {
  if (!activity.value) return allStages
  return allStages.filter(s => activity.value.stages_enabled?.includes(s.key))
})

function formatDate(d) { return d ? new Date(d).toLocaleDateString('pt-BR') : '' }

function goToStage(i) {
  if (i <= currentStage.value || completedStages.value.includes(stages.value[i - 1]?.key)) {
    currentStage.value = i
  }
}

async function saveDraft() {
  saveMsg.value = 'Rascunho salvo!'
  setTimeout(() => { saveMsg.value = '' }, 2000)
}

async function submitStage() {
  const stage = stages.value[currentStage.value]
  completedStages.value.push(stage.key)

  if (currentStage.value < stages.value.length - 1) {
    currentStage.value++
  } else {
    saveMsg.value = 'Atividade concluida! Parabens!'
  }
}

onMounted(async () => {
  try {
    const { data: a } = await supabase.from('activities').select('*').eq('id', route.params.id).single()
    activity.value = a

    const { data: p } = await supabase.from('provocations').select('*').eq('activity_id', route.params.id).order('created_at', { ascending: false })
    provocations.value = p || []

    loading.value = false
  } catch (e) {
    console.error(e)
    loading.value = false
  }
})
</script>

<style scoped>
.arena-page { min-height: 100vh; background: var(--bg-0); }
.arena-content { padding: 32px 48px; max-width: 900px; margin: 0 auto; }
.loading { text-align: center; padding: 80px; color: var(--ink-2); }
.back-link { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--ink-2); text-decoration: none; display: inline-block; margin-bottom: 16px; }
.back-link:hover { color: var(--gold); }
.arena-header { margin-bottom: 32px; }
h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 6px; }
.arena-header p { color: var(--ink-2); font-size: 14px; margin: 0; }
.stages-nav { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 32px; }
.stage-btn { padding: 16px 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; position: relative; }
.stage-btn.active { border-width: 2px; }
.stage-btn.sentir.active { border-color: #ff6b6b; background: rgba(255,107,107,0.08); }
.stage-btn.imaginar.active { border-color: #ffc14d; background: rgba(255,193,77,0.08); }
.stage-btn.fazer.active { border-color: #3fe0a8; background: rgba(63,224,168,0.08); }
.stage-btn.compartilhar.active { border-color: #3fb4ff; background: rgba(63,180,255,0.08); }
.stage-btn.done { opacity: 0.7; }
.stage-icon { font-size: 24px; }
.stage-name { font-family: var(--font-display); font-size: 9px; letter-spacing: 1.5px; color: var(--ink-2); }
.check { position: absolute; top: 6px; right: 8px; color: #3fe0a8; font-size: 12px; }
.stage-content { padding: 28px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; margin-bottom: 24px; }
.stage-content.sentir { border-top: 3px solid #ff6b6b; }
.stage-content.imaginar { border-top: 3px solid #ffc14d; }
.stage-content.fazer { border-top: 3px solid #3fe0a8; }
.stage-content.compartilhar { border-top: 3px solid #3fb4ff; }
.stage-num { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); display: block; margin-bottom: 8px; }
.stage-header h2 { font-family: var(--font-display); font-size: 22px; color: var(--ink-0); margin: 0 0 8px; }
.stage-header p { color: var(--ink-2); font-size: 14px; line-height: 1.6; margin: 0 0 24px; }
.delivery-label { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); display: block; margin-bottom: 10px; }
.delivery-area textarea { width: 100%; padding: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; color: var(--ink-0); font-family: var(--font-body); font-size: 15px; resize: vertical; outline: none; line-height: 1.6; }
.delivery-area textarea:focus { border-color: rgba(245,201,122,0.4); }
.delivery-actions { display: flex; gap: 12px; margin-top: 16px; justify-content: flex-end; }
.btn-save { padding: 11px 20px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--ink-2); font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; cursor: pointer; }
.btn-submit { padding: 11px 24px; background: linear-gradient(180deg, rgba(245,201,122,0.2), rgba(245,201,122,0.08)); border: 1px solid var(--gold); border-radius: 10px; color: var(--gold); font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; }
.btn-submit:hover:not(:disabled) { background: linear-gradient(180deg, rgba(245,201,122,0.35), rgba(245,201,122,0.15)); }
.btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }
.save-msg { text-align: right; margin: 8px 0 0; font-size: 13px; color: #3fe0a8; }
.provocations-box { padding: 20px; background: rgba(245,201,122,0.04); border: 1px solid rgba(245,201,122,0.15); border-radius: 12px; }
.provocations-box h3 { font-family: var(--font-display); font-size: 11px; letter-spacing: 2px; color: var(--gold); margin: 0 0 14px; }
.prov-item { padding: 12px; background: rgba(255,255,255,0.04); border-radius: 8px; margin-bottom: 8px; }
.prov-item p { margin: 0 0 4px; color: var(--ink-1); font-size: 13px; }
.prov-date { font-size: 11px; color: var(--ink-3); }
</style>
