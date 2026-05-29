<template>
  <canvas ref="canvas" class="constellation-canvas"></canvas>
</template>

<script setup>
const props = defineProps({
  category: { type: String, default: 'R' },
  color: { type: String, default: '#3fb4ff' }
})

const canvas = ref(null)
let animFrame = null

const symbolMap = {
  R:   ['⚙', '🔧', '⛏', '🔩', '⚡', '🛠', '⚒', '🔨'],
  I:   ['∑', '∞', '∂', '∇', 'π', 'λ', '⚗', '∫'],
  A:   ['✦', '♪', '♫', '✿', '❋', '✺', '❂', '✧'],
  S:   ['♡', '◈', '⬡', '❋', '✿', '⊕', '✦', '◇'],
  E:   ['◆', '▲', '★', '⚡', '✦', '❖', '⬟', '◈'],
  C:   ['▦', '⊞', '◫', '⊟', '▤', '▣', '◧', '▩'],
  NAT: ['✿', '⊕', '⬡', '◈', '❋', '✦', '♧', '🌿'],
  MUS: ['♪', '♫', '♬', '♩', '〜', '∿', '≋', '♭'],
  LOG: ['∑', 'π', '∞', '∂', '≡', '∇', '⊗', '≈'],
  EXI: ['✦', '⊕', '∞', '◈', '❋', '✿', '☯', '◇'],
  INT: ['◈', '⬡', '⊕', '❋', '✦', '◆', '○', '◎'],
  COR: ['⚡', '▲', '◆', '✦', '❖', '★', '⬟', '◈'],
  LIN: ['∂', '≡', '◇', '✦', '❋', '⊕', '◈', 'Α'],
  INA: ['◈', '✦', '⊕', '❋', '∞', '◆', '○', '◎'],
  ESP: ['◈', '⬡', '▲', '◆', '⊕', '❋', '✦', '◇'],
}

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]
}

onMounted(() => {
  // Pequeno delay para garantir que o DOM está pronto
  setTimeout(() => init(), 100)
  window.addEventListener('resize', init)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animFrame)
  window.removeEventListener('resize', init)
})

watch(() => [props.category, props.color], () => {
  fadeOut(() => {
    setTimeout(() => init(), 50)
  })
})

function fadeOut(cb) {
  const c = canvas.value
  if (!c) { cb(); return }
  const ctx = c.getContext('2d')
  const W = c.width
  const H = c.height
  let alpha = 1
  cancelAnimationFrame(animFrame)

  function fade() {
    alpha -= 0.06
    ctx.fillStyle = `rgba(5, 6, 13, ${0.06})`
    ctx.fillRect(0, 0, W, H)
    if (alpha > 0) {
      animFrame = requestAnimationFrame(fade)
    } else {
      ctx.clearRect(0, 0, W, H)
      cb()
    }
  }
  animFrame = requestAnimationFrame(fade)
}

function init() {
  const c = canvas.value
  if (!c) return
  const parent = c.parentElement
  if (!parent) return

  const W = parent.clientWidth || 780
  const H = parent.clientHeight || 500
  c.width = W
  c.height = H
  c.style.width = W + 'px'
  c.style.height = H + 'px'

  startAnim(c, W, H)
}

function startAnim(c, W, H) {
  cancelAnimationFrame(animFrame)
  const ctx = c.getContext('2d')
  const [r, g, b] = hexToRgb(props.color)
  const syms = symbolMap[props.category] || symbolMap['R']

  const nodes = Array.from({ length: 30 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    size: Math.random() * 3 + 1.5,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.018 + 0.008,
    sym: syms[Math.floor(Math.random() * syms.length)],
    showSym: Math.random() > 0.4,
    symSize: Math.floor(Math.random() * 20) + 22,
    opacity: Math.random() * 0.45 + 0.15,
  }))

  function draw() {
    ctx.clearRect(0, 0, W, H)

    for (const n of nodes) {
      n.x += n.vx
      n.y += n.vy
      n.pulse += n.pulseSpeed
      if (n.x < -20) n.x = W + 20
      if (n.x > W + 20) n.x = -20
      if (n.y < -20) n.y = H + 20
      if (n.y > H + 20) n.y = -20
    }

    // Linhas de constelação
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x
        const dy = nodes[i].y - nodes[j].y
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dist < 200) {
          const alpha = (1 - dist/200) * 0.25
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
          ctx.lineWidth = 1
          ctx.moveTo(nodes[i].x, nodes[i].y)
          ctx.lineTo(nodes[j].x, nodes[j].y)
          ctx.stroke()
        }
      }
    }

    // Nós
    for (const n of nodes) {
      const pulse = (Math.sin(n.pulse) + 1) / 2
      const alpha = n.opacity * (0.5 + pulse * 0.5)

      if (n.showSym) {
        ctx.save()
        ctx.font = `${n.symSize}px serif`
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.7})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.shadowColor = `rgba(${r},${g},${b},0.5)`
        ctx.shadowBlur = 12
        ctx.fillText(n.sym, n.x, n.y)
        ctx.restore()
      } else {
        // Ponto com glow
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.size * 7)
        grd.addColorStop(0, `rgba(${r},${g},${b},${alpha})`)
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.size * 7, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.size * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.fill()
      }
    }

    animFrame = requestAnimationFrame(draw)
  }

  animFrame = requestAnimationFrame(draw)
}
</script>

<style scoped>
.constellation-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  border-radius: inherit;
}
</style>