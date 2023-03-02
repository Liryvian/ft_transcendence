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
import { apiUrl } from '@/types/Constants';
import type { StatusUpdate, StatusList } from '@/types/Sockets';
import { useSocketStore } from './socketStore';

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
		// this should be moved out of the userStore
		// it is not userStore functionality
		// and it should be typed with something other than any..
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

		async login(loginType: string, loginForm?: LoginForm) {
			try {
				const user: User = (await postRequest('login', loginForm)).data;
				if (user.two_factor_required === true) {
					// go to 2fa
				}
				await this.refreshData();
				useSocketStore().initializeOnline();
				this.isLoggedIn = true;
				await router.push('/settings');
				this.errors.length = 0;
			} catch (e) {
				this.handleFormError(e.response.data);
			}
		},

		async logout() {
			try {
				await getRequest('logout');
				this.isLoggedIn = false;
				useSocketStore().deinitializeOnline();
				router.push({ name: 'login' });
				this.errors.length = 0;
			} catch (e) {
				this.handleFormError(e.response.data);
			}
		},

		async register(registerForm: RegisterForm) {
			try {
				await postRequest('users', registerForm);
				await this.refreshData();
				await router.push('/login');
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
				await router.push({
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
				const { data } = await getRequest(`me/${queryString}`);
				this.me = data;
			} catch (e) {
				console.error(e);
				return [];
			}
		},

		async refreshAllUsers() {
			try {
				const { data } = await getRequest('users');
				this.allUsers = data;
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
