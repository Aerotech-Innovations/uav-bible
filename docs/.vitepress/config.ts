import { defineConfig } from 'vitepress'

export default defineConfig({
	title: 'UAV Bible',
	description: 'The definitive knowledge base for our UAV team',
	lang: 'en-US',

	// Assuming deployment to GitHub Pages at https://<org>.github.io/uav-bible/
	base: '/uav-bible/',

	themeConfig: {
		logo: '/logo.svg',
		siteTitle: 'UAV Bible',

		nav: [
			{ text: 'Guide', link: '/guide/getting-started' },
		],

		sidebar: {
			'/guide/': [
				{
					text: 'Introduction',
					items: [
						{ text: 'Getting Started', link: '/guide/getting-started' },
						{ text: 'Contributing', link: '/guide/contributing' },
					],
				},
			],
		},

		socialLinks: [
			{
				icon: 'github',
				link: 'https://github.com/Aerotech-Innovations/uav-bible',
			},
		],

		search: {
			provider: 'local',
		},

		editLink: {
			pattern:
				'https://github.com/Aerotech-Innovations/uav-bible/edit/main/docs/:path',
			text: 'Edit this page on GitHub',
		},

		footer: {
			message: 'Built with VitePress',
			copyright: 'UAV Team',
		},
	},

	markdown: {
		lineNumbers: true,
	},
});
