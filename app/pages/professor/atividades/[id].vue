<template>
	<div class="professor-page">
		<ProfessorNav />
		<main class="content">
			<button class="back-link" @click="$router.push('/professor/atividades')">← VOLTAR</button>

			<div v-if="loading" class="loading">Carregando...</div>

			<div v-else-if="activity">
				<div class="header-row">
					<div>
						<h1>{{ activity.title }}</h1>
						<p class="desc">{{ activity.description }}</p>
					</div>
					<div class="header-actions">
						<button class="btn-live" @click="goLive">● VER AO VIVO</button>
						<span class="status-badge" :class="activity.status">{{ statusLabel(activity.status) }}</span>
					</div>
				</div>

				<div class="tabs">
					<button :class="{ active: tab === 'info' }" @click="tab = 'info'">INFORMAÇÕES</button>
					<button :class="{ active: tab === 'relatorio' }" @click="tab = 'relatorio'">COLABORAÇÃO</button>
					<button :class="{ active: tab === 'equipes' }" @click="tab = 'equipes'">EQUIPES ({{ teams.length }})</button>
				</div>

				<!-- INFO -->
				<div v-if="tab === 'info'" class="tab-content">
					<div class="info-grid">
						<div class="info-card">
							<span class="label">TURMA</span>
							<span class="value">{{ activity.classes?.name }}</span>
						</div>
						<div class="info-card">
							<span class="label">PÚBLICO</span>
							<span class="value">{{ activity.audience === 'selected' ? 'Alunos selecionados' : 'Toda a turma' }}</span>
						</div>
						<div class="info-card">
							<span class="label">PARTICIPANTES</span>
							<span class="value">{{ participants.length }}</span>
						</div>
						<div class="info-card">
							<span class="label">POST-ITS NO CANVAS</span>
							<span class="value">{{ postits.length }}</span>
						</div>
					</div>
					<div class="canvas-seq" v-if="canvasList.length">
						<span class="label">SEQUÊNCIA DE CANVAS</span>
						<div class="seq-tags">
							<span v-for="(c, i) in canvasList" :key="c.key" class="seq-tag">{{ i + 1 }}. {{ c.icon }} {{ c.name }}</span>
						</div>
					</div>
					<div class="action-row">
						<button class="btn-action" @click="cycleStatus">
							{{ activity.status === 'draft' ? 'PUBLICAR' : activity.status === 'active' ? 'ENCERRAR' : 'REABRIR' }}
						</button>
					</div>
				</div>

				<!-- RELATÓRIO DE COLABORAÇÃO -->
				<div v-if="tab === 'relatorio'" class="tab-content">
					<div class="report-bar">
						<span class="report-bar-title">Relatório de colaboração</span>
						<button class="btn-export" :disabled="exporting" @click="exportPdf">
							{{ exporting ? 'GERANDO...' : '📄 EXPORTAR PDF' }}
						</button>
					</div>
					<div class="report-summary">
						<div class="rs-card">
							<span class="rs-num">{{ completedIds.length }}/{{ participants.length }}</span>
							<span class="rs-label">concluíram</span>
						</div>
						<div class="rs-card">
							<span class="rs-num">{{ contributorsCount }}/{{ participants.length }}</span>
							<span class="rs-label">colaboraram</span>
						</div>
						<div class="rs-card">
							<span class="rs-num">{{ postits.length }}</span>
							<span class="rs-label">post-its no total</span>
						</div>
						<div class="rs-card">
							<span class="rs-num">{{ avgPerContributor }}</span>
							<span class="rs-label">média por aluno</span>
						</div>
					</div>

					<div v-if="participants.length === 0" class="empty">
						<p>Esta atividade ainda não tem participantes.</p>
					</div>

					<div v-else="" class="ranking">
						<div class="ranking-head">
							<span class="rh-pos">#</span>
							<span class="rh-name">ALUNO</span>
							<span v-for="c in canvasList" :key="c.key" class="rh-canvas" :title="c.name">{{ c.icon }}</span>
							<span class="rh-total">TOTAL</span>
						</div>
						<div v-for="(r, i) in ranking" :key="r.id" class="ranking-row" :class="{ zero: r.total === 0 }">
							<span class="rr-pos">{{ i + 1 }}</span>
							<div class="rr-name">
								<span class="rr-avatar" :style="{ color: getColor(r.riasec_profile), borderColor: getColor(r.riasec_profile) }">{{ r.riasec_profile || '?' }}</span>
								<span>{{ r.name || 'Aluno' }}</span>
								<span class="rr-done" v-if="completedIds.includes(r.id)" title="Concluiu">✓</span>
							</div>
							<span v-for="c in canvasList" :key="c.key" class="rr-canvas">{{ r.byCanvas[c.key] || 0 }}</span>
							<span class="rr-total">{{ r.total }}</span>
						</div>
					</div>
				</div>

				<!-- EQUIPES -->
				<div v-if="tab === 'equipes'" class="tab-content">
					<div v-if="teams.length === 0" class="empty">
						<p>Nenhuma equipe vinculada.</p>
					</div>
					<div v-else="" class="teams-grid">
						<div v-for="t in teams" :key="t.id" class="team-card">
							<div class="team-card-head">
								<span class="team-dot" :style="{ background: t.color || 'var(--gold)' }"></span>
								<h4>{{ t.name }}</h4>
								<span class="team-count">{{ t.team_members?.length || 0 }}</span>
							</div>
							<div class="team-members">
								<span v-for="m in t.team_members" :key="m.student_id" class="member-chip">
									{{ profilesMap[m.student_id]?.name || 'Aluno' }}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script setup="">
	definePageMeta({ layout: 'default', middleware: 'professor' })
	import { getCanvasTemplate } from '~/composables/useCanvasTemplates'
	import { openActivityReport } from '~/utils/activityReport'

	const route = useRoute()
	const supabase = useSupabaseClient()

	const activity = ref(null)
	const teams = ref([])
	const participants = ref([])
	const postits = ref([])
	const completedIds = ref([])
	const exporting = ref(false)
	const loading = ref(true)
	const tab = ref('info')
	let profilesMap = {}

	const colors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }
	function getColor(code) { return colors[code] || '#f5c97a' }
	function statusLabel(s) { return { draft: 'RASCUNHO', active: 'ATIVA', closed: 'ENCERRADA' }[s] || s }
	function goLive() { window.location.href = `/professor/canvas/${activity.value.id}` }

	const canvasList = computed(() => (activity.value?.canvas_sequence || []).map(getCanvasTemplate).filter(Boolean))

	const ranking = computed(() => {
	const byAuthor = {}
	postits.value.forEach(p => {
	if (!byAuthor[p.author_id]) byAuthor[p.author_id] = { total: 0, byCanvas: {} }
	byAuthor[p.author_id].total++
	byAuthor[p.author_id].byCanvas[p.template] = (byAuthor[p.author_id].byCanvas[p.template] || 0) + 1
	})
	return participants.value
	.map(p => ({ ...p, total: byAuthor[p.id]?.total || 0, byCanvas: byAuthor[p.id]?.byCanvas || {} }))
	.sort((a, b) => b.total - a.total)
	})
	const contributorsCount = computed(() => ranking.value.filter(r => r.total > 0).length)
	const avgPerContributor = computed(() => {
	const c = contributorsCount.value
	return c ? Math.round((postits.value.length / c) * 10) / 10 : 0
	})

	async function cycleStatus() {
	const next = { draft: 'active', active: 'closed', closed: 'active' }[activity.value.status]
	await supabase.from('activities').update({ status: next }).eq('id', activity.value.id)
	activity.value.status = next
	}

	async function exportPdf() {
	exporting.value = true
	const { data: notes } = await supabase
	.from('canvas_postits')
	.select('author_id, template, zone, content, created_at')
	.eq('activity_id', activity.value.id)
	openActivityReport({
	activity: activity.value,
	participants: participants.value,
	completedIds: completedIds.value,
	canvasList: canvasList.value,
	ranking: ranking.value,
	contributorsCount: contributorsCount.value,
	avgPerContributor: avgPerContributor.value,
	notes: notes || [],
	})
	exporting.value = false
	}


	async function loadData() {
	const id = route.params.id
	if (!id) return

	const { data: a } = await supabase.from('activities').select('*, classes(name)').eq('id', id).single()
	activity.value = a

	const { data: ts } = await supabase.from('teams').select('id, name, color, team_members(student_id)').eq('activity_id', id)
	teams.value = ts || []

	const ids = [...new Set((ts || []).flatMap(t => (t.team_members || []).map(m => m.student_id)))]
	const { data: profs } = ids.length
	? await supabase.from('profiles').select('id, name, email, riasec_profile').in('id', ids)
	: { data: [] }
	participants.value = profs || []
	profilesMap = Object.fromEntries((profs || []).map(p => [p.id, p]))

	const { data: notes } = await supabase.from('canvas_postits').select('id, author_id, template, created_at').eq('activity_id', id)
	postits.value = notes || []

	const { data: comps } = await supabase.from('activity_completions').select('student_id').eq('activity_id', id)
	completedIds.value = (comps || []).map(c => c.student_id)

	loading.value = false
	}

	onMounted(loadData)
</script>

<style scoped="">
	.professor-page { min-height: 100vh; background: var(--bg-0); }
	.content { padding: 40px 48px; max-width: 1000px; margin: 0 auto; }
	.back-link { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--ink-2); background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 20px; display: inline-block; }
	.back-link:hover { color: var(--gold); }
	.loading { text-align: center; padding: 80px; color: var(--ink-2); }

	.header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; gap: 16px; }
	h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 6px; }
	.desc { color: var(--ink-2); font-size: 14px; margin: 0; }
	.header-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
	.btn-live { padding: 9px 16px; background: rgba(255,107,107,0.08); border: 1px solid rgba(255,107,107,0.3); border-radius: 8px; color: #ff6b6b; font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; text-decoration: none; transition: all 0.2s; white-space: nowrap; }
	.btn-live:hover { background: rgba(255,107,107,0.16); }
	.status-badge { font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; padding: 4px 12px; border-radius: 999px; white-space: nowrap; }
	.status-badge.active { color: #3fe0a8; border: 1px solid #3fe0a8; background: rgba(63,224,168,0.08); }
	.status-badge.draft { color: var(--ink-3); border: 1px solid rgba(255,255,255,0.15); }
	.status-badge.closed { color: var(--ink-3); border: 1px solid rgba(255,255,255,0.08); }

	.tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
	.tabs button { padding: 10px 20px; background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--ink-3); font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; cursor: pointer; }
	.tabs button.active { color: var(--gold); border-bottom-color: var(--gold); }
	.tab-content { padding: 20px 0; }

	.info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px; }
	.info-card { padding: 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
	.label { display: block; font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; color: var(--ink-3); margin-bottom: 8px; }
	.value { font-size: 16px; color: var(--ink-0); }
	.canvas-seq { margin-bottom: 24px; }
	.seq-tags { display: flex; flex-wrap: wrap; gap: 8px; }
	.seq-tag { padding: 6px 12px; border-radius: 999px; background: rgba(245,201,122,0.06); border: 1px solid rgba(245,201,122,0.2); color: var(--ink-1); font-size: 12px; }
	.action-row { display: flex; gap: 12px; }
	.btn-action { padding: 12px 24px; background: linear-gradient(180deg, rgba(245,201,122,0.15), rgba(245,201,122,0.05)); border: 1px solid rgba(245,201,122,0.3); border-radius: 10px; color: var(--gold); font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; cursor: pointer; }
	.empty { text-align: center; padding: 60px; color: var(--ink-2); }

	/* relatório */
	.report-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
	.report-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
	.report-bar-title { font-family: var(--font-display); font-size: 13px; color: var(--ink-1); letter-spacing: 1px; }
	.btn-export { padding: 10px 18px; background: linear-gradient(180deg, rgba(245,201,122,0.2), rgba(245,201,122,0.08)); border: 1px solid var(--gold); border-radius: 10px; color: var(--gold); font-family: var(--font-display); font-size: 11px; font-weight: 700; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; }
	.btn-export:hover:not(:disabled) { background: linear-gradient(180deg, rgba(245,201,122,0.35), rgba(245,201,122,0.15)); }
	.btn-export:disabled { opacity: .5; cursor: not-allowed; }
	@media (max-width: 720px) { .report-summary { grid-template-columns: repeat(2, 1fr); } }
	.rr-done { width: 18px; height: 18px; display: grid; place-items: center; border-radius: 50%; background: #3fe0a8; color: var(--bg-0); font-size: 11px; font-weight: 800; }
	.rs-card { padding: 20px; text-align: center; background: rgba(255,255,255,0.04); border: 1px solid var(--bg-3); border-radius: 14px; }
	.rs-num { display: block; font-family: var(--font-display); font-size: 26px; font-weight: 800; color: var(--gold); }
	.rs-label { font-size: 12px; color: var(--ink-2); }

	.ranking { border: 1px solid var(--bg-3); border-radius: 14px; overflow: hidden; }
	.ranking-head, .ranking-row { display: grid; grid-template-columns: 32px 1fr repeat(v-bind('canvasList.length'), 40px) 64px; align-items: center; gap: 8px; padding: 12px 16px; }
	.ranking-head { background: var(--bg-2); }
	.rh-pos, .rh-canvas, .rh-total { font-family: var(--font-display); font-size: 9px; letter-spacing: 1px; color: var(--ink-3); text-align: center; }
	.rh-name { font-family: var(--font-display); font-size: 9px; letter-spacing: 1px; color: var(--ink-3); }
	.rh-total { text-align: right; }
	.ranking-row { border-top: 1px solid var(--bg-3); }
	.ranking-row.zero { opacity: .5; }
	.rr-pos { text-align: center; font-family: var(--font-display); color: var(--ink-2); font-size: 13px; }
	.rr-name { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--ink-0); }
	.rr-avatar { width: 30px; height: 30px; border-radius: 50%; border: 2px solid; display: grid; place-items: center; font-family: var(--font-display); font-size: 12px; font-weight: 900; flex-shrink: 0; }
	.rr-canvas { text-align: center; font-size: 14px; color: var(--ink-1); }
	.rr-total { text-align: right; font-family: var(--font-display); font-size: 16px; font-weight: 800; color: var(--gold); }

	/* equipes */
	.teams-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }
	.team-card { padding: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
	.team-card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
	.team-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; }
	.team-card-head h4 { margin: 0; flex: 1; font-family: var(--font-display); font-size: 13px; color: var(--ink-0); }
	.team-count { font-size: 12px; color: var(--ink-3); }
	.team-members { display: flex; flex-wrap: wrap; gap: 6px; }
	.member-chip { padding: 4px 10px; background: var(--bg-2); border-radius: 999px; font-size: 12px; color: var(--ink-1); }
</style>