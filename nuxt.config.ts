export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: ['nuxt-icon'],
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
			title: 'Razmik Matinyan • Developer | razmatinyan.com',
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
				// {
				// 	hid: "og:image",
				// 	property: "og:image",
				// 	content: ""
				// },
				// {
				// 	hid: "og:site_name",
				// 	property: "og:site_name",
				// 	content: ""
				// },
				// {
				// 	hid: "og:type",
				// 	property: "og:type",
				// 	content: "website"
				// },
				// {
				// 	name: "google-site-verification",
				// 	content: ""
				// },
			],
			link: [{ rel: 'icon', type: 'image/x-icon', href: '' }],
		},
	},
	css: ['~/assets/fonts.css', '~/assets/main.css'],
});
