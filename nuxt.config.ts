export default defineNuxtConfig({
	devtools: { enabled: true },
	typescript: {
		shim: false,
		typeCheck: true,
	},
	runtimeConfig: {
		cloud_name: process.env.CLOUD_NAME,
		cloud_api_key: process.env.CLOUD_API_KEY,
		cloud_secret: process.env.CLOUD_API_SECRET,
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
	modules: ['@nuxtjs/google-fonts', 'nuxt-icon', '@nuxt/image', '@nuxtjs/supabase'],
	image: {
		dir: 'public/',
		format: ['webp'],
		cloudinary: {
			baseURL: `https://res.cloudinary.com/${process.env.CLOUD_NAME}/image/upload/`,
		},
	},
	routeRules: {
		'/api/**': {
			cors: true,
		},
	},
	supabase: {
		redirect: false,
		cookieOptions: {
			maxAge: 86400,
		},
	},
	googleFonts: {
		families: {
			Inter: [400, 700],
		},
		display: 'swap',
		useStylesheet: true,
	},
	build: {
		transpile: ['gsap'],
	},
});
