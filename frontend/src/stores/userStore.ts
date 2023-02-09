import router from '@/router';
import { ValidRelationships, type Relationship } from '@/types/Relationship';
import { getRequest, patchRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import type { LoginForm, RegisterForm, User } from '../types/User';

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
    getMe: (state) => state.me
  },
  // actions == methods
  actions: {
    async login(loginForm: LoginForm) {
      await postRequest("login", loginForm);
      await this.refreshMe();
      await router.push("/")
    },
		async register(registerForm: RegisterForm) {
			try {
				await postRequest('users', registerForm);
				await router.push('/settings');
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
				const data = await getRequest('me');
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

      		console.log("MyID: ", myId, "\nuserId", userId, "\nsourceid:", sourceId, "\ntargetid:", targetId)
      		console.log("returning: ", (sourceId === userId || targetId === userId) &&
      		(targetId === myId || sourceId === myId))
      		return (sourceId === userId || targetId === userId) &&
      		(targetId === myId || sourceId === myId)
    	},
    
    	// getExistingRelationship(id: number): Relationship | null
    	// {
    	//   this.me.relationships.forEach((rel: Relationship) => {
    	//     if (this.isMatchingRelationship(id, rel) === true) {
    	//       console.log("MatchFound: ", rel);
    	//         return rel;
    	//       }
    	//   })
    	//   return null;
    	// },
		
    	getExistingRelationship(id: number) : Relationship | null
    	{
    	  const filtered = this.me.relationships.filter((rel) => (rel.source_id.id === id || rel.target_id.id === id) &&
    	    (rel.target_id.id === this.me.id || rel.source_id.id === this.me.id));
    	    return (filtered.length > 0 ? filtered[0] : null)
    	},
	
    	async updateRelationship(userId: number, type: string) {
    	  console.log("userID: ", userId, "\nMe: ", this.me.id);
    	  const rel: Relationship = await this.getRelationship(userId, this.me.id);
    	  console.log("relationship to update: ", rel);
    	  await patchRequest(`user-relationships/${rel.id}`, { type });
    	  await this.refreshData();
    	},
	
    	isFriend(id: number): boolean {
    	  const rel: Relationship | null = this.getExistingRelationship(id);
    	  console.log("Found rel: ", rel)
    	  console.log("Is friend: ", (rel != null && rel.type === ValidRelationships.FRIEND))
    	    return (rel != null && rel.type === ValidRelationships.FRIEND);
    	},
	
		// isFriend(id: number): boolean {
		// 	const rel: Relationship | null = this.getExistingRelationship(id);
		// 	return rel != null && rel.type === ValidRelationships.FRIEND;
		// },
	
		isBlocked(id: number): boolean {
			const rel: Relationship | null = this.getExistingRelationship(id);
			return rel !== null && rel.type === ValidRelationships.BLOCKED;
		},
	},
});
