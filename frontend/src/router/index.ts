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
			path: '/settings',     // !! minor thing, but maybe change this name back to "me" or "profile settings"? since we do have channel settings and settings are a bit off in the menu?
			name: 'settings',
			component: () => import('../views/SettingsView.vue'),
		},
		{
			path: '/game',
			name: 'game',
			component: () => import('../views/GameView.vue'),
		},
		{
			path: '/chat',
			name: 'chat',
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
			path: '/profile',
			name: 'profile',
			component: () => import('../views/ProfileView.vue'),
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

export default router;
