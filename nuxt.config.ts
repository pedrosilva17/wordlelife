// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/fonts'],
	fonts: {
		families: [
			{ name: 'Inter', provider: 'google' },
			{ name: 'Oswald', provider: 'google' },
			{ name: 'Raleway', provider: 'google' }
		]
	},
	ui: {
		icons: ['mdi', 'simple-icons']
	}
});
