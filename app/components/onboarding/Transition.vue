<template>
  <div class="transition-screen">
    <div class="orb">
      <div class="ring r1"></div>
      <div class="ring r2"></div>
      <div class="ring r3"></div>
      <div class="core" :style="{ '--c': profile?.color || '#f5c97a', '--cg': profile?.glow || 'rgba(245,201,122,0.5)' }">
        <span>{{ profile?.letter || '◆' }}</span>
      </div>
    </div>

    <div class="content">
      <span class="label">PERFIL ESCOLHIDO</span>
      <h2>{{ profile?.name }}</h2>
      <p class="speech">"{{ profile?.speech }}"</p>

      <div class="divider"></div>

      <div class="next-info">
        <span class="next-label">PRÓXIMA FASE</span>
        <h3>INTELIGÊNCIAS MÚLTIPLAS</h3>
        <p>Agora vamos descobrir como você aprende e processa o mundo. Falta pouco para completar sua jornada!</p>
      </div>

      <button class="continue-btn" @click="$emit('continue')">
        <span>CONTINUAR JORNADA</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="13 17 18 12 13 7"/>
          <polyline points="6 17 11 12 6 7"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  profile: { type: Object, default: null }
})
defineEmits(['continue'])
</script>

<style lang="sass" scoped>
.transition-screen
  display: flex
  flex-direction: column
  align-items: center
  gap: 32px
  padding: 48px 32px
  text-align: center
  max-width: 560px

.orb
  position: relative
  width: 140px
  height: 140px

.ring
  position: absolute
  inset: 0
  border-radius: 50%
  border: 2px solid var(--gold)
  animation: ring-pulse 1.6s ease-out infinite

  &.r2
    animation-delay: 0.4s
  &.r3
    animation-delay: 0.8s

@keyframes ring-pulse
  0%
    transform: scale(0.4)
    opacity: 0.8
  100%
    transform: scale(1.5)
    opacity: 0

.core
  position: absolute
  inset: 35px
  border-radius: 50%
  background: radial-gradient(circle at 30% 30%, var(--c), rgba(0,0,0,0.7))
  border: 2px solid var(--c)
  box-shadow: 0 0 30px var(--cg)
  display: flex
  align-items: center
  justify-content: center
  animation: core-pop 0.8s ease

  span
    font-family: var(--font-display)
    font-size: 28px
    font-weight: 900
    color: #fff
    text-shadow: 0 0 12px var(--cg)

@keyframes core-pop
  0%
    transform: scale(0.5)
    opacity: 0
  60%
    transform: scale(1.1)
  100%
    transform: scale(1)
    opacity: 1

.content
  display: flex
  flex-direction: column
  align-items: center
  gap: 16px

.label
  font-family: var(--font-display)
  font-size: 10px
  letter-spacing: 3px
  color: var(--gold)
  opacity: 0.7

h2
  margin: 0
  font-family: var(--font-display)
  font-size: 32px
  font-weight: 900
  letter-spacing: 2px
  color: var(--gold)
  text-shadow: 0 0 20px rgba(245,201,122,0.5)

.speech
  margin: 0
  font-family: var(--font-body)
  font-size: 15px
  font-style: italic
  color: var(--ink-1)
  line-height: 1.6
  max-width: 400px

.divider
  width: 80px
  height: 1px
  background: linear-gradient(90deg, transparent, rgba(245,201,122,0.5), transparent)

.next-info
  display: flex
  flex-direction: column
  align-items: center
  gap: 8px
  padding: 20px 28px
  background: rgba(255,255,255,0.04)
  border: 1px solid rgba(255,255,255,0.08)
  border-radius: 14px

.next-label
  font-family: var(--font-display)
  font-size: 9px
  letter-spacing: 3px
  color: var(--ink-3)

h3
  margin: 0
  font-family: var(--font-display)
  font-size: 18px
  font-weight: 700
  letter-spacing: 2px
  color: var(--ink-0)

.next-info p
  margin: 0
  font-family: var(--font-body)
  font-size: 13px
  color: var(--ink-2)
  line-height: 1.6
  max-width: 360px

.continue-btn
  display: inline-flex
  align-items: center
  gap: 12px
  padding: 14px 40px
  background: linear-gradient(180deg, rgba(245,201,122,0.22), rgba(245,201,122,0.08))
  border: 1px solid var(--gold)
  border-radius: 10px
  color: var(--gold)
  font-family: var(--font-display)
  font-weight: 700
  font-size: 13px
  letter-spacing: 2px
  cursor: pointer
  box-shadow: 0 0 24px rgba(245,201,122,0.2)
  transition: all 0.2s

  &:hover
    background: linear-gradient(180deg, rgba(245,201,122,0.38), rgba(245,201,122,0.18))
    box-shadow: 0 0 40px rgba(245,201,122,0.4)
    transform: translateY(-2px)
</style>
