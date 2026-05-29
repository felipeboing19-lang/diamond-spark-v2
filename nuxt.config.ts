export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
  ],

  supabase: {
    redirect: false,
  },

  css: ['~/assets/styles/main.sass'],

  components: [
    {
      path: '~/components/onboarding',
      prefix: 'Onb',
      global: true
    },
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  app: {
    head: {
      title: 'Diamond Spark',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=Nunito:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap'
        }
      ]
    }
  }
})