export default defineNuxtRouteMiddleware(async () => {
  const supabase = useSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return navigateTo('/')
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!profile || profile.role !== 'professor') return navigateTo('/game')
})
