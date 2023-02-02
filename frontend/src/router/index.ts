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
			path: '/profile',
			name: 'profile',
			component: () => import('../views/ProfileView-tmp.vue'),
		},
		{
			path: '/logout',
			name: 'logout',
			component: () => import('../views/LogoutView.vue'),
		},
	],
});

export default router;
