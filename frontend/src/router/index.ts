import { useUserStore } from '@/stores/userStore';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			component: () => import('../views/SettingsView.vue'),
		},
		{
			path: '/settings',
			children: [
				{
					path: '/settings',
					name: 'settings',
					component: () => import('../views/SettingsView.vue'),
				},
				{
					path: 'turn-on-2fa',
					name: 'turn-on-2fa',
					component: () => import('../views/Settings2fa.vue'),
				},
			],
		},
		{
			path: '/active-games',
			children: [
				{
					path: '',
					name: 'activeGames',
					component: () => import('../views/GameView.vue'),
					props: true,
				},
				{
					path: '/pong/:currentGameId',
					name: 'pong',
					props: true,
					component: () =>
						import('../components/pongGame/pongGame.vue'),
				},
			],
		},
		{
			path: '/chat',
			children: [
				{
					path: '',
					name: 'chat',
					component: () => import('../views/ChatView.vue'),
				},
				{
					path: 'dm/:dmId',
					name: 'dm',
					props: true,
					component: () => import('../views/ChatView.vue'),
				},
				{
					path: 'channel/:channelId',
					props: true,
					children: [
						{
							path: '',
							name: 'channel',
							props: true,
							component: () => import('../views/ChatView.vue'),
						},
						{
							name: 'channelMembers',
							path: 'members',
							props: true,
							component: () =>
								import('@/views/ChannelMembersView.vue'),
						},
					],
				},
			],
		},
		// {
		// 	path: '/pong/:currentGameId',
		// 	name: 'pong',
		// 	props: true,
		// 	component: () => import('../components/pongGame/pongGame.vue'),
		// },
		{
			path: '/profiles',
			children: [
				{
					path: '',
					name: 'profiles',
					component: () => import('../views/ProfilesView.vue'),
				},
				{
					path: ':profile_id',
					name: 'profile',
					component: () => import('../views/ProfileView.vue'),
					props: true,
				},
			],
		},
		{
			path: '/logout',
			name: 'logout',
			component: () => import('../views/LogoutView.vue'),
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('../views/LoginView.vue'),
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('../views/RegisterView.vue'),
		},
		{
			path: '/match-history',
			name: 'match-history',
			component: () => import('../views/MatchHistoryView.vue'),
		},
		{
			path: '/new-channel',
			name: 'new-channel',
			component: () => import('../views/NewChannelView.vue'),
		},
		{
			path: '/matchmaking',
			name: 'matchmaking',
			component: () => import('../views/MatchMaking.vue'),
		},
		{
			path: '/elements-to-reuse',
			name: 'elements-to-reuse',
			component: () => import('../views/ElementsToReuse.vue'),
		},
		{
			path: '/request-game/:profile_id?/:chat_id?',
			name: 'request-game',
			component: () => import('../views/RequestGame.vue'),
			props: true,
		},
		{
			path: '/intra/:next',
			name: 'intra',
			props: true,
			component: () => import('../views/SetIntraLogggedIn.vue'),
		},
		{
			path: '/game-rules',
			name: 'game-rules',
			props: true,
			component: () => import('../views/GameRules.vue'),
		},
		{
			path: '/component-test',
			name: 'component-test',
			component: () => import('../views/ComponentTest.vue'),
		},
	],
});

router.beforeEach(async (to) => {
	const isLoggedIn: boolean = useUserStore().isLoggedIn;

	if (
		!isLoggedIn &&
		to.name !== 'login' &&
		to.name !== 'register' &&
		to.name !== 'intra'
	) {
		return { name: 'login' };
	} else if (
		(to.name === 'login' ||
			to.name === 'register' ||
			to.name === 'intra') &&
		isLoggedIn
	) {
		return { name: 'home' };
	}
});

export default router;
