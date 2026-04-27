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
						{ text: 'UAV Basics', link: '/guide/uav-basic' },
						{ text: 'PX4 System Architecture', link: '/guide/px4-architecture' },
						{ text: 'Contributing', link: '/guide/contributing' },
					],
				},
				{
					text: 'Development',
					items: [
						{ text: 'PX4 SITL Setup', link: '/guide/px4-sitl-setup' },
						{ text: 'MAVLink 协议', link: '/guide/mavlink' },
					],
				},
				{
					text: 'Design',
					items: [
						{ text: 'Firefighting Prototype Requirement', link: '/guide/firefighting-prototype-requirement' },
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
