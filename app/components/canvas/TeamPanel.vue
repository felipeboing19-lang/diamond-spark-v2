<script setup>
const props = defineProps({
  team: { type: Object, required: true },          // { id, name, color }
  members: { type: Array, default: () => [] },     // [{ id, name }]
  onlineIds: { type: Array, default: () => [] },   // ids online agora
  editingIds: { type: Array, default: () => [] },  // ids editando algo agora
  completedIds: { type: Array, default: () => [] },// ids que concluíram a atividade
})

function isOnline(id) { return props.onlineIds.includes(id) }
function isEditing(id) { return props.editingIds.includes(id) }
function isDone(id) { return props.completedIds.includes(id) }
function statusOf(id) {
  if (isEditing(id)) return 'editando'
  if (isOnline(id)) return 'online'
  return 'offline'
}
function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(' ')
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase()
}
</script>

<template>
  <aside class="team-panel">
    <div class="tp-head">
      <span class="tp-dot" :style="{ background: team.color || 'var(--gold)' }"></span>
      <div>
        <span class="tp-label">PARTICIPANTES</span>
        <h3 class="tp-name">{{ team.name }}</h3>
      </div>
    </div>

    <div class="tp-online">
      <span class="tp-online-count">{{ onlineIds.length }}</span> de {{ members.length }} online
    </div>

    <ul class="tp-members">
      <li v-for="m in members" :key="m.id" :class="statusOf(m.id)">
        <span class="tp-avatar">
          {{ initials(m.name) }}
          <i class="tp-status" v-if="isOnline(m.id)"></i>
        </span>
        <span class="tp-mname">{{ m.name || 'Aluno' }}</span>
        <span class="tp-done" v-if="isDone(m.id)" title="Concluiu">✓</span>
        <span class="tp-mtag" :class="statusOf(m.id)">{{ statusOf(m.id) }}</span>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.team-panel { background: var(--bg-1); border: 1px solid var(--bg-3); border-radius: 16px; padding: 18px; position: sticky; top: 20px; }
.tp-head { display: flex; align-items: center; gap: 12px; }
.tp-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 10px currentColor; }
.tp-label { font-family: 'Orbitron', sans-serif; font-size: 9px; letter-spacing: 2px; color: var(--ink-3); display: block; }
.tp-name { font-family: 'Orbitron', sans-serif; font-size: 16px; color: var(--ink-0); margin: 2px 0 0; }

.tp-online { margin: 16px 0 10px; font-size: 12px; color: var(--ink-2); }
.tp-online-count { color: #3fe0a8; font-weight: 800; }

.tp-members { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.tp-members li { display: flex; align-items: center; gap: 10px; padding: 8px; border-radius: 10px; background: var(--bg-2); transition: opacity .2s; }
.tp-members li.offline { opacity: .45; }

.tp-avatar { position: relative; width: 32px; height: 32px; flex-shrink: 0; border-radius: 50%; display: grid; place-items: center; font-size: 12px; font-weight: 800; color: var(--bg-0); background: var(--gold); font-family: 'Orbitron', sans-serif; }
.tp-status { position: absolute; bottom: -1px; right: -1px; width: 10px; height: 10px; border-radius: 50%; background: #3fe0a8; border: 2px solid var(--bg-2); }
.tp-mname { flex: 1; font-size: 13.5px; color: var(--ink-0); }
.tp-done { width: 18px; height: 18px; display: grid; place-items: center; border-radius: 50%; background: #3fe0a8; color: var(--bg-0); font-size: 11px; font-weight: 800; }

.tp-mtag { font-size: 9px; letter-spacing: 1px; text-transform: uppercase; padding: 2px 7px; border-radius: 6px; }
.tp-mtag.editando { color: #ffd97a; background: rgba(255,217,122,.12); }
.tp-mtag.online   { color: #3fe0a8; background: rgba(63,224,168,.12); }
.tp-mtag.offline  { color: var(--ink-3); background: transparent; }

@media (max-width: 980px) { .team-panel { position: static; } }
</style>
