<template>
	<div class="professor-page">
		<ProfessorNav />
		<main class="content">
			<button class="back-link" @click="$router.push('/professor/turmas')">VOLTAR</button>

			<div v-if="loading" class="loading">Carregando...</div>

			<div v-else-if="turma">
				<div class="header-row">
					<div>
						<h1>{{ turma.name }}</h1>
						<p class="desc">{{ turma.description || 'Sem descricao' }}</p>
					</div>
					<div class="code-box">
						<span class="code-label">CODIGO</span>
						<span class="code-value">{{ turma.code }}</span>
					</div>
				</div>

				<div class="tabs">
					<button :class="{ active: tab === 'alunos' }" @click="tab = 'alunos'">ALUNOS ({{ alunos.length }})</button>
					<button :class="{ active: tab === 'perfis' }" @click="tab = 'perfis'">PERFIS RIASEC</button>
				</div>

				<div v-if="tab === 'alunos'">
					<div v-if="alunos.length === 0" class="empty">
						<p>
							Nenhum aluno ainda. Compartilhe o codigo <strong>{{ turma.code }}</strong>
						</p>
					</div>
					<div v-else="" class="students-grid">
						<div v-for="s in alunos" :key="s.id" class="student-card">
							<div class="student-avatar" :style="{ color: getColor(s.riasec_profile), borderColor: getColor(s.riasec_profile) }">
								{{ s.riasec_profile || '?' }}
							</div>
							<div class="student-info">
								<span class="student-name">{{ s.name }}</span>
								<span class="student-email">{{ s.email }}</span>
								<div class="tags">
									<span v-if="s.riasec_profile" class="tag" :style="{ color: getColor(s.riasec_profile) }">{{ getProfileName(s.riasec_profile) }}</span>
									<span v-if="!s.onboarding_done" class="tag pending">PENDENTE</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="tab === 'perfis'" class="profiles-view">
					<div v-for="(count, code) in profileCounts" :key="code" class="bar-row">
						<span class="bar-letter" :style="{ color: getColor(code) }">{{ code }}</span>
						<div class="bar-track">
							<div class="bar-fill" :style="{ width: barWidth(count) + '%', background: getColor(code) }"></div>
						</div>
						<span class="bar-count">{{ count }}</span>
						<span class="bar-name">{{ getProfileName(code) }}</span>
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

	const turma = ref(null)
	const alunos = ref([])
	const loading = ref(true)
	const tab = ref('alunos')

	const colors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }
	const names = { R: 'Realista', I: 'Investigativo', A: 'Artistico', S: 'Social', E: 'Empreendedor', C: 'Convencional' }

	const profileCounts = computed(() => {
	const c = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
	alunos.value.forEach(a => { if (a.riasec_profile) c[a.riasec_profile]++ })
	return c
	})
	const maxCount = computed(() => Math.max(...Object.values(profileCounts.value), 1))

	function barWidth(count) { return (count / maxCount.value) * 100 }
	function getColor(code) { return colors[code] || '#fff' }
	function getProfileName(code) { return names[code] || code }

	onMounted(async () => {
	const id = route.params.id

	const { data: t } = await supabase.from('classes').select('*').eq('id', id).single()
	turma.value = t

	const { data: cs } = await supabase.from('class_students').select('student_id').eq('class_id', id)
	if (cs?.length) {
	const ids = cs.map(c => c.student_id)
	const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids)
	alunos.value = profiles || []
	}

	loading.value = false
	})
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
	.code-box { padding: 16px 24px; background: rgba(245,201,122,0.08); border: 1px solid rgba(245,201,122,0.3); border-radius: 12px; text-align: center; }
	.code-label { display: block; font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; color: var(--ink-3); margin-bottom: 6px; }
	.code-value { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--gold); letter-spacing: 6px; }
	.tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
	.tabs button { padding: 10px 20px; background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--ink-3); font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; cursor: pointer; }
	.tabs button.active { color: var(--gold); border-bottom-color: var(--gold); }
	.empty { text-align: center; padding: 60px; color: var(--ink-2); }
	.empty strong { color: var(--gold); letter-spacing: 3px; }
	.students-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
	.student-card { display: flex; align-items: center; gap: 14px; padding: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
	.student-avatar { width: 44px; height: 44px; border-radius: 50%; border: 2px solid; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 18px; font-weight: 900; flex-shrink: 0; }
	.student-name { display: block; font-family: var(--font-display); font-size: 13px; color: var(--ink-0); margin-bottom: 2px; }
	.student-email { display: block; font-size: 12px; color: var(--ink-3); margin-bottom: 6px; }
	.tags { display: flex; gap: 6px; flex-wrap: wrap; }
	.tag { font-family: var(--font-display); font-size: 9px; letter-spacing: 1.5px; padding: 2px 8px; border-radius: 999px; border: 1px solid currentColor; }
	.tag.pending { color: #ff6b8b; }
	.profiles-view { display: flex; flex-direction: column; gap: 16px; padding: 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
	.bar-row { display: grid; grid-template-columns: 24px 1fr 32px 120px; align-items: center; gap: 16px; }
	.bar-letter { font-family: var(--font-display); font-size: 18px; font-weight: 900; }
	.bar-track { height: 12px; background: rgba(255,255,255,0.06); border-radius: 6px; overflow: hidden; }
	.bar-fill { height: 100%; border-radius: 6px; transition: width 0.6s ease; }
	.bar-count { font-family: var(--font-display); font-size: 14px; color: var(--ink-0); text-align: center; }
	.bar-name { font-size: 13px; color: var(--ink-2); }
</style>