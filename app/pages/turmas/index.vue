<template>
	<div class="page">
		<AlunoNav />
		<main class="content">
			<h1 class="title">MINHAS TURMAS</h1>

			<div class="join-card">
				<h2>ENTRAR EM UMA TURMA</h2>
				<div class="join-row">
					<input v-model="code" type="text" placeholder="Codigo da turma (ex: CB8065)" maxlength="6" @keyup.enter="joinClass" />
					<button class="btn-gold" :disabled="loading" @click="joinClass">ENTRAR</button>
				</div>
				<p v-if="error" class="msg-error">{{ error }}</p>
				<p v-if="success" class="msg-success">{{ success }}</p>
			</div>

			<p class="section-label">TURMAS MATRICULADAS</p>

			<div v-if="loadingClasses" class="loading">Carregando...</div>

			<div v-else-if="classes.length === 0" class="empty">
				<p>Sem turmas ainda. Use o codigo acima para entrar!</p>
			</div>

			<div v-else="" class="grid">
				<div v-for="c in classes" :key="c.id" class="card">
					<h3>{{ c.name }}</h3>
					<p>{{ c.description || 'Sem descricao' }}</p>
					<div class="card-footer">
						<span class="date">{{ formatDate(c.joined_at) }}</span>
						<button class="link-gold" @click="goToTurma(c.id)">VER ATIVIDADES</button>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script setup="">
	definePageMeta({ layout: 'default', middleware: 'auth' })
	const supabase = useSupabaseClient()
	const code = ref('')
	const error = ref('')
	const success = ref('')
	const loading = ref(false)
	const loadingClasses = ref(true)
	const classes = ref([])

	onMounted(async () => { await loadClasses() })

	async function loadClasses() {
	loadingClasses.value = true
	const { data: { user } } = await supabase.auth.getUser()
	const { data } = await supabase
	.from('class_students')
	.select('joined_at, classes(id, name, description)')
	.eq('student_id', user.id)
	.order('joined_at', { ascending: false })
	classes.value = (data || []).map(cs => ({ ...cs.classes, joined_at: cs.joined_at })).filter(Boolean)
	loadingClasses.value = false
	}

	async function joinClass() {
	if (!code.value) return
	loading.value = true
	error.value = ''
	success.value = ''
	const { data: { user } } = await supabase.auth.getUser()
	const { data: turma } = await supabase.from('classes').select('id, name, active').eq('code', code.value.toUpperCase()).single()
	if (!turma) { error.value = 'Turma nao encontrada.'; loading.value = false; return }
	if (!turma.active) { error.value = 'Turma inativa.'; loading.value = false; return }
	const { data: existing } = await supabase.from('class_students').select('id').eq('class_id', turma.id).eq('student_id', user.id).single()
	if (existing) { error.value = 'Voce ja esta nesta turma!'; loading.value = false; return }
	const { error: err } = await supabase.from('class_students').insert({ class_id: turma.id, student_id: user.id })
	loading.value = false
	if (err) { error.value = err.message; return }
	success.value = 'Entrou na turma com sucesso!'
	code.value = ''
	await loadClasses()
	}

	function goToTurma(id) {
	window.location.href = '/turmas/' + id
	}

	function formatDate(d) { return d ? new Date(d).toLocaleDateString('pt-BR') : '' }
</script>

<style scoped="">
	.page { min-height: 100vh; background: var(--bg-0); }
	.content { padding: 40px 48px; max-width: 900px; margin: 0 auto; }
	.title { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 32px; }
	.join-card { padding: 24px 28px; background: rgba(245,201,122,0.05); border: 1px solid rgba(245,201,122,0.2); border-radius: 14px; margin-bottom: 40px; }
	.join-card h2 { font-family: var(--font-display); font-size: 13px; letter-spacing: 2px; color: var(--gold); margin: 0 0 16px; }
	.join-row { display: flex; gap: 12px; }
	.join-row input { flex: 1; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--ink-0); font-family: var(--font-display); font-size: 16px; letter-spacing: 4px; outline: none; }
	.join-row input:focus { border-color: rgba(245,201,122,0.4); }
	.btn-gold { padding: 12px 24px; background: linear-gradient(180deg, rgba(245,201,122,0.2), rgba(245,201,122,0.08)); border: 1px solid var(--gold); border-radius: 10px; color: var(--gold); font-family: var(--font-display); font-size: 12px; letter-spacing: 1.5px; cursor: pointer; white-space: nowrap; }
	.btn-gold:disabled { opacity: 0.4; cursor: not-allowed; }
	.msg-error { margin: 10px 0 0; color: #ff6b8b; font-size: 13px; }
	.msg-success { margin: 10px 0 0; color: #3fe0a8; font-size: 13px; }
	.section-label { font-family: var(--font-display); font-size: 11px; letter-spacing: 2px; color: var(--ink-3); margin-bottom: 16px; }
	.loading { text-align: center; padding: 40px; color: var(--ink-2); }
	.empty { text-align: center; padding: 60px; color: var(--ink-2); }
	.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
	.card { padding: 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; display: flex; flex-direction: column; gap: 8px; transition: border-color 0.2s; }
	.card:hover { border-color: rgba(245,201,122,0.25); }
	.card h3 { font-family: var(--font-display); font-size: 15px; color: var(--ink-0); margin: 0; }
	.card p { font-size: 13px; color: var(--ink-2); margin: 0; }
	.card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05); }
	.date { font-size: 12px; color: var(--ink-3); }
	.link-gold { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--gold); background: none; border: none; cursor: pointer; padding: 0; }
	.link-gold:hover { text-decoration: underline; }
</style>