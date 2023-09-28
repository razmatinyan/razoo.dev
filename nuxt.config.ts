export default defineNuxtConfig({
	devtools: { enabled: true },
	runtimeConfig: {
		public: {
			DOMAIN: process.env.DOMAIN ?? 'https://127.0.0.1:3000/',
		},
	},
	alias: {
		assets: '/<rootDir>/assets',
	},
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			title: 'Razmik Matinyan • Web Developer | razoo.dev',
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1.0',
			meta: [
				{
					name: 'description',
					content: '',
				},
				{
					name: 'keywords',
					content: '',
				},
			],
			link: [{ rel: 'icon', type: 'image/x-icon', href: '' }],
		},
	},
	css: ['~/assets/fonts.css', '~/assets/main.css'],
	modules: ['nuxt-icon', '@nuxt/image', '@nuxtjs/supabase'],
	image: {
		dir: 'public/images',
	},
	supabase: {
		redirect: false,
	},
});
