<script setup>
import { computed } from 'vue'
import { POSTIT_COLORS } from '~/composables/useCanvasTemplates'

const props = defineProps({
  template: { type: Object, required: true },   // objeto do useCanvasTemplates
  postits:  { type: Array, default: () => [] }, // post-its DESTE canvas (já filtrados por template)
  editorsByPostit: { type: Object, default: () => ({}) }, // { postitId: [nomes] }
  focusedId: { type: [String, null], default: null },
  currentUserId: { type: String, default: '' },          // pra saber quem é o dono
  readonly: { type: Boolean, default: false },           // modo professor (só leitura)
})
const emit = defineEmits(['add', 'update', 'delete', 'focus', 'blur'])

function zonePostits(zoneId) {
  return props.postits.filter(p => p.zone === zoneId)
}
function addToZone(zoneId) {
  const color = POSTIT_COLORS[Math.floor(Math.random() * POSTIT_COLORS.length)]
  emit('add', { zone: zoneId, color })
}

const isMatrix = computed(() => props.template.key === 'esforco_impacto')
</script>

<template>
  <div class="board" :class="{ matrix: isMatrix }">
    <!-- rótulos dos eixos (só na matriz esforço x impacto) -->
    <template v-if="isMatrix">
      <div class="axis axis-y top">{{ template.axes.y.top }}</div>
      <div class="axis axis-y bottom">{{ template.axes.y.bottom }}</div>
      <div class="axis axis-x left">{{ template.axes.x.left }}</div>
      <div class="axis axis-x right">{{ template.axes.x.right }}</div>
    </template>

    <div class="zones" :style="{ '--cols': template.cols }">
      <section
        v-for="zone in template.zones"
        :key="zone.id"
        class="zone"
        :style="{ '--accent': zone.color }"
      >
        <header class="zone-head">
          <div class="zone-title">{{ zone.title }}</div>
          <button v-if="!readonly" class="zone-add" @click="addToZone(zone.id)" title="Novo post-it">+</button>
        </header>
        <p class="zone-hint">{{ zone.hint }}</p>

        <div class="zone-notes">
          <PostItNote
            v-for="p in zonePostits(zone.id)"
            :key="p.id"
            :postit="p"
            :editors="editorsByPostit[p.id] || []"
            :focused="focusedId === p.id"
            :can-edit="!readonly && p.author_id === currentUserId"
            @update="emit('update', $event)"
            @delete="emit('delete', $event)"
            @focus="emit('focus', $event)"
            @blur="emit('blur', $event)"
          />
          <button class="zone-empty" v-if="zonePostits(zone.id).length === 0 && !readonly" @click="addToZone(zone.id)">
            + Adicionar post-it
          </button>
          <p class="zone-none" v-else-if="zonePostits(zone.id).length === 0 && readonly">Sem post-its ainda.</p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.board { position: relative; }

.zones {
  display: grid;
  grid-template-columns: repeat(var(--cols, 3), 1fr);
  gap: 14px;
}
@media (max-width: 820px) { .zones { grid-template-columns: 1fr; } }

.zone {
  background: var(--bg-1);
  border: 1px solid var(--bg-3);
  border-top: 3px solid var(--accent);
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  min-height: 180px;
}
.zone-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.zone-title { font-family: 'Orbitron', sans-serif; font-weight: 700; font-size: 13px; color: var(--ink-0); letter-spacing: .02em; }
.zone-add {
  width: 26px; height: 26px; flex-shrink: 0; border-radius: 8px; cursor: pointer;
  border: 1px solid var(--accent); background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent); font-size: 16px; line-height: 1; transition: all .15s;
}
.zone-add:hover { background: color-mix(in srgb, var(--accent) 28%, transparent); }
.zone-hint { margin: 4px 0 12px; font-size: 11.5px; line-height: 1.4; color: var(--ink-2); }

.zone-notes { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; align-content: start; }
.zone-empty {
  grid-column: 1 / -1;
  padding: 16px; border: 1px dashed var(--bg-3); border-radius: 10px;
  background: transparent; color: var(--ink-3); font-size: 12.5px; cursor: pointer; transition: all .15s;
}
.zone-empty:hover { border-color: var(--accent); color: var(--accent); }
.zone-none { grid-column: 1 / -1; padding: 12px; color: var(--ink-3); font-size: 12px; font-style: italic; }

/* ---- matriz esforço x impacto: 2x2 com eixos ---- */
.board.matrix { padding: 26px 26px 26px 30px; }
.board.matrix .zones { grid-template-columns: repeat(2, 1fr); }
@media (max-width: 820px) { .board.matrix .zones { grid-template-columns: 1fr; } }

.axis {
  position: absolute; font-family: 'Orbitron', sans-serif; font-size: 9px;
  letter-spacing: 1.5px; color: var(--ink-3); text-transform: uppercase; pointer-events: none;
}
.axis-y.top { top: 4px; left: 50%; transform: translateX(-50%); }
.axis-y.bottom { bottom: 4px; left: 50%; transform: translateX(-50%); }
.axis-x.left { left: -2px; top: 50%; transform: translateY(-50%) rotate(-90deg); transform-origin: left center; }
.axis-x.right { right: -14px; top: 50%; transform: translateY(-50%) rotate(90deg); transform-origin: right center; }
@media (max-width: 820px) { .axis { display: none; } .board.matrix { padding: 0; } }
</style>
