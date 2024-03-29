import router from '@/router';
import { getRequest, patchRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import type {
	User,
	LoginForm,
	RegisterForm,
	UpdateProfileForm,
} from '../types/User';
import { useStorage } from '@vueuse/core';
import type { StatusUpdate, StatusList } from '@/types/Sockets';
import { useSocketStore } from './socketStore';
import { useRelationshipStore } from './relationshipStore';
import { useGameStore } from './gameStore';

export const useUserStore = defineStore('users', {
	//  actions == data definitions
	state: () => ({
		allUsers: [] as User[],
		me: {} as User,
		onlineStatus: {} as StatusList,
		errors: [] as String[],
		// persists data accross refreshes
		isLoggedIn: useStorage('isLoggedIn', false, sessionStorage),
	}),

	// getters == computed values
	getters: {},
	// actions == methods
	actions: {
		handleFormError(responseData: any) {
			if (responseData.hasOwnProperty('message')) {
				if (typeof responseData.message === 'string') {
					this.errors.length = 0;
					this.errors.push(responseData.message);
				} else {
					this.errors = responseData.message.map((msg: String) =>
						msg.replace('(o) => o.', ''),
					);
				}
			} else {
				this.errors.length = 0;
			}
		},

		getOnlineStatus(userId: string | number) {
			return this.onlineStatus[userId] === true;
		},
		updateOnlineStatus(statusUpdate: StatusUpdate) {
			this.onlineStatus[statusUpdate.user_id] = statusUpdate.status;
		},
		initOnlineStatus(statusses: StatusUpdate[]) {
			statusses.forEach((statusUpdate) => {
				this.onlineStatus[statusUpdate.user_id] = statusUpdate.status;
			});
		},

		getUserById(id: number) {
			return this.allUsers.find((user) => user.id === id);
		},

		async login(loginForm?: LoginForm) {
			this.errors.length = 0;
			try {
				const user: User = (await postRequest('login', loginForm)).data;
				if (user.two_factor_required === true) {
					return '2fa';
				}
				this.finalizeLogin();
				return router.push({ name: 'settings' });
			} catch (e) {
				this.handleFormError(e.response.data);
			}
			return 'login';
		},

		async twoFaVerify(tokenData: { token: string }) {
			this.errors.length = 0;
			try {
				const result = (
					await postRequest('auth/2fa/validate', tokenData)
				).data;

				if (result === false) {
					this.errors.length = 0;
					this.errors.push('Invalid code, please try again');
					return;
				}
				this.finalizeLogin();
				return router.push({ name: 'settings' });
			} catch (e) {
				this.handleFormError(e.response.data);
			}
		},

		async finalizeLogin() {
			await this.refreshData();
			useSocketStore().initializeOnline();
			useUserStore().refreshMe();
			useGameStore().refreshAllGames();
			useRelationshipStore().initialize();
			this.isLoggedIn = true;
		},

		async logout() {
			try {
				this.errors.length = 0;
				this.isLoggedIn = false;
				useSocketStore().disconnect();
				await postRequest('logout', {});
				router.push({ name: 'login' });
			} catch (e) {}
		},

		async register(registerForm: RegisterForm) {
			try {
				await postRequest('users', registerForm);
				await this.refreshData();
				router.push({ name: 'login' });
				this.errors.length = 0;
			} catch (e) {
				this.handleFormError(e.response.data);
			}
		},

		async updateProfile(id: number, updateProfileForm: UpdateProfileForm) {
			try {
				if (updateProfileForm.new_password === '') {
					delete updateProfileForm.new_password;
					delete updateProfileForm.new_password_confirm;
					delete updateProfileForm.password;
				}
				await patchRequest(`users/${id}`, updateProfileForm);
				await this.refreshData();
				this.errors.length = 0;
				router.push({
					name: 'profile',
					params: { profile_id: id },
				});
			} catch (e: any) {
				this.handleFormError(e);
				return [];
			}
		},

		async refreshMe() {
			const queryString =
				'?relationshipSource=true\
								&relationshipTarget=true';
			try {
				this.me = await (await getRequest(`me/${queryString}`)).data;
			} catch (e) {
				console.error(e);
				return [];
			}
		},

		async refreshAllUsers() {
			try {
				this.allUsers = await (await getRequest('users')).data;
			} catch (e) {
				console.error(e);
				return [];
			}
		},

		async refreshData() {
			await this.refreshMe();
			await this.refreshAllUsers();
		},
	},
});
