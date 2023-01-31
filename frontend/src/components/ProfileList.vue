<template>
   <div class="table-responsive">
  <table class="table table-striped table-sm">
    <tbody>
    <tr v-for="user in allUsers" :key="user.id">
      <td><button v-on:click="viewProfile(user)"><img src="/favicon-32x32.png" alt="Avatar" class="avatar"></button></td>
      <td>{{ user.id }}</td>
      <td>{{ user.name }} </td>
      <td> <button v-on:click="createChat(user)">Chat</button> </td>
      <td> <button v-on:click="addFriend(user)">Add as friend</button> </td>
      <td> <button v-on:click="blockUser(user)">Block</button> </td>
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
}

  export default defineComponent({
    data() {
      return {allUsers: <User[]>[]};
    },
    name: 'ProfileList',
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
    },
    created: async function() {
      const res = await this.axios.get("http://localhost:8080/api/users");
      this.allUsers = res.data;
    }
 })
</script>


 <style>
 .avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

button {
  all: unset;
  cursor: pointer;
}

button:focus {
  outline: blue 5px auto;
}
</style>

