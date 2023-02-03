import { deleteRequest, getRequest, patchRequest, postRequest } from '@/shared/apiRequests'
import { defineStore } from 'pinia'
import type { User, RelationshipRequest } from "../types/User"

export const useUserStore = defineStore("users", {
  //  actions == data definitions
  state: () => ({
      allUsers: <User[]>[],
      me: <User>{},
  }),
  // getters == computed values
  getters: {
    // ...mapWritableState(useCounterStore, ['me'])
    // getExistingRelationship(id: number)
    // {
    //   return this.me.relationships.filter((rel) => (rel.source_id.id === id || rel.target_id.id === id) &&
    //     (rel.target_id.id === this.me.id || rel.source_id.id === this.me.id))
    // },
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

    async initData() {
      await getRequest("me").then(res => {
        this.me = res.data;
      })
      await getRequest("users").then(res => {
        this.allUsers = res.data.filter((user: User) => (user.id != this.me.id));
      });
    },

    getExistingRelationship(id: number)
    {
      return this.me.relationships.filter((rel) => (rel.source_id.id === id || rel.target_id.id === id) &&
        (rel.target_id.id === this.me.id || rel.source_id.id === this.me.id))
    },

    async addFriend(user: User) {
      const friendRequest: RelationshipRequest = {
        source_id: this.me.id,
        target_id: user.id,
        type: "friend"
      }
      await postRequest("/user-relationships", friendRequest);
      console.log(`Adding ${user.name} as a friend`);
    },

    async removeFriend(id: number) {
      const rel: any[] = this.getExistingRelationship(id);

      await deleteRequest(`user-relationships/${rel[0].id}`);
      console.log("removing: ", JSON.stringify(rel[0], null, 2));
    },

    async blockUser(user: User) {
      const rel = this.getExistingRelationship(user.id);

      if (rel.length > 0)
      {
        await patchRequest(`user-relationships/${rel[0].id}`, { type: "blocked" });
        console.log("blocking: ", JSON.stringify(rel[0], null, 2));
        return;
      }

      const blockUser: RelationshipRequest = {
        source_id: this.me.id,
        target_id: user.id,
        type: "blocked"
      }

      await postRequest("user-relationships", blockUser);
      console.log(`Blocking ${user.name}`);
    },

    async unBlockUser(user: User) {
      const rel = this.getExistingRelationship(user.id);
      if (rel.length > 0)
      {
        await patchRequest(`user-relationships/${rel[0].id}`, {type: "none"})
        console.log("blocking: ", JSON.stringify(rel[0], null, 2));
        return;
      }
      console.log(`Unblocking ${user.name}`);
    },

      isFriend(id: number): boolean {
      return this.getExistingRelationship(id).length > 0;
    },

    isBlocked(id: number)
    {
      const rel: any[] = this.getExistingRelationship(id);
      if (rel.length > 0 && rel[0].type === 'blocked')
      {
        return true;
      }
      return false;
    },

  }
})
