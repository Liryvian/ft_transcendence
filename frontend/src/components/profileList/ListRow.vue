<template>
	<Avatar :avatar="user.avatar" :is-online="true" v-on:click="routeToProfile(user.id)"/>
	<a href="#" v-on:click.prevent="routeToProfile(user.id)">{{user.name}}</a>

	<a href="#" v-on:click.prevent="routeToChat(user.id)">Chat</a>

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
	name: 'ListRow',

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
		async routeToChat(userId: number) {
			console.log(`Starting chat with ${userId}`);
			await router.push({ name: 'chat', params: {id: userId} })
		},
		async routeToProfile(userId: number) {
			await router.push({name: 'profile', params: {id : userId}})
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
