<template>
	<div class="professor-page">
		<ProfessorNav />
		<main class="content">
			<h1>PAINEL DO PROFESSOR</h1>
			<p class="subtitle">Gerencie suas turmas e acompanhe o progresso dos alunos.</p>

			<div class="stats-grid">
				<button class="stat-card" @click="$router.push('/professor/turmas')">
					<span class="stat-icon">🏫</span>
					<span class="stat-num">{{ stats.classes }}</span>
					<span class="stat-label">TURMAS</span>
				</button>
				<button class="stat-card" @click="$router.push('/professor/turmas')">
					<span class="stat-icon">👥</span>
					<span class="stat-num">{{ stats.students }}</span>
					<span class="stat-label">ALUNOS</span>
				</button>
				<button class="stat-card" @click="$router.push('/professor/atividades')">
					<span class="stat-icon">📋</span>
					<span class="stat-num">{{ stats.activities }}</span>
					<span class="stat-label">ATIVIDADES</span>
				</button>
				<button class="stat-card" @click="$router.push('/professor/atividades')">
					<span class="stat-icon">✅</span>
					<span class="stat-num">{{ stats.deliveries }}</span>
					<span class="stat-label">ENTREGAS</span>
				</button>
			</div>

			<h2 class="section-title">ACOES RAPIDAS</h2>
			<div class="quick-grid">
				<button class="quick-card" @click="$router.push('/professor/turmas/nova')">
					<span class="quick-icon">➕</span>
					<span class="quick-label">CRIAR TURMA</span>
				</button>
				<button class="quick-card" @click="$router.push('/professor/atividades/nova')">
					<span class="quick-icon">📝</span>
					<span class="quick-label">NOVA ATIVIDADE</span>
				</button>
				<button class="quick-card" @click="$router.push('/professor/turmas')">
					<span class="quick-icon">🏫</span>
					<span class="quick-label">VER TURMAS</span>
				</button>
				<button class="quick-card" @click="$router.push('/professor/relatorios')">
					<span class="quick-icon">📊</span>
					<span class="quick-label">RELATORIOS</span>
				</button>
			</div>
		</main>
	</div>
</template>

<script setup="">
	definePageMeta({ layout: 'default', middleware: 'professor' })
	const supabase = useSupabaseClient()
	const stats = ref({ classes: 0, students: 0, activities: 0, deliveries: 0 })

	onMounted(async () => {
	const { data: { user } } = await supabase.auth.getUser()

	const { data: classes } = await supabase.from('classes').select('id').eq('teacher_id', user.id)
	stats.value.classes = classes?.length || 0

	if (classes?.length) {
	const classIds = classes.map(c => c.id)
	const { data: cs } = await supabase.from('class_students').select('id').in('class_id', classIds)
	stats.value.students = cs?.length || 0
	}

	const { data: activities } = await supabase.from('activities').select('id').eq('teacher_id', user.id)
	stats.value.activities = activities?.length || 0

	if (activities?.length) {
	const actIds = activities.map(a => a.id)
	const { data: deliveries } = await supabase.from('deliveries').select('id').in('activity_id', actIds)
	stats.value.deliveries = deliveries?.length || 0
	}
	})
</script>

<style scoped="">
	.professor-page { min-height: 100vh; background: var(--bg-0); }
	.content { padding: 40px 48px; max-width: 1100px; margin: 0 auto; }
	h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 6px; }
	.subtitle { color: var(--ink-2); font-size: 14px; margin: 0 0 32px; }
	.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
	.stat-card { display: flex; align-items: center; gap: 14px; padding: 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; cursor: pointer; transition: all 0.2s; text-align: left; }
	.stat-card:hover { border-color: rgba(245,201,122,0.3); background: rgba(245,201,122,0.06); transform: translateY(-2px); }
	.stat-icon { font-size: 24px; }
	.stat-num { font-family: var(--font-display); font-size: 28px; font-weight: 900; color: var(--gold); }
	.stat-label { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); }
	.section-title { font-family: var(--font-display); font-size: 12px; letter-spacing: 2px; color: var(--ink-2); margin: 0 0 16px; }
	.quick-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
	.quick-card { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; cursor: pointer; transition: all 0.2s; }
	.quick-card:hover { border-color: rgba(245,201,122,0.3); background: rgba(245,201,122,0.06); transform: translateY(-2px); }
	.quick-icon { font-size: 28px; }
	.quick-label { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--gold); }
</style>