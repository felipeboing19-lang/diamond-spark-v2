<template>
  <div class="loading">
    <div class="orb">
      <div class="ring r1"></div>
      <div class="ring r2"></div>
      <div class="ring r3"></div>
      <div class="core">◆</div>
    </div>
    <h2>ANALISANDO SEU PERFIL</h2>
    <p>Calculando suas habilidades e interesses...</p>
    <div class="bar-wrap">
      <div class="bar-fill" :style="{ width: `${progress}%` }"></div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['done'])
const progress = ref(0)

onMounted(() => {
  const interval = setInterval(() => {
    progress.value += Math.random() * 15
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(interval)
      setTimeout(() => emit('done'), 400)
    }
  }, 180)
})
</script>

<style lang="sass" scoped>
.loading
  display: flex
  flex-direction: column
  align-items: center
  gap: 24px
  padding: 60px 40px
  text-align: center

.orb
  position: relative
  width: 140px
  height: 140px

.ring
  position: absolute
  inset: 0
  border-radius: 50%
  border: 2px solid var(--gold)
  animation: ring-pulse 1.4s ease-out infinite

  &.r2
    animation-delay: 0.3s
  &.r3
    animation-delay: 0.6s

@keyframes ring-pulse
  0%
    transform: scale(0.3)
    opacity: 0.9
  100%
    transform: scale(1.4)
    opacity: 0

.core
  position: absolute
  inset: 40px
  border-radius: 50%
  background: radial-gradient(circle at 30% 30%, rgba(245,201,122,0.4), rgba(0,0,0,0.6))
  border: 2px solid var(--gold)
  display: flex
  align-items: center
  justify-content: center
  font-size: 24px
  color: var(--gold)
  animation: core-pulse 2s ease-in-out infinite

@keyframes core-pulse
  0%, 100%
    box-shadow: 0 0 20px rgba(245,201,122,0.4)
  50%
    box-shadow: 0 0 40px rgba(245,201,122,0.7)

h2
  font-family: 'Cinzel', serif
  font-size: 20px
  letter-spacing: 3px
  color: var(--gold)

p
  color: var(--ink-2)
  font-size: 14px
  letter-spacing: 1px

.bar-wrap
  width: 300px
  height: 4px
  background: rgba(255,255,255,0.06)
  border-radius: 2px
  overflow: hidden

.bar-fill
  height: 100%
  background: linear-gradient(90deg, var(--gold), rgba(245,201,122,0.6))
  box-shadow: 0 0 8px rgba(245,201,122,0.5)
  transition: width 0.2s ease
  border-radius: 2px
</style>
