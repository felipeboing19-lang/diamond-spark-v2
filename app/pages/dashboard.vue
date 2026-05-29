<template>
  <div class="page">
    <AlunoNav />
    <main class="content">
      <div v-if="loading" class="loading">Carregando...</div>
      <div v-else>

        <!-- Header -->
        <div class="hero" :style="{ '--c': profileColor, '--cg': profileGlow }">
          <div class="hero-avatar">
            <img :src="avatarSrc" :alt="profile?.name" @error="onImgError" />
            <span class="hero-letter">{{ profile?.riasec_profile || '?' }}</span>
          </div>
          <div class="hero-info">
            <span class="hero-greeting">BEM-VINDO DE VOLTA</span>
            <h1>{{ profile?.name }}</h1>
            <div class="hero-tags">
              <span class="tag" :style="{ color: profileColor, borderColor: profileColor }">
                {{ profileName }}
              </span>
              <span v-if="intelName" class="tag" style="color: var(--ink-2); border-color: rgba(255,255,255,0.15)">
                {{ intelName }}
              </span>
            </div>
          </div>
          <div class="hero-xp">
            <div class="xp-ring">
              <span class="xp-num">{{ profile?.level || 1 }}</span>
              <span class="xp-sub">NÍVEL</span>
            </div>
            <div class="xp-bar-wrap">
              <div class="xp-label-row">
                <span>XP</span>
                <span>{{ profile?.xp || 0 }}</span>
              </div>
              <div class="xp-bar">
                <div class="xp-fill" :style="{ width: xpPercent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">🏫</span>
            <div>
              <span class="stat-num">{{ stats.classes }}</span>
              <span class="stat-label">TURMAS</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">📋</span>
            <div>
              <span class="stat-num">{{ stats.activities }}</span>
              <span class="stat-label">ATIVIDADES</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">✅</span>
            <div>
              <span class="stat-num">{{ stats.deliveries }}</span>
              <span class="stat-label">ENTREGAS</span>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">⚔️</span>
            <div>
              <span class="stat-num">{{ stats.teams }}</span>
              <span class="stat-label">EQUIPES</span>
            </div>
          </div>
        </div>

        <!-- Ações rápidas -->
        <div class="section">
          <h2>AÇÕES RÁPIDAS</h2>
          <div class="quick-grid">
            <NuxtLink to="/turmas" class="quick-btn">
              <span class="quick-icon">🏫</span>
              <span>MINHAS TURMAS</span>
            </NuxtLink>
            <NuxtLink to="/perfil" class="quick-btn">
              <span class="quick-icon">👤</span>
              <span>MEU PERFIL</span>
            </NuxtLink>
            <NuxtLink to="/turmas" class="quick-btn secondary">
              <span class="quick-icon">➕</span>
              <span>ENTRAR EM TURMA</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Turmas recentes -->
        <div v-if="classes.length > 0" class="section">
          <h2>TURMAS RECENTES</h2>
          <div class="classes-list">
            <div v-for="c in classes.slice(0, 3)" :key="c.id" class="class-row">
              <span class="class-icon">🏫</span>
              <div class="class-info">
                <span class="class-name">{{ c.name }}</span>
                <span class="class-desc">{{ c.description || 'Sem descrição' }}</span>
              </div>
              <NuxtLink to="/turmas" class="class-link">VER →</NuxtLink>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { profiles, intelligences, getAvatarPath } from '~/components/onboarding/data.js'
definePageMeta({ layout: 'default', middleware: 'auth' })

const supabase = useSupabaseClient()
const profile = ref(null)
const classes = ref([])
const loading = ref(true)
const stats = ref({ classes: 0, activities: 0, deliveries: 0, teams: 0 })

const profileColors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }
const profileColor = computed(() => profileColors[profile.value?.riasec_profile] || '#f5c97a')
const profileGlow = computed(() => profileColor.value.replace(')', ', 0.35)').replace('rgb', 'rgba'))
const profileName = computed(() => profiles[profile.value?.riasec_profile]?.name || 'SEM PERFIL')
const intelName = computed(() => intelligences[profile.value?.intelligence_profile]?.name || null)
const xpPercent = computed(() => Math.min(((profile.value?.xp || 0) % 100), 100))

const avatarSrc = computed(() => {
  const idx = profiles[profile.value?.riasec_profile]?.avatarIndex || 1
  return getAvatarPath(idx, profile.value?.gender || 'neutral')
})

function onImgError(e) { e.target.style.display = 'none' }

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  profile.value = p

  const { data: cs } = await supabase.from('class_students').select('joined_at, classes(id, name, description)').eq('student_id', user.id)
  classes.value = (cs || []).map(c => ({ ...c.classes, joined_at: c.joined_at }))
  stats.value.classes = classes.value.length

  loading.value = false
})
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 32px; }
.loading { text-align: center; padding: 80px; color: var(--ink-2); }
.hero { display: grid; grid-template-columns: 120px 1fr auto; gap: 28px; align-items: center; padding: 28px 32px; background: rgba(255,255,255,0.04); border: 1px solid color-mix(in srgb, var(--c) 30%, rgba(255,255,255,0.08)); border-radius: 20px; box-shadow: 0 0 32px var(--cg); }
.hero-avatar { position: relative; width: 120px; height: 120px; border-radius: 50%; border: 2px solid var(--c); overflow: hidden; box-shadow: 0 0 18px var(--cg); background: rgba(5,8,18,0.9); flex-shrink: 0; }
.hero-avatar img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.hero-letter { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 36px; font-weight: 900; color: var(--c); }
.hero-greeting { font-family: var(--font-display); font-size: 10px; letter-spacing: 3px; color: var(--ink-3); display: block; margin-bottom: 6px; }
h1 { font-family: var(--font-display); font-size: 24px; color: var(--ink-0); margin: 0 0 10px; }
.hero-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag { font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; padding: 3px 10px; border-radius: 999px; border: 1px solid; }
.hero-xp { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.xp-ring { width: 72px; height: 72px; border-radius: 50%; border: 3px solid var(--gold); display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(245,201,122,0.3); }
.xp-num { font-family: var(--font-display); font-size: 20px; font-weight: 900; color: var(--gold); line-height: 1; }
.xp-sub { font-family: var(--font-display); font-size: 8px; letter-spacing: 2px; color: var(--ink-3); }
.xp-bar-wrap { width: 100px; }
.xp-label-row { display: flex; justify-content: space-between; font-family: var(--font-display); font-size: 9px; letter-spacing: 1px; color: var(--ink-3); margin-bottom: 4px; }
.xp-bar { height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
.xp-fill { height: 100%; background: var(--gold); border-radius: 3px; box-shadow: 0 0 6px rgba(245,201,122,0.5); transition: width 0.6s ease; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.stat-card { display: flex; align-items: center; gap: 14px; padding: 18px 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; }
.stat-icon { font-size: 24px; }
.stat-num { display: block; font-family: var(--font-display); font-size: 24px; font-weight: 900; color: var(--gold); }
.stat-label { display: block; font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; color: var(--ink-3); margin-top: 2px; }
.section h2 { font-family: var(--font-display); font-size: 12px; letter-spacing: 2px; color: var(--ink-2); margin: 0 0 14px; }
.quick-grid { display: flex; gap: 12px; }
.quick-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px 24px; background: linear-gradient(180deg, rgba(245,201,122,0.15), rgba(245,201,122,0.05)); border: 1px solid rgba(245,201,122,0.25); border-radius: 14px; color: var(--gold); font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; text-decoration: none; transition: all 0.2s; }
.quick-btn:hover { background: linear-gradient(180deg, rgba(245,201,122,0.25), rgba(245,201,122,0.1)); box-shadow: 0 0 16px rgba(245,201,122,0.15); }
.quick-btn.secondary { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); color: var(--ink-1); }
.quick-icon { font-size: 22px; }
.classes-list { display: flex; flex-direction: column; gap: 8px; }
.class-row { display: flex; align-items: center; gap: 14px; padding: 14px 18px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; }
.class-icon { font-size: 22px; flex-shrink: 0; }
.class-info { flex: 1; }
.class-name { display: block; font-family: var(--font-display); font-size: 13px; color: var(--ink-0); margin-bottom: 2px; }
.class-desc { font-size: 12px; color: var(--ink-3); }
.class-link { font-family: var(--font-display); font-size: 11px; letter-spacing: 1.5px; color: var(--gold); text-decoration: none; }
</style>
