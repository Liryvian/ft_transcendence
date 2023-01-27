<template>
    <div class="item">
        SometText on the page!
    </div>
  </template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';

    export default {
    name: 'ProfileList',

    // setup() {
    //     const allUsers = ref([]);
    // },



    // onMounted( async () => {
    //     const {data} = await axios.get('http://loaclhost:8080/api/users');
    //     allUsers.value = data.data;
    // }),
    

                  
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