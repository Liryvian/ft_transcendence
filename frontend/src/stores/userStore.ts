import { ValidRelationships, type Relationship } from '@/types/Relationship';
import { getRequest, patchRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import type { User } from "../types/User";

export const useUserStore = defineStore("users", {

  //  actions == data definitions
  state: () => ({
      allUsers: [] as User[],
      me: {} as User,
  }),
  // getters == computed values
  getters: {
    getAllUsers: (state) => state.allUsers,
    getMe: (state) => state.me
  },
  // actions == methods
  actions: {
    async login() {
      const loginData = {
        name: "renoster",
          password: 'R'
        }
        await postRequest("login", loginData);
    },

    async refreshMe() {
      try {
        const data = await getRequest("me");
        this.me = data.data;
      }
      catch (e) {
        console.error(e);
      }
    },

    async refreshAllUsers() {
      try {
        const data = await getRequest("users");
        this.allUsers = data.data;
      }
      catch (e) {
        console.error(e);
      }
    },

    async getRelationship(source: number, target: number)
    {
      return await (await getRequest(`user-relationships/${source}/${target}`)).data
    },

    async refreshData() {
      await this.refreshMe();
      await this.refreshAllUsers();
    },
// wanna use this helper to filter me.relationships, but
    isMatchingRelationship(userId: number, rel: Relationship): boolean
    {
      const myId: number = this.me.id;
      const sourceId: number = rel.source_id.id;
      const targetId: number = rel.target_id.id;

      return (sourceId === userId || targetId === userId) &&
      (targetId === myId || sourceId === myId)
    },
    
    getExistingRelationship(id: number): Relationship | null
    {
      this.me.relationships.forEach((rel: Relationship) => {
        if (this.isMatchingRelationship(id, rel))
          return rel;
      })
      return null;
    },

    async updateRelationship(userId: number, type: string) {
      const rel: Relationship = await this.getRelationship(userId, this.me.id);
      await patchRequest(`user-relationships/${rel.id}`, { type });
      this.refreshMe();
    },

    isFriend(id: number): boolean {
       const rel: Relationship | null = this.getExistingRelationship(id);
        return (rel != null && rel.type === ValidRelationships.FRIEND);
    },

    isBlocked(id: number) : boolean
    {
      const rel: Relationship | null = this.getExistingRelationship(id);
      return (rel !== null && rel.type === ValidRelationships.BLOCKED)
    },
  }
})
