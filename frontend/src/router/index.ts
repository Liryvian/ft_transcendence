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
			name: 'settings',
			component: () => import('../views/SettingsView.vue'),
		},
		{
			path: '/game/:currentGame?',
			name: 'game',
			component: () => import('../views/GameView.vue'),
			props: true,
		},
		{
			path: '/chat/:currentChat?',
			name: 'chat',
			props: true,
			component: () => import('../views/ChatView.vue'),
		},
		{
			path: '/profiles',
			name: 'profiles',
			component: () => import('../views/ProfilesView.vue'),
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
			path: '/channel-settings',
			name: 'channel-settings',
			component: () => import('../views/ChannelSettingsView.vue'),
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
			path: '/profile/:profile_id?',
			name: 'profile',
			component: () => import('../views/ProfileView.vue'),
			props: true,
		},
		{
			path: '/elements-to-reuse',
			name: 'elements-to-reuse',
			component: () => import('../views/ElementsToReuse.vue'),
		},
		{
			path: '/register',
			name: 'register',
			component: () => import('../views/RegisterView.vue'),
		},
		{
			path: '/request-game/:profile_id?',
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
	console.log('isLogged in router?: ', isLoggedIn);
	console.log('Path: ', to.name);
	if (!isLoggedIn && to.name !== 'login' && to.name !== 'register') {
		return { name: 'login' };
	} else if ((to.name === 'login' || to.name === 'register') && isLoggedIn) {
		return { name: 'home' };
	}
});

export default router;
