<template>
   <div class="table-responsive">
  <table class="table table-striped table-sm">
    <tbody>
    <tr v-for="user in userStore.allUsers" :key="user.id">
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
      <td v-else-if="isFriend(user.id)"><button v-on:click="updateRelationship(user.id, 'none')">Remove friend</button></td>
      <td v-else-if="!isFriend(user.id)"><button v-on:click="updateRelationship(user.id, 'friend')">Add friend</button></td>


      <td v-if="isBlocked(user.id) || user.id == me.id"> <button v-on:click="updateRelationship(user.id, 'none')">Unblock</button> </td>
      <td v-else> <button v-on:click="updateRelationship(user.id, 'blocked')">Block</button> </td>

      <td></td>
    </tr>
    </tbody>
  </table>
</div>

</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent } from 'vue';
import ProfileView_tmp from '@/views/ProfileView-tmp.vue'
import type { User } from '@/types/User';

export default defineComponent({
  name: 'ProfileList',
  components: {
    ProfileView_tmp,
  },
  setup() {
    const userStore = useUserStore()
    const { login, refreshData, isBlocked, isFriend, updateRelationship, allUsers, me } = userStore;
    refreshData();

    return {
      userStore,
      login,
      refreshData,
      isBlocked,
      isFriend,
      updateRelationship,
      allUsers,
      me
    }
  },

  methods: {
    viewProfile(user: User) {
      console.log(`Profile of ${user.name} clicked`);
    },
    createChat(user: User) {
      console.log(`Starting chat with ${user.name}`);
    }
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

