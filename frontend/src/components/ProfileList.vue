<template>
   <div class="table-responsive">
  <table class="table table-striped table-sm">
    <tbody>
    <tr v-for="user in allUsers" :key="user.id">
      <td><img src="../../public/favicon-32x32.png" alt="Avatar" class="avatar"></td>
      <td>{{ user.id }}</td>
      <td>{{ user.name }} </td>
      <td> <button>Chat</button> </td>
      <td> <button>Add as friend</button> </td>
      <td> <button>Block</button> </td>
      <td></td>
    </tr>
    </tbody>
  </table>
</div>

  </template>

<script lang="ts">
import { onMounted } from 'vue';
import { defineComponent } from "vue";

type User = {
  name: string;
  id: number;
}
const defautAvatar: string = '../../public/favicon-32x32.png';

let allUsers: User[] = [];
  export default defineComponent({
    name: 'ProfileList',
    data(){
      return {allUsers};
    },
    async mounted()
    {
      const response = await fetch('http://localhost:8080/api/users');
          allUsers = await response.json();
          allUsers.sort((a: User, b: User) => a.id - b.id)
          return {allUsers};
    }, 
    // setup() {
        
    //     onMounted(async () => {
    //       const response = await fetch('http://localhost:8080/api/users');
    //       allUsers = await response.json();
    //       allUsers.sort((a: User, b: User) => a.id - b.id)
    //       // allUsers.forEach(user => {
    //       //   if (!user.avatar) {
    //       //     user.avatar = defautAvatar;
    //       //   }
    //       // })
    //     }
    //     );
    //     return {allUsers};
    //   },
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

