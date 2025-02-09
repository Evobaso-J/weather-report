// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  typescript: {
    typeCheck: true,
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxt/ui',
    '@nuxt/test-utils/module',
  ],

  eslint: {
    config: {
      stylistic: true,
    },
    checker: true,
  },

  srcDir: 'src/',
  ssr: false,
  compatibilityDate: '2024-07-04',

  colorMode: {
    preference: 'light',
  },
})
