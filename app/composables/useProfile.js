// composable global — retorna dados do perfil + avatar path baseado no gender
export const useProfile = () => {
  const supabase = useSupabaseClient()
  const profile = useState('profile', () => null)

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile.value = data
  }

  // Retorna o path correto do avatar baseado no gender e código do perfil
  function avatarPath(code, index) {
    const gender = profile.value?.gender || 'neutral'
    const folder = gender === 'male' ? 'male' : gender === 'female' ? 'female' : 'neutral'
    const num = String(index || profileIndex(code)).padStart(2, '0')
    return `/images/${folder}/P${num}.png`
  }

  function profileIndex(code) {
    const map = { R: 1, I: 2, A: 3, S: 4, E: 5, C: 6 }
    return map[code] || 1
  }

  const gender = computed(() => profile.value?.gender || 'neutral')
  const genderLabel = computed(() => {
    const map = { male: 'Masculino', female: 'Feminino', neutral: 'Neutro' }
    return map[gender.value] || 'Neutro'
  })
  const genderIcon = computed(() => {
    const map = { male: '⚔️', female: '✨', neutral: '◆' }
    return map[gender.value] || '◆'
  })

  return { profile, loadProfile, avatarPath, gender, genderLabel, genderIcon }
}
