<template>
   <div class="table-responsive">
  <table class="table table-striped table-sm">
    <thead>
    <tr>
      <th>#</th>
      <th>Name</th>
      <!-- <th>Email</th> -->
      <!-- <th>Role</th> -->
      <!-- <th>Action</th> -->
    </tr>
    </thead>
    <tbody>
    <tr v-for="user in allUsers" :key="user.id">
      <td>{{ user.id }}</td>
      <td>{{ user.name }} </td>
      <td></td>
    </tr>
    </tbody>
  </table>
</div>

  </template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';

    export default {
    name: 'ProfileList',

    setup() {
        const allUsers = ref([]);
        
        onMounted(async () => {
            const { data } = await axios.get('http://localhost:8080/api/users');
            allUsers.value = data.data;
        });
        return allUsers;
    },
 }
</script>


  <style>
</style>

<!-- setup() {
    const users = ref([]);
    };
    onMounted(async () => {
      const {data} = await axios.get('users');
      users.value = data.data;
      }
    }
    return {
      users,
    }
  }
} -->