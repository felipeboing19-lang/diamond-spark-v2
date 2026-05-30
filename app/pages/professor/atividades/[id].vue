<template>
	<div class="professor-page">
		<ProfessorNav />
		<main class="content">
			<button class="back-link" @click="$router.push('/professor/atividades')">VOLTAR</button>

			<div v-if="loading" class="loading">Carregando...</div>

			<div v-else-if="activity">
				<div class="header-row">
					<div>
						<h1>{{ activity.title }}</h1>
						<p class="desc">{{ activity.description }}</p>
					</div>
					<span class="status-badge" :class="activity.status">{{ statusLabel(activity.status) }}</span>
				</div>

				<div class="tabs">
					<button :class="{ active: tab === 'info' }" @click="tab = 'info'">INFORMACOES</button>
					<button :class="{ active: tab === 'entregas' }" @click="tab = 'entregas'">ENTREGAS ({{ deliveries.length }})</button>
					<button :class="{ active: tab === 'equipes' }" @click="tab = 'equipes'">EQUIPES</button>
				</div>

				<div v-if="tab === 'info'" class="tab-content">
					<div class="info-grid">
						<div class="info-card">
							<span class="label">TURMA</span>
							<span class="value">{{ activity.classes?.name }}</span>
						</div>
						<div class="info-card">
							<span class="label">STATUS</span>
							<span class="value">{{ statusLabel(activity.status) }}</span>
						</div>
						<div class="info-card">
							<span class="label">ALUNOS NA TURMA</span>
							<span class="value">{{ studentsCount }}</span>
						</div>
						<div class="info-card">
							<span class="label">ENTREGAS RECEBIDAS</span>
							<span class="value">{{ deliveries.length }}</span>
						</div>
					</div>
					<div class="action-row">
						<button class="btn-action" @click="cycleStatus">
							{{ activity.status === 'draft' ? 'PUBLICAR' : activity.status === 'active' ? 'ENCERRAR' : 'REABRIR' }}
						</button>
					</div>
				</div>

				<div v-if="tab === 'entregas'" class="tab-content">
					<div v-if="deliveries.length === 0" class="empty">
						<p>Nenhuma entrega recebida ainda.</p>
					</div>

					<div v-else="" class="deliveries-list">
						<div v-for="d in deliveries" :key="d.id" class="delivery-card">
							<div class="delivery-header">
								<div class="student-info">
									<div class="student-avatar" :style="{ color: getColor(d.profiles?.riasec_profile), borderColor: getColor(d.profiles?.riasec_profile) }">
										{{ d.profiles?.riasec_profile || '?' }}
									</div>
									<div>
										<span class="student-name">{{ d.profiles?.name || 'Aluno' }}</span>
										<span class="student-email">{{ d.profiles?.email }}</span>
									</div>
								</div>
								<div class="delivery-meta">
									<span class="stage-badge" :class="d.stage">{{ d.stage.toUpperCase() }}</span>
									<span class="delivery-status" :class="d.status">{{ d.status === 'submitted' ? 'ENTREGUE' : 'RASCUNHO' }}</span>
								</div>
							</div>
							<div class="delivery-content">
								<p>{{ d.content || 'Sem conteudo' }}</p>
							</div>
							<div class="delivery-footer">
								<span class="delivery-date">{{ formatDate(d.submitted_at || d.created_at) }}</span>
							</div>
						</div>
					</div>
				</div>

				<div v-if="tab === 'equipes'" class="tab-content">
					<div v-if="teams.length === 0" class="empty">
						<p>Nenhuma equipe criada.</p>
					</div>
					<div v-else="" class="teams-grid">
						<div v-for="t in teams" :key="t.id" class="team-card">
							<h4>{{ t.name }}</h4>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script setup="">
	definePageMeta({ layout: 'default', middleware: 'professor' })
	const route = useRoute()
	const supabase = useSupabaseClient()

	const activity = ref(null)
	const deliveries = ref([])
	const teams = ref([])
	const studentsCount = ref(0)
	const loading = ref(true)
	const tab = ref('info')

	const colors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }
	function getColor(code) { return colors[code] || '#f5c97a' }
	function statusLabel(s) { return { draft: 'RASCUNHO', active: 'ATIVA', closed: 'ENCERRADA' }[s] || s }
	function formatDate(d) { return d ? new Date(d).toLocaleDateString('pt-BR') : '' }

	async function cycleStatus() {
	const next = { draft: 'active', active: 'closed', closed: 'active' }[activity.value.status]
	await supabase.from('activities').update({ status: next }).eq('id', activity.value.id)
	activity.value.status = next
	}

	async function loadData() {
	const id = route.params.id
	if (!id) return

	const { data: a } = await supabase.from('activities').select('*, classes(name)').eq('id', id).single()
	activity.value = a

	const { data: d } = await supabase.from('deliveries').select('*, profiles(name, email, riasec_profile)').eq('activity_id', id).order('created_at', { ascending: false })
	deliveries.value = d || []

	const { data: t } = await supabase.from('teams').select('*').eq('activity_id', id)
	teams.value = t || []

	if (a?.class_id) {
	const { data: cs } = await supabase.from('class_students').select('id').eq('class_id', a.class_id)
	studentsCount.value = cs?.length || 0
	}

	loading.value = false
	}

	onMounted(() => loadData())
</script>

<style scoped="">
	.professor-page { min-height: 100vh; background: var(--bg-0); }
	.content { padding: 40px 48px; max-width: 1000px; margin: 0 auto; }
	.back-link { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--ink-2); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 20px; display: inline-block; }
	.back-link:hover { color: var(--gold); }
	.loading { text-align: center; padding: 80px; color: var(--ink-2); }
	.header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
	h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 6px; }
	.desc { color: var(--ink-2); font-size: 14px; margin: 0; }
	.status-badge { font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; padding: 4px 12px; border-radius: 999px; }
	.status-badge.active { color: #3fe0a8; border: 1px solid #3fe0a8; background: rgba(63,224,168,0.08); }
	.status-badge.draft { color: var(--ink-3); border: 1px solid rgba(255,255,255,0.15); }
	.status-badge.closed { color: var(--ink-3); border: 1px solid rgba(255,255,255,0.08); }
	.tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
	.tabs button { padding: 10px 20px; background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--ink-3); font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; cursor: pointer; }
	.tabs button.active { color: var(--gold); border-bottom-color: var(--gold); }
	.tab-content { padding: 20px 0; }
	.info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
	.info-card { padding: 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
	.label { display: block; font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; color: var(--ink-3); margin-bottom: 8px; }
	.value { font-size: 16px; color: var(--ink-0); }
	.action-row { display: flex; gap: 12px; }
	.btn-action { padding: 12px 24px; background: linear-gradient(180deg, rgba(245,201,122,0.15), rgba(245,201,122,0.05)); border: 1px solid rgba(245,201,122,0.3); border-radius: 10px; color: var(--gold); font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; cursor: pointer; }
	.empty { text-align: center; padding: 60px; color: var(--ink-2); }
	.deliveries-list { display: flex; flex-direction: column; gap: 16px; }
	.delivery-card { padding: 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; }
	.delivery-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
	.student-info { display: flex; align-items: center; gap: 12px; }
	.student-avatar { width: 40px; height: 40px; border-radius: 50%; border: 2px solid; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 16px; font-weight: 900; flex-shrink: 0; }
	.student-name { display: block; font-family: var(--font-display); font-size: 13px; color: var(--ink-0); }
	.student-email { display: block; font-size: 11px; color: var(--ink-3); }
	.delivery-meta { display: flex; gap: 8px; align-items: center; }
	.stage-badge { font-family: var(--font-display); font-size: 9px; letter-spacing: 1.5px; padding: 4px 8px; border-radius: 999px; }
	.stage-badge.sentir { color: #ff6b6b; border: 1px solid #ff6b6b; background: rgba(255,107,107,0.08); }
	.stage-badge.imaginar { color: #ffc14d; border: 1px solid #ffc14d; background: rgba(255,193,77,0.08); }
	.stage-badge.fazer { color: #3fe0a8; border: 1px solid #3fe0a8; background: rgba(63,224,168,0.08); }
	.stage-badge.compartilhar { color: #3fb4ff; border: 1px solid #3fb4ff; background: rgba(63,180,255,0.08); }
	.delivery-status { font-family: var(--font-display); font-size: 9px; letter-spacing: 1px; padding: 4px 8px; border-radius: 6px; }
	.delivery-status.submitted { color: #3fe0a8; background: rgba(63,224,168,0.08); }
	.delivery-status.draft { color: var(--ink-3); background: rgba(255,255,255,0.04); }
	.delivery-content { padding: 16px; background: rgba(0,0,0,0.2); border-radius: 10px; margin-bottom: 12px; }
	.delivery-content p { margin: 0; color: var(--ink-1); font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
	.delivery-footer { display: flex; justify-content: flex-end; }
	.delivery-date { font-size: 11px; color: var(--ink-3); }
	.teams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
	.team-card { padding: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
	.team-card h4 { margin: 0; font-family: var(--font-display); font-size: 13px; color: var(--ink-0); }
</style>