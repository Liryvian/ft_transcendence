import router from '@/router';
import { ValidRelationships, type Relationship } from '@/types/Relationship';
import { getRequest, patchRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import type { User, LoginForm, RegisterForm } from "../types/User";

export const useUserStore = defineStore('users', {
	//  actions == data definitions
	state: () => ({
		allUsers: [] as User[],
		me: {} as User,
		errors: [],
	}),

  	// getters == computed values
	getters: {
	},
  	// actions == methods
  	actions: {
    	async login(loginForm: LoginForm) {
    	  try{
    	    await postRequest("login", loginForm);
    	    await this.refreshData();
    	    await router.push("/")
    	  }
    	  catch (e) {
    	    alert('Invalid user/password combination')
    	  }
	  },

		async register(registerForm: RegisterForm) {
			try {
				await postRequest('users', registerForm);
				await router.push('/login');
			} catch (e: any) {
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
				this.allUsers = data.data.filter((user: User) => (user.id !== this.me.id));
			} catch (e) {
				console.error(e);
				return [];
			}
		},

		async initializeRelationship(source: number, target: number) {
			const createRelationship = {
				source_id: source,
				target_id: target,
				type: "none"
			}
			return await (await postRequest("user-relationships/", createRelationship)).data;
		},

		async getRelationship(source: number, target: number) {
			const existingRel: Relationship = await (
				await getRequest(`user-relationships/${source}/${target}`)
			).data;

			if (!existingRel) {
				return this.initializeRelationship(source, target);
			}
			return existingRel
		},

		async refreshData() {
			await this.refreshMe();
			await this.refreshAllUsers();
		},

		isMatchingRelationship(userId: number, rel: Relationship): boolean {
			const myId: number = this.me.id;
			const sourceId: number = rel.source_id.id;
			const targetId: number = rel.target_id.id;

			return (targetId === myId || sourceId === myId) 
				&& (sourceId === userId || targetId === userId)
    	},
    
    	getExistingRelationship(userId: number) : Relationship | null
    	{
			for (let i = 0; i < this.me.relationships.length; i++) {
				const rel: Relationship = this.me.relationships[i]
				if (this.isMatchingRelationship(userId, rel)) {
					return rel;
				}
			}
			return null;
		},
	
    	async updateRelationship(userId: number, type: string) {
    	  const rel: Relationship = await this.getRelationship(userId, this.me.id);
    	  await patchRequest(`user-relationships/${rel.id}`, { type });
    	  await this.refreshData();
    	},
		
		getCurrentRelType(userId: number): string {
			const rel: Relationship | null = this.getExistingRelationship(userId);
			if (rel) {
				return rel.type;
			}
			return "none";
		},
			
		isFriend(type: string): boolean {
			return type === ValidRelationships.FRIEND;
    	},
		
		isBlocked(type: string): boolean {
			return type === ValidRelationships.BLOCKED;	
		},
	},
});
