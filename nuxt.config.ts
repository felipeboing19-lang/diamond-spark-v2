export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
  ],

  supabase: {
    redirect: false,
  },

  css: ['~/assets/styles/main.sass'],

  app: {
    head: {
      title: 'Diamond Spark',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Orbitron:wght@500;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap'
        }
      ]
    }
  }
})
