<template>
	<Avatar :avatar="user.avatar" :is-online="true"/>

	<a href="#">{{user.name}}</a>
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
