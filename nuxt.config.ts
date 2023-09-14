// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	alias: {
		assets: '/<rootDir>/assets',
	},
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			title: '',
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
});
