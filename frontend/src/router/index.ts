import { useUserStore } from '@/stores/userStore';
import { getRequest } from '@/utils/apiRequests';
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
			component: () => import('../views/LoginView.vue'),
		},
		{
			path: '/settings',
			name: 'settings',
			component: () => import('../views/SettingsView.vue'),
		},
		{
			path: '/game',
			name: 'game',
			component: () => import('../views/GameView.vue'),
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
			path: '/component-test',
			name: 'component-test',
			component: () => import('../views/ComponentTest.vue'),
		},
	],
});

async function isLoggedIn() {
	try {
		let user = await useUserStore().me
		console.log("IsloggedIn; ", useUserStore().isLoggedIn)
		return true;
	}
	catch (e) {
		console.log("Fucked it")
		return false;
	}
}

router.beforeEach(async (to) => {
	const hasJWT =
		document.cookie
			.split(';')
			.find((cookie) => cookie.trim().startsWith('jwt=')) ?? false;
	await isLoggedIn()
	if (!hasJWT && to.name !== 'login') {
		return { name: 'login' };
	} else if (to.name === 'login' && hasJWT) {
		return { name: 'settings' };
	}
});

export default router;
