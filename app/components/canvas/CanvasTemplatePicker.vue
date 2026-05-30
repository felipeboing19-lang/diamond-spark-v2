<script setup="">
	import { computed } from 'vue'
	import { CANVAS_TEMPLATE_LIST, getCanvasTemplate } from '~/composables/useCanvasTemplates'

	// v-model agora é um ARRAY ordenado de keys (a sequência de execução)
	const model = defineModel({ type: Array, default: () => [] })

	function isSelected(key) {
	return model.value.includes(key)
	}
	function orderOf(key) {
	return model.value.indexOf(key) + 1
	}
	function toggle(key) {
	const idx = model.value.indexOf(key)
	if (idx > -1) model.value = model.value.filter(k => k !== key)
	else model.value = [...model.value, key]
	}
	function move(key, dir) {
	const arr = [...model.value]
	const i = arr.indexOf(key)
	const j = i + dir
	if (j < 0 || j >= arr.length) return
  ;[arr[i], arr[j]] = [arr[j], arr[i]]
  model.value = arr
}
function selectAll() {
  model.value = CANVAS_TEMPLATE_LIST.map(t => t.key)
}
function clearAll() {
  model.value = []
}

const sequence = computed(() => model.value.map(getCanvasTemplate).filter(Boolean))
</script>

<template>
	<div class="ctp-wrap">
		<div class="ctp-toolbar">
			<span class="ctp-hint">Clique para adicionar à sequência</span>
			<div class="ctp-actions">
				<button type="button" class="ctp-link" @click="selectAll">Selecionar todos</button>
				<button type="button" class="ctp-link" @click="clearAll" v-if="model.length">Limpar</button>
			</div>
		</div>

		<div class="ctp">
			<button
			  v-for="tpl in CANVAS_TEMPLATE_LIST"
			  :key="tpl.key"
			  type="button"
			  class="ctp-card"
			  :class="{ active: isSelected(tpl.key) }"
			  @click="toggle(tpl.key)"
      >
				<div class="ctp-icon">{{ tpl.icon }}</div>
				<div class="ctp-body">
					<span class="ctp-name">{{ tpl.name }}</span>
					<span class="ctp-desc">{{ tpl.desc }}</span>
					<span class="ctp-meta">{{ tpl.zones.length }} zonas</span>
				</div>
				<div class="ctp-order" v-if="isSelected(tpl.key)">{{ orderOf(tpl.key) }}</div>
			</button>
		</div>

		<div class="ctp-seq" v-if="sequence.length">
			<span class="ctp-seq-title">ORDEM DE EXECUÇÃO</span>
			<div class="ctp-seq-list">
				<div class="ctp-seq-item" v-for="(tpl, i) in sequence" :key="tpl.key">
					<span class="ctp-seq-num">{{ i + 1 }}</span>
					<span class="ctp-seq-icon">{{ tpl.icon }}</span>
					<span class="ctp-seq-name">{{ tpl.name }}</span>
					<div class="ctp-seq-ctrl">
						<button type="button" :disabled="i === 0" @click="move(tpl.key, -1)" title="Subir">↑</button>
						<button type="button" :disabled="i === sequence.length - 1" @click="move(tpl.key, 1)" title="Descer">↓</button>
						<button type="button" class="rm" @click="toggle(tpl.key)" title="Remover">✕</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped="">
	.ctp-wrap { display: flex; flex-direction: column; gap: 14px; }

	.ctp-toolbar { display: flex; align-items: center; justify-content: space-between; }
	.ctp-hint { font-size: 12px; color: var(--ink-2); }
	.ctp-actions { display: flex; gap: 14px; }
	.ctp-link { background: none; border: none; color: var(--gold); font-size: 12px; cursor: pointer; padding: 0; }
	.ctp-link:hover { text-decoration: underline; }

	.ctp { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
	@media (max-width: 640px) { .ctp { grid-template-columns: 1fr; } }

	.ctp-card {
	position: relative; display: flex; align-items: flex-start; gap: 14px; text-align: left;
	padding: 16px; border-radius: 14px; border: 1px solid var(--bg-3); background: var(--bg-1);
	color: var(--ink-1); cursor: pointer;
	transition: border-color .18s ease, transform .18s ease, box-shadow .18s ease, background .18s ease;
	}
	.ctp-card:hover { transform: translateY(-2px); border-color: color-mix(in srgb, var(--gold) 50%, transparent); }
	.ctp-card.active {
	border-color: var(--gold);
	background: color-mix(in srgb, var(--gold) 8%, var(--bg-1));
	box-shadow: 0 0 0 1px var(--gold), 0 8px 24px -12px var(--gold);
	}

	.ctp-icon { font-size: 28px; line-height: 1; flex-shrink: 0; filter: drop-shadow(0 0 8px color-mix(in srgb, var(--gold) 40%, transparent)); }
	.ctp-body { display: flex; flex-direction: column; gap: 4px; }
	.ctp-name { font-family: 'Orbitron', sans-serif; font-weight: 700; font-size: 14px; letter-spacing: .02em; color: var(--ink-0); }
	.ctp-desc { font-size: 12.5px; line-height: 1.4; color: var(--ink-2); }
	.ctp-meta { margin-top: 2px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--gold); opacity: .85; }

	.ctp-order {
	position: absolute; top: 12px; right: 12px; width: 24px; height: 24px; display: grid; place-items: center;
	border-radius: 50%; background: var(--gold); color: var(--bg-0); font-size: 13px; font-weight: 800;
	font-family: 'Orbitron', sans-serif;
	}

	.ctp-seq { padding: 14px; border: 1px dashed color-mix(in srgb, var(--gold) 35%, transparent); border-radius: 12px; background: var(--bg-1); }
	.ctp-seq-title { font-family: 'Orbitron', sans-serif; font-size: 10px; letter-spacing: 2px; color: var(--ink-3); }
	.ctp-seq-list { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
	.ctp-seq-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px; background: var(--bg-2); }
	.ctp-seq-num { width: 22px; height: 22px; display: grid; place-items: center; border-radius: 6px; background: var(--gold); color: var(--bg-0); font-weight: 800; font-size: 12px; }
	.ctp-seq-icon { font-size: 18px; }
	.ctp-seq-name { flex: 1; font-size: 14px; color: var(--ink-0); }
	.ctp-seq-ctrl { display: flex; gap: 4px; }
	.ctp-seq-ctrl button {
	width: 26px; height: 26px; border-radius: 6px; border: 1px solid var(--bg-3); background: var(--bg-1);
	color: var(--ink-1); cursor: pointer; font-size: 13px; line-height: 1; transition: all .15s;
	}
	.ctp-seq-ctrl button:hover:not(:disabled) { border-color: var(--gold); color: var(--gold); }
	.ctp-seq-ctrl button:disabled { opacity: .3; cursor: not-allowed; }
	.ctp-seq-ctrl .rm:hover { border-color: #ff6b8b; color: #ff6b8b; }
</style>