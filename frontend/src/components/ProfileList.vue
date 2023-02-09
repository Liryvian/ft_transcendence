<template>
  <div class="c_profileslist__table">
    <!-- start of "row" component -->
      <ListLine v-for="user in userStore.allUsers" :user="user"/>
    <!-- <div class="c_media">
      <a
        href="#"
        class="c_media__asset"
        :class="{
          'c_asset--online': true,
          'c_asset--offline': false,
        }"
      >
        <div class="c_asset__circle">
          <img src="profile_picture" alt="" />
        </div>
      </a>
    </div>
    <a href="#">username</a>
    <a href="#">Chat</a>
    <a href="#">Add Friend</a>
    <a href="#">Block</a>
    end of "row" component -->

    <!-- start of "row" component -->
    <!-- <div class="c_media">
      <a
        href="#"
        class="c_media__asset"
        :class="{
          'c_asset--online': true,
          'c_asset--offline': false,
        }"
      >
        <div class="c_asset__circle">
          <img src="profile_picture" alt="" />
        </div>
      </a>
    </div>
    <a href="#">very long username</a>
    <a href="#">Chat</a>
    <a href="#">Add Friend</a>
    <a href="#">Block</a> -->
    <!-- end of "row" component -->
  </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent } from 'vue';
import ProfileView_tmp from '@/views/ProfileView-tmp.vue'
import ListLine from '@/components/listLine.vue';
import type { User } from '@/types/User';

export default defineComponent({
  name: 'ProfileList',
  components: {
    ProfileView_tmp,
    ListLine
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

