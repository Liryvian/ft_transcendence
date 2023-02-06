import { getRequest, patchRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import type { User } from "../types/User";

enum RelationshipTypes {
  FRIEND,
  BLOCKED,
  NONE
}

interface Relationship {
  id: number;
  type: string;
  source_id: User;
  target_id: User;
}

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
    async login() {
      const loginData = {
        name: "renoster",
          password: 'R'
        }
        await postRequest ("login", loginData);
    },

    async getRelationship(source: number, target: number)
    {
      return await (await getRequest(`user-relationships/${source}/${target}`)).data
    },

    async initData() {
      await getRequest("me").then((res : any) => {
        this.me = res.data;
      })
      await getRequest("users").then((res: any) => {
        this.allUsers = res.data.filter((user: User) => (user.id != this.me.id));
      });
    },

    getExistingRelationship(id: number)
    {
      return this.me.relationships.filter((rel: Relationship) => (rel.source_id.id === id || rel.target_id.id === id) &&
        (rel.target_id.id === this.me.id || rel.source_id.id === this.me.id))
    },

    async updateRelationship(userId: number, type: string) {
      const rel: Relationship = await this.getRelationship(userId, this.me.id);
      await patchRequest(`user-relationships/${rel.id}`, { type });
      this.initData();
    },

    isFriend(id: number): boolean {
       const rel: any[] = this.getExistingRelationship(id);
        return (rel.length > 0 && rel[0].type === 'friend');
    },

    isBlocked(id: number)
    {
      const rel: any[] = this.getExistingRelationship(id);
      return (rel.length > 0 && rel[0].type === 'blocked')
    },

  }
})