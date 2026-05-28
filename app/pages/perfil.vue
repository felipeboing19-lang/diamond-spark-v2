<template>
  <div class="page">
    <div class="center">
      <h1>PERFIL</h1>
      <p>Relatório RIASEC e Inteligências Múltiplas — em construção</p>
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
</style>
