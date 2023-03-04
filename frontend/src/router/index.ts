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
			component: () => import('../views/ChatView.vue'),
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
			name: 'activeGames',

			component: () => import('../views/GameView.vue'),
			props: true,
		},
		{
			path: '/chat',
			children: [
				{
					name: 'chat',
					path: "/chat/:currentChat?",
					props: true,
					component: () => import('../views/ChatView.vue'),
				},
				{
					name: "chat-members",
					path: "/chat/members/:chatID",
					props: true,
					component: () => import('@/views/ChatMembersView.vue')
				}
			]
		},
		{
			path: '/pong/:currentGame?',
			name: 'pong',
			props: true,
			component: () => import('../components/pongGame/pongGame.vue'),
		},
		{
			path: '/profiles',
			children: [
				{
					path: '',
					name: 'profiles',
					component: () => import('../views/ProfilesView.vue'),
				},
				{
					path: ':profile_id?',
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
			path: '/game-invite',
			name: 'game-invite',
			component: () => import('../views/GameInvite.vue'),
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

	if (!isLoggedIn && to.name !== 'login' && to.name !== 'register') {
		return { name: 'login' };
	} else if ((to.name === 'login' || to.name === 'register') && isLoggedIn) {
		return { name: 'home' };
	}
});

export default router;
