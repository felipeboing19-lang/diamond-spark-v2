<template>
  <div class="page">
    <AlunoNav />
    <main class="content">
      <div v-if="loading" class="loading">Carregando...</div>
      <div v-else-if="profile">

        <!-- Header do perfil -->
        <div class="profile-header" :style="{ '--c': profileColor, '--cg': profileGlow }">
          <div class="avatar-wrap">
            <img :src="avatarSrc" :alt="profile.name" @error="onImgError" />
            <span class="avatar-letter">{{ profile.riasec_profile || '?' }}</span>
          </div>
          <div class="profile-info">
            <span class="profile-label">SEU PERFIL</span>
            <h1>{{ profile.name }}</h1>
            <div class="profile-tags">
              <span v-if="riasecData" class="tag riasec" :style="{ color: profileColor, borderColor: profileColor }">
                {{ riasecData.name }}
              </span>
              <span v-if="intelData" class="tag intel" :style="{ color: intelData.color, borderColor: intelData.color }">
                {{ intelData.name }}
              </span>
              <span class="tag gender">{{ genderLabel }}</span>
            </div>
            <p v-if="riasecData" class="profile-desc">{{ riasecData.description }}</p>
          </div>
          <div class="xp-block">
            <div class="xp-item">
              <span class="xp-num">{{ profile.level }}</span>
              <span class="xp-label">NÍVEL</span>
            </div>
            <div class="xp-item">
              <span class="xp-num">{{ profile.xp }}</span>
              <span class="xp-label">XP</span>
            </div>
          </div>
        </div>

        <!-- Áreas de atuação -->
        <div v-if="riasecData" class="section">
          <h2>ÁREAS DE ATUAÇÃO EM TECNOLOGIA</h2>
          <div class="careers">
            <span v-for="c in riasecData.careers" :key="c" class="career-tag" :style="{ color: profileColor, borderColor: profileColor }">
              {{ c }}
            </span>
          </div>
        </div>

        <!-- Inteligência predominante -->
        <div v-if="intelData" class="section">
          <h2>SUA INTELIGÊNCIA PREDOMINANTE</h2>
          <div class="intel-card" :style="{ '--ic': intelData.color }">
            <span class="intel-name">{{ intelData.name }}</span>
            <p>{{ intelData.description }}</p>
          </div>
        </div>

        <!-- Info da conta -->
        <div class="section">
          <h2>INFORMAÇÕES DA CONTA</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">E-MAIL</span>
              <span class="info-value">{{ profile.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">TIPO</span>
              <span class="info-value">{{ profile.role === 'aluno' ? 'ALUNO' : 'PROFESSOR' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">MEMBRO DESDE</span>
              <span class="info-value">{{ formatDate(profile.created_at) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">IDENTIDADE</span>
              <span class="info-value">{{ genderLabel }}</span>
            </div>
          </div>
        </div>

        <!-- Refazer onboarding -->
        <div class="section">
          <NuxtLink to="/onboarding" class="redo-btn">
            🔄 REFAZER QUESTIONÁRIO DE PERFIL
          </NuxtLink>
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
const loading = ref(true)
const { gender, loadProfile } = useProfile()

const profileColors = { R: '#ffc14d', I: '#00e5ff', A: '#ff5fb1', S: '#3fe0a8', E: '#a073ff', C: '#3fb4ff' }

const riasecData = computed(() => profile.value?.riasec_profile ? profiles[profile.value.riasec_profile] : null)
const intelData = computed(() => profile.value?.intelligence_profile ? intelligences[profile.value.intelligence_profile] : null)
const profileColor = computed(() => profileColors[profile.value?.riasec_profile] || '#f5c97a')
const profileGlow = computed(() => profileColor.value.replace(')', ', 0.4)').replace('rgb', 'rgba'))

const genderLabel = computed(() => {
  const map = { male: 'Masculino', female: 'Feminino', neutral: 'Neutro' }
  return map[profile.value?.gender] || 'Neutro'
})

const avatarSrc = computed(() => {
  const idx = riasecData.value?.avatarIndex || 1
  return getAvatarPath(idx, profile.value?.gender || 'neutral')
})

function onImgError(e) { e.target.style.display = 'none' }
function formatDate(d) { return new Date(d).toLocaleDateString('pt-BR') }

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  profile.value = data
  loading.value = false
})
</script>

<style scoped>
.page { min-height: 100vh; background: var(--bg-0); }
.content { padding: 40px 48px; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 32px; }
.loading { text-align: center; padding: 80px; color: var(--ink-2); }
.profile-header { display: grid; grid-template-columns: 160px 1fr auto; gap: 32px; align-items: start; padding: 32px; background: rgba(255,255,255,0.04); border: 1px solid color-mix(in srgb, var(--c) 30%, rgba(255,255,255,0.08)); border-radius: 20px; box-shadow: 0 0 40px var(--cg); }
.avatar-wrap { position: relative; width: 160px; height: 160px; border-radius: 50%; border: 3px solid var(--c); overflow: hidden; box-shadow: 0 0 24px var(--cg); background: rgba(5,8,18,0.9); }
.avatar-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.avatar-letter { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 48px; font-weight: 900; color: var(--c); }
.profile-label { font-family: var(--font-display); font-size: 10px; letter-spacing: 3px; color: var(--ink-3); display: block; margin-bottom: 6px; }
h1 { font-family: var(--font-display); font-size: 28px; color: var(--ink-0); margin: 0 0 12px; }
.profile-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.tag { font-family: var(--font-display); font-size: 10px; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 999px; border: 1px solid; }
.tag.gender { color: var(--ink-2); border-color: rgba(255,255,255,0.15); }
.profile-desc { margin: 0; color: var(--ink-2); font-size: 14px; line-height: 1.6; }
.xp-block { display: flex; flex-direction: column; gap: 16px; align-items: flex-end; }
.xp-item { text-align: right; }
.xp-num { display: block; font-family: var(--font-display); font-size: 32px; font-weight: 900; color: var(--gold); }
.xp-label { font-family: var(--font-display); font-size: 10px; letter-spacing: 2px; color: var(--ink-3); }
.section h2 { font-family: var(--font-display); font-size: 12px; letter-spacing: 2px; color: var(--ink-2); margin: 0 0 16px; }
.careers { display: flex; flex-wrap: wrap; gap: 8px; }
.career-tag { font-family: var(--font-display); font-size: 10px; letter-spacing: 1px; padding: 5px 14px; border-radius: 999px; border: 1px solid; }
.intel-card { padding: 16px 20px; background: rgba(255,255,255,0.04); border: 1px solid color-mix(in srgb, var(--ic) 40%, transparent); border-radius: 12px; }
.intel-name { display: block; font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--ic); margin-bottom: 6px; }
.intel-card p { margin: 0; color: var(--ink-2); font-size: 14px; }
.info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.info-item { padding: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; }
.info-label { display: block; font-family: var(--font-display); font-size: 9px; letter-spacing: 2px; color: var(--ink-3); margin-bottom: 6px; }
.info-value { font-family: var(--font-body); font-size: 15px; color: var(--ink-0); }
.redo-btn { display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: var(--ink-2); font-family: var(--font-display); font-size: 12px; letter-spacing: 1.5px; text-decoration: none; transition: all 0.2s; }
.redo-btn:hover { border-color: rgba(255,255,255,0.2); color: var(--ink-0); }
</style>
