<template>
   <div class="table-responsive">
  <table class="table table-striped table-sm">
    <tbody>
    <tr v-for="user in allUsers" :key="user.id">
      <td><button v-on:click="viewProfile(user)"><img src="/favicon-32x32.png" alt="Avatar" class="avatar"></button></td>
      <td>{{ user.id }}</td>
      <td>{{ user.name }} </td>
      
      <td> <button v-on:click="createChat(user)">Chat</button> </td>

      <td v-if="user.id === me.id || isBlocked(user.id)"><p class="grayedOut">Add friend</p></td>
      <td v-else-if="isFriend(user.id)"><button v-on:click="removeFriend(user)">Remove friend</button></td>
      <td v-else-if="!isFriend(user.id)"><button v-on:click="addFriend(user)">Add friend</button></td>


      <td v-if="isBlocked(user.id)"> <p class="grayedOut">Block</p> </td>
      <td v-else> <button v-on:click="blockUser(user)">Block</button> </td>

      <td></td>
    </tr>
    </tbody>
  </table>
</div>

  </template>

<script lang="ts">
import { defineComponent } from 'vue';

type User = {
  name: string;
  id: number;
  relationships: any[];
}

interface DataObject {
  allUsers: User[],
  me: User,
  currentRelationship: string
}

export default defineComponent({
  data(): DataObject {
    return {
      allUsers: <User[]>[],
      me: { id: 0, name: "", relationships: [] },
      currentRelationship: "",
    };
  },
  name: 'ProfileList',
  computed:
  {

  }, 
  methods: {
    viewProfile(user: User) {
      console.log(`Profile of ${user.name} clicked`);
    },
    createChat(user: User) {
      console.log(`Starting chat with ${user.name}`);
    },
    addFriend(user: User) {
      console.log(`Adding ${user.name} as a friend`);
    },
    blockUser(user: User) {
      console.log(`Blocking ${user.name}`);
    },
     isFriend(id: number): boolean {
      return this.me.relationships.filter((rel) => (rel.source_id.id === id || rel.target_id.id === id) &&
        (rel.target_id.id === this.me.id || rel.source_id.id === this.me.id)).length > 0;
    },
    removeFriend(user: User) {
          console.log(`removing ${user.name}`)
    },
    isBlocked(id: number)
    {
      const rel: any[] = this.me.relationships.filter((rel) => (rel.source_id.id === id || rel.target_id.id === id) &&
        (rel.target_id.id === this.me.id || rel.source_id.id === this.me.id));
      if (rel.length > 0 && rel[0].type === 'blocked')
        return true;
      return false;
    }
  },
    created: async function () {
      const loginData = {
          name: "flamink",
            password: 'F'
          }
      const res = await this.axios.get("http://localhost:8080/api/users");
      await this.axios.get("http://localhost:8080/api/me").then(res => {
        this.me = res.data;
        console.log(this.me);
      })
      this.allUsers = res.data;
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

