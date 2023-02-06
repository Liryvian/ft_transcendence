import { ValidRelationships, type Relationship } from '@/types/Relationship';
import { getRequest, patchRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import type { User } from "../types/User";

export const useUserStore = defineStore("users", {

  //  actions == data definitions
  state: () => ({
      allUsers: <User[]>[],
      me: <User>{},
  }),
  // getters == computed values
  getters: {
  },
  // actions == methods
  actions: {
    async getMe() {
      await getRequest("me").then((res : any) => {
        this.me = res.data;
      })
    },

    async getAllUsers() {
      await getRequest("users").then((res: any) => {
        this.allUsers = res.data.filter((user: User) => (user.id != this.me.id));
      });
    },

    async getRelationship(source: number, target: number)
    {
      return await (await getRequest(`user-relationships/${source}/${target}`)).data
    },

    async refreshData() {
      await this.getMe();
      await this.getAllUsers();
    },

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
      const filtered = this.me.relationships.filter((rel: Relationship) => {
        this.isMatchingRelationship(id, rel);
      })

      return filtered.length > 0 ? filtered[0] : null;
    },

    async updateRelationship(userId: number, type: string) {
      const rel: Relationship = await this.getRelationship(userId, this.me.id);
      await patchRequest(`user-relationships/${rel.id}`, { type });
      this.refreshData();
    },

    isFriend(id: number): boolean {
       const rel: Relationship | null = this.getExistingRelationship(id);
        return (rel != null && rel.type === ValidRelationships.FRIEND);
    },

    isBlocked(id: number) : boolean
    {
      const rel: Relationship | null = this.getExistingRelationship(id);
      return (rel  != null && rel.type === ValidRelationships.BLOCKED)
    },
  }
})