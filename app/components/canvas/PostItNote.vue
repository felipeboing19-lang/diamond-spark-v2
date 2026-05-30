<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  postit: { type: Object, required: true },    // { id, content, color, author_name }
  editors: { type: Array, default: () => [] }, // nomes de quem está editando agora (outros)
  focused: { type: Boolean, default: false },  // se EU estou editando
  canEdit: { type: Boolean, default: true },   // só o autor edita
})
const emit = defineEmits(['update', 'delete', 'focus', 'blur'])

const local = ref(props.postit.content || '')

watch(() => props.postit.content, (val) => {
  if (!props.focused) local.value = val || ''
})

function onInput() {
  if (!props.canEdit) return
  emit('update', { id: props.postit.id, content: local.value })
}
</script>

<template>
  <div class="postit" :class="['c-' + (postit.color || 'yellow'), { readonly: !canEdit }]" :data-editing="editors.length > 0">
    <button v-if="canEdit" class="postit-del" @click="emit('delete', postit.id)" title="Remover">✕</button>

    <textarea
      class="postit-text"
      v-model="local"
      :readonly="!canEdit"
      :placeholder="canEdit ? 'Escreva aqui...' : ''"
      @input="onInput"
      @focus="canEdit && emit('focus', postit.id)"
      @blur="canEdit && emit('blur', postit.id)"
    ></textarea>

    <div class="postit-foot">
      <span class="postit-author" v-if="postit.author_name">{{ postit.author_name }}</span>
      <span class="postit-editing" v-if="editors.length">✎ {{ editors.join(', ') }}</span>
    </div>
  </div>
</template>

<style scoped>
.postit {
  position: relative; display: flex; flex-direction: column;
  border-radius: 10px; padding: 10px 10px 8px; min-height: 110px;
  box-shadow: 0 6px 16px -8px rgba(0,0,0,.6);
  transition: transform .12s ease, box-shadow .12s ease;
  transform: rotate(-.6deg);
}
.postit:nth-child(even) { transform: rotate(.7deg); }
.postit:hover { transform: rotate(0) translateY(-2px); box-shadow: 0 10px 22px -8px rgba(0,0,0,.7); }
.postit[data-editing="true"] { outline: 2px solid rgba(255,255,255,.65); outline-offset: 1px; }
.postit.readonly { opacity: .96; }

.c-yellow { background: linear-gradient(160deg,#ffe27a,#f5c948); }
.c-pink   { background: linear-gradient(160deg,#ff9ed1,#ff5fb1); }
.c-cyan   { background: linear-gradient(160deg,#8df0ff,#3fd0f0); }
.c-green  { background: linear-gradient(160deg,#8df0c0,#3fe0a8); }
.c-purple { background: linear-gradient(160deg,#c4adff,#a073ff); }

.postit-text {
  flex: 1; width: 100%; border: none; background: transparent; resize: none; outline: none;
  font-family: var(--font-body, sans-serif); font-size: 13.5px; line-height: 1.4; color: #1a1208; min-height: 64px;
}
.postit-text::placeholder { color: rgba(26,18,8,.45); }
.postit.readonly .postit-text { cursor: default; }

.postit-del {
  position: absolute; top: 5px; right: 6px; width: 18px; height: 18px; border: none; border-radius: 50%;
  background: rgba(0,0,0,.12); color: #1a1208; font-size: 10px; line-height: 1; cursor: pointer; opacity: 0; transition: opacity .15s;
}
.postit:hover .postit-del { opacity: 1; }
.postit-del:hover { background: rgba(0,0,0,.28); }

.postit-foot { display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-top: 6px; min-height: 14px; }
.postit-author { font-size: 10px; font-weight: 700; color: rgba(26,18,8,.55); text-transform: uppercase; letter-spacing: .04em; }
.postit-editing { font-size: 10px; font-weight: 700; color: #0a3d2e; background: rgba(255,255,255,.5); padding: 1px 6px; border-radius: 6px; }
</style>
