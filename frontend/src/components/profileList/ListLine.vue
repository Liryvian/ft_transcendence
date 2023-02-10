<template>
	<Avatar :avatar="user.avatar" :is-online="true" v-on:click="routeToProfile(user.id)"/>

	<router-link :to="{name: 'profile', params: {id: user.id}}">{{ user.name }}</router-link>
	<a href="#" v-on:click.prevent="createChat(user)">Chat</a>
	<!-- <InitializeChat user.id> -->
	<FriendInvite :user-id="user.id"  />
	<BlockUser :user-id="user.id"  />
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import HorizontalAvatarAndUserName from '@/components/user-info/HorizontalAvatarAndUserName.vue';
import type { User } from '@/types/User';
import { useUserStore } from '@/stores/userStore';
import Avatar from '@/components/profileList/Avatar.vue'
import FriendInvite from '@/components/profileList/FriendInvite.vue'
import BlockUser from '@/components/profileList/BlockUser.vue'
import router from '@/router';

export default defineComponent({
	name: 'ListLine',

	setup() {
		const userStore = useUserStore();
		userStore.refreshData();

		return {
			userStore,
		};
	},

	components: {
		HorizontalAvatarAndUserName,
		Avatar,
		FriendInvite,
		BlockUser
	},

	props: {
		user: {
			type: Object as PropType<User>,
			required: true,
		},
		online: Boolean,
	},
	methods: {
		createChat(user: User) {
			console.log(`Starting chat with ${user.name}`);
		},
		async routeToProfile(id: number) {
			await router.push({name: 'profile', params: {id : id}})
		},
	},
});
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
</style>
