<template>
  <div class="page">
    <div class="center">
      <h1>PÁGINA</h1>
      <p>Em construção</p>
      <NuxtLink to="/game" class="btn">← VOLTAR</NuxtLink>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default', middleware: 'auth' })
</script>
<style lang="sass" scoped>
.page
  min-height: 100vh
  background: var(--bg-0)
  display: flex
  align-items: center
  justify-content: center
.center
  text-align: center
  h1
    font-family: 'Cinzel', serif
    font-size: 32px
    color: var(--gold)
    margin-bottom: 16px
  p
    color: var(--ink-2)
    margin-bottom: 32px
.btn
  font-family: 'Orbitron', sans-serif
  font-size: 12px
  color: var(--gold)
  border: 1px solid var(--gold)
  padding: 12px 24px
  border-radius: 8px
</style>
