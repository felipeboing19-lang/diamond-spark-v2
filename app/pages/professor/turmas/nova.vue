<template>
	<div class="professor-page">
		<ProfessorNav />
		<main class="content">
			<div class="page-header">
				<NuxtLink to="/professor/turmas" class="back-link">← TURMAS</NuxtLink>
				<h1>CRIAR TURMA</h1>
			</div>
			<div class="form-card">
				<div class="field">
					<label>NOME DA TURMA *</label>
					<input v-model="form.name" type="text" placeholder="Ex: 3º Ano A — 2026" />
				</div>
				<div class="field">
					<label>DESCRIÇÃO</label>
					<textarea v-model="form.description" placeholder="Descrição opcional da turma..." rows="3"></textarea>
				</div>
				<p v-if="error" class="error">{{ error }}</p>
				<div class="form-actions">
					<NuxtLink to="/professor/turmas" class="btn-cancel">CANCELAR</NuxtLink>
					<button class="btn-submit" :disabled="loading || !form.name" @click="createClass">
						{{ loading ? 'CRIANDO...' : 'CRIAR TURMA' }}
					</button>
				</div>
			</div>
		</main>
	</div>
</template>

<script setup="">
	definePageMeta({ layout: 'default', middleware: 'professor' })
	const supabase = useSupabaseClient()
	const router = useRouter()
	const form = ref({ name: '', description: '' })
	const error = ref('')
	const loading = ref(false)

	async function createClass() {
	if (!form.value.name) return
	loading.value = true
	error.value = ''
	const { data: { user } } = await supabase.auth.getUser()
	const { error: err } = await supabase.from('classes').insert({
	teacher_id: user.id,
	name: form.value.name,
	description: form.value.description || null,
	})
	loading.value = false
	if (err) { error.value = err.message; return }
	router.push('/professor/turmas')
	}
</script>

<style scoped="">
	.professor-page { min-height: 100vh; background: var(--bg-0); }
	.content { padding: 40px 48px; max-width: 640px; margin: 0 auto; }
	.back-link { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--ink-2); text-decoration: none; display: inline-block; margin-bottom: 16px; }
	.back-link:hover { color: var(--gold); }
	h1 { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin: 0 0 32px; }
	.form-card { padding: 32px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; display: flex; flex-direction: column; gap: 20px; }
	.field { display: flex; flex-direction: column; gap: 8px; }
	.field label { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); }
	.field input, .field textarea { padding: 12px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--ink-0); font-family: var(--font-body); font-size: 15px; outline: none; transition: all 0.2s; resize: vertical; }
	.field input:focus, .field textarea:focus { border-color: rgba(245,201,122,0.4); background: rgba(245,201,122,0.04); }
	.field input::placeholder, .field textarea::placeholder { color: var(--ink-3); }
	.error { color: #ff6b8b; font-size: 13px; padding: 10px 14px; background: rgba(255,107,139,0.08); border: 1px solid rgba(255,107,139,0.25); border-radius: 8px; }
	.form-actions { display: flex; gap: 12px; justify-content: flex-end; }
	.btn-cancel { padding: 12px 24px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--ink-2); font-family: var(--font-display); font-size: 12px; letter-spacing: 1.5px; text-decoration: none; }
	.btn-cancel:hover { border-color: rgba(255,255,255,0.2); color: var(--ink-0); }
	.btn-submit { padding: 12px 28px; background: linear-gradient(180deg, rgba(245,201,122,0.22), rgba(245,201,122,0.08)); border: 1px solid var(--gold); border-radius: 10px; color: var(--gold); font-family: var(--font-display); font-size: 12px; font-weight: 700; letter-spacing: 1.5px; cursor: pointer; transition: all 0.2s; }
	.btn-submit:hover:not(:disabled) { background: linear-gradient(180deg, rgba(245,201,122,0.38), rgba(245,201,122,0.18)); box-shadow: 0 0 20px rgba(245,201,122,0.2); }
	.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
</style>