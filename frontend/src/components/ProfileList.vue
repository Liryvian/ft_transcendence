<template>
   <div class="table-responsive">
  <table class="table table-striped table-sm">
    <tbody>
    <tr v-for="user in allUsers" :key="user.id">
      <!--  view profile wil be replaced by <ViewProfile /> -->
      <td>
        <router-link to="/profile"> <img src="/favicon-32x32.png" alt="Avatar" class="avatar"></router-link>
      </td>
        <!-- <button v-on:click="viewProfile(user)"><img src="/favicon-32x32.png" alt="Avatar" class="avatar"></button></td>
      </router-link> -->
      <td>{{ user.id }}</td>
      <td>{{ user.name }} </td>
      
      <td> <button v-on:click="createChat(user)">Chat</button> </td>

      <td v-if="user.id === me.id || isBlocked(user.id)"><p class="grayedOut">Add friend</p></td>
      <td v-else-if="isFriend(user.id)"><button v-on:click="removeFriend(user.id)">Remove friend</button></td>
      <td v-else-if="!isFriend(user.id)"><button v-on:click="addFriend(user)">Add friend</button></td>


      <td v-if="isBlocked(user.id) || user.id == me.id"> <button v-on:click="unBlockUser(user)">Unblock</button> </td>
      <td v-else> <button v-on:click="blockUser(user)">Block</button> </td>

      <td></td>
    </tr>
    </tbody>
  </table>
</div>

  </template>

<script lang="ts">
import { defineComponent } from 'vue';
import { postRequest, getRequest, deleteRequest, patchRequest } from '../shared/apiRequests'
import  ProfileView_tmp  from '../views/ProfileView-tmp.vue'

type User = {
  name: string;
  id: number;
  relationships: any[];
}

type FriendRequest = {
  source_id: number;
  target_id: number;
  type: string;
}

interface DataObject {
  allUsers: User[],
  me: User
}

export default defineComponent({
  data(): DataObject {
    return {
      allUsers: <User[]>[],
      me: { id: 0, name: "", relationships: [] },
    };
  },
  name: 'ProfileList',
  components: {
    ProfileView_tmp,
  },

  methods: {
    viewProfile(user: User) {
      console.log(`Profile of ${user.name} clicked`);
    },
    createChat(user: User) {
      console.log(`Starting chat with ${user.name}`);
    },

    getExistingRelationship(id: number)
    {
      return this.me.relationships.filter((rel) => (rel.source_id.id === id || rel.target_id.id === id) &&
        (rel.target_id.id === this.me.id || rel.source_id.id === this.me.id))
    },

    async addFriend(user: User) {
      const friendRequest: FriendRequest = {
        source_id: this.me.id,
        target_id: user.id,
        type: "friend"
      }
      await postRequest("/user-relationships", friendRequest);
      console.log(`Adding ${user.name} as a friend`);
    },

    async blockUser(user: User) {
      const rel = this.getExistingRelationship(user.id);

      if (rel.length > 0)
      {
        await patchRequest(`user-relationships/${rel[0].id}`, { type: "blocked" });
        console.log("blocking: ", JSON.stringify(rel[0], null, 2));
        return;
      }

      const blockUser: FriendRequest = {
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

    async removeFriend(id: number) {
      const rel: any[] = this.getExistingRelationship(id);

      await deleteRequest(`user-relationships/${rel[0].id}`);
      console.log("removing: ", JSON.stringify(rel[0], null, 2));
    },

    isBlocked(id: number)
    {
      const rel: any[] = this.getExistingRelationship(id);
      if (rel.length > 0 && rel[0].type === 'blocked')
      {
        return true;
      }
      return false;
    }
  },
    created: async function () {
      const loginData = {
          name: "renoster",
            password: 'R'
      }
      await postRequest("login", loginData);
      const res = await getRequest("users")
      await getRequest("me").then(res => {
        this.me = res.data;
        console.log(this.me);
      })
      //  filter out ME user
      this.allUsers = res.data.filter((user: User) => (user.id != this.me.id))
    },
 })
</script>


 <style>
 .avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.grayedOut {
  color: grey;
}

button {
  all: unset;
  cursor: pointer;
}

button:focus {
  outline: blue 5px auto;
}
</style>

