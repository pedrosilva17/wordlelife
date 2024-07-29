// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-07-23',
	devtools: { enabled: true },
	css: ['~/assets/css/main.css'],
	modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxt/fonts', '@nuxt/image'],
	fonts: {
		families: [
			{ name: 'Inter', provider: 'google' },
			{ name: 'Oswald', provider: 'google' },
			{ name: 'Raleway', provider: 'google' }
		]
	},
	ui: {
		icons: ['mdi']
	}
});
