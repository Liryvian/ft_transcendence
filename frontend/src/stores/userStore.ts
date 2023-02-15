import router from '@/router';
import { ValidRelationships, type Relationship } from '@/types/Relationship';
import { getRequest, patchRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import type { User, LoginForm, RegisterForm } from '../types/User';

export const useUserStore = defineStore('users', {
	//  actions == data definitions
	state: () => ({
		allUsers: [] as User[],
		me: {} as User,
		errors: [],
	}),

	// getters == computed values
	getters: {
		getAllUsers: (state) => state.allUsers,
		getMe: (state) => state.me,
	},
	// actions == methods
	actions: {
		async login(loginForm: LoginForm) {
			try {
				await postRequest('login', loginForm);
				await this.refreshData();
				await router.push('/');
			} catch (e) {
				alert('Invalid user/password combination');
			}
		},
		async register(registerForm: RegisterForm) {
			try {
				await postRequest('users', registerForm);
				await this.refreshData();
				await router.push('/login');
			} catch (e) {
				if (typeof e.response.data.message === 'string') {
					this.errors = [e.response.data.message];
				} else {
					this.errors = e.response.data.message.map((msg: String) =>
						msg.replace('(o) => o.', ''),
					);
				}
				return [];
			}
		},

		async refreshMe() {
			try {
				const data =  await getRequest('me');
				this.me = data.data;
			} catch (e) {
				console.error(e);
				return [];
			}
		},

		async refreshAllUsers() {
			try {
				const data = await getRequest('users');
				this.allUsers = data.data;
			} catch (e) {
				console.error(e);
				return [];
			}
		},

		async getRelationship(source: number, target: number) {
			return await (
				await getRequest(`user-relationships/${source}/${target}`)
			).data;
		},

		async refreshData() {
			await this.refreshMe();
			await this.refreshAllUsers();
		},

		isMatchingRelationship(userId: number, rel: Relationship): boolean {
			const myId: number = this.me.id;
			const sourceId: number = rel.source_id.id;
			const targetId: number = rel.target_id.id;

			return (
				(sourceId === userId || targetId === userId) &&
				(targetId === myId || sourceId === myId)
			);
		},

		getExistingRelationship(id: number): Relationship | null {
			this.me.relationships.forEach((rel: Relationship) => {
				if (this.isMatchingRelationship(id, rel)) return rel;
			});
			return null;
		},

		async updateRelationship(userId: number, type: string) {
			const rel: Relationship = await this.getRelationship(
				userId,
				this.me.id,
			);
			await patchRequest(`user-relationships/${rel.id}`, { type });
			this.refreshMe();
		},

		isFriend(id: number): boolean {
			const rel: Relationship | null = this.getExistingRelationship(id);
			return rel != null && rel.type === ValidRelationships.FRIEND;
		},

		isBlocked(id: number): boolean {
			const rel: Relationship | null = this.getExistingRelationship(id);
			return rel !== null && rel.type === ValidRelationships.BLOCKED;
		},
	},
});
