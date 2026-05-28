<template>
  <div class="onboarding-page">
    <div class="bg-stars"></div>
    <div class="center">
      <h1>ONBOARDING</h1>
      <p>Em construção — questionário RIASEC + Inteligências Múltiplas</p>
      <NuxtLink to="/game" class="btn">IR PARA O GAME →</NuxtLink>
    </div>
  </div>
</template>
<script setup>
definePageMeta({ layout: 'default', middleware: 'auth' })
</script>
<style lang="sass" scoped>
.onboarding-page
  min-height: 100vh
  background: var(--bg-0)
  display: flex
  align-items: center
  justify-content: center
  position: relative
.bg-stars
  position: fixed
  inset: 0
  background-image: radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.9), transparent)
  background-size: 700px 700px
  z-index: 0
  pointer-events: none
.center
  position: relative
  z-index: 1
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
  letter-spacing: 0.2em
  color: var(--gold)
  border: 1px solid var(--gold)
  padding: 12px 24px
  border-radius: 8px
  transition: all 0.2s
  &:hover
    background: rgba(245,201,122,0.15)
</style>
