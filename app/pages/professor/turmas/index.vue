<template>
	<div class="professor-page">
		<ProfessorNav />
		<main class="content">
			<div class="header-row">
				<div>
					<h1>TURMAS</h1>
					<p>Gerencie suas turmas e acompanhe os alunos.</p>
				</div>
				<button class="btn-new" @click="$router.push('/professor/turmas/nova')">+ CRIAR TURMA</button>
			</div>

			<div v-if="loading" class="loading">Carregando...</div>

			<div v-else-if="turmas.length === 0" class="empty">
				<p>Nenhuma turma ainda.</p>
				<button class="btn-new" @click="$router.push('/professor/turmas/nova')">CRIAR TURMA</button>
			</div>

			<div v-else="" class="grid">
				<div v-for="t in turmas" :key="t.id" class="card">
					<div class="card-top">
						<h3>{{ t.name }}</h3>
						<span class="badge" :class="t.active ? 'active' : 'inactive'">{{ t.active ? 'ATIVA' : 'INATIVA' }}</span>
					</div>
					<p>{{ t.description || 'Sem descricao' }}</p>
					<div class="card-stats">
						<div class="mini-stat">
							<span class="mini-label">CODIGO</span>
							<span class="mini-value code">{{ t.code }}</span>
						</div>
						<div class="mini-stat">
							<span class="mini-label">ALUNOS</span>
							<span class="mini-value">{{ t.studentCount }}</span>
						</div>
						<div class="mini-stat">
							<span class="mini-label">CRIADA EM</span>
							<span class="mini-value">{{ formatDate(t.created_at) }}</span>
						</div>
					</div>
					<div class="card-actions">
						<button class="btn-detail" @click="goToTurma(t.id)">VER DETALHES</button>
						<button class="btn-toggle" @click="toggleActive(t)">{{ t.active ? 'DESATIVAR' : 'ATIVAR' }}</button>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script setup="">
	definePageMeta({ layout: 'default', middleware: 'professor' })
	const supabase = useSupabaseClient()
	const turmas = ref([])
	const loading = ref(true)

	function formatDate(d) { return d ? new Date(d).toLocaleDateString('pt-BR') : '' }

	function goToTurma(id) {
	window.location.href = '/professor/turmas/' + id
	}

	async function toggleActive(t) {
	await supabase.from('classes').update({ active: !t.active }).eq('id', t.id)
	t.active = !t.active
	}

	onMounted(async () => {
	const { data: { user } } = await supabase.auth.getUser()
	const { data: classes } = await supabase.from('classes').select('*').eq('teacher_id', user.id).order('created_at', { ascending: false })

	if (classes) {
	for (const c of classes) {
	const { data: cs } = await supabase.from('class_students').select('id').eq('class_id', c.id)
	c.studentCount = cs?.length || 0
	}
	turmas.value = classes
	}

	loading.value = false
	})
</script>

<style scoped="">
	.professor-page { min-height: 100vh; background: var(--bg-0); }
	.content { padding: 40px 48px; max-width: 1100px; margin: 0 auto; }
	.header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
	h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 6px; }
	.header-row p { color: var(--ink-2); font-size: 14px; margin: 0; }
	.btn-new { padding: 12px 24px; background: linear-gradient(180deg, rgba(245,201,122,0.2), rgba(245,201,122,0.08)); border: 1px solid var(--gold); border-radius: 10px; color: var(--gold); font-family: var(--font-display); font-size: 12px; letter-spacing: 1.5px; cursor: pointer; }
	.loading { text-align: center; padding: 60px; color: var(--ink-2); }
	.empty { text-align: center; padding: 60px; color: var(--ink-2); display: flex; flex-direction: column; align-items: center; gap: 16px; }
	.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
	.card { padding: 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; display: flex; flex-direction: column; gap: 12px; }
	.card-top { display: flex; justify-content: space-between; align-items: center; }
	.card h3 { font-family: var(--font-display); font-size: 16px; color: var(--ink-0); margin: 0; }
	.badge { font-family: var(--font-display); font-size: 9px; letter-spacing: 1.5px; padding: 4px 8px; border-radius: 999px; }
	.badge.active { color: #3fe0a8; border: 1px solid #3fe0a8; background: rgba(63,224,168,0.08); }
	.badge.inactive { color: var(--ink-3); border: 1px solid rgba(255,255,255,0.1); }
	.card p { font-size: 13px; color: var(--ink-2); margin: 0; }
	.card-stats { display: flex; gap: 20px; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.05); }
	.mini-stat { display: flex; flex-direction: column; gap: 4px; }
	.mini-label { font-family: var(--font-display); font-size: 8px; letter-spacing: 2px; color: var(--ink-3); }
	.mini-value { font-family: var(--font-display); font-size: 14px; color: var(--ink-0); }
	.mini-value.code { color: var(--gold); letter-spacing: 3px; }
	.card-actions { display: flex; gap: 8px; }
	.btn-detail { flex: 1; padding: 10px; background: linear-gradient(180deg, rgba(245,201,122,0.12), rgba(245,201,122,0.04)); border: 1px solid rgba(245,201,122,0.25); border-radius: 8px; color: var(--gold); font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; cursor: pointer; }
	.btn-toggle { flex: 1; padding: 10px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ink-2); font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; cursor: pointer; }
</style>