<template>
	<!-- Route to profile via avatar link -->
	<div v-if="!isBlocked(relationship.type)">
		<Avatar
			:avatar="user.avatar"
			:is-online="userStore.getOnlineStatus(user.id)"
			v-on:click="routeToProfile(user.id)"
		/>
	</div>
	<div v-else>
		<Avatar
			:avatar="user.avatar"
			:is-online="userStore.getOnlineStatus(user.id)"
			class="grayedOut"
		/>
	</div>

	<!-- Route to profile via username link -->
	<div v-if="!isBlocked(relationship.type)">
		<a href="#" v-on:click.prevent="routeToProfile(user.id)">{{
			user.name
		}}</a>
	</div>
	<div v-else>
		<a href="#" class="grayedOut">{{ user.name }}</a>
	</div>

	<!-- Route to chat -->
	<div v-if="!isBlocked(relationship.type)">
		<a href="#" v-on:click.prevent="routeToChat(user.id)">Chat</a>
	</div>
	<div v-else>
		<a href="#" class="grayedOut">Chat</a>
	</div>

	<!-- Update friend status -->
	<FriendInvite
		:userId="user.id"
		:isBlocked="isBlocked(relationship.type)"
		:isFriend="isFriend(relationship.type)"
	/>

	<!-- Update blocked status -->
	<BlockUser
		:userId="user.id"
		:isBlocked="isBlocked(relationship.type)"
		:relationship="relationship"
	/>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';
import HorizontalAvatarAndUserName from '@/components/user-info/HorizontalAvatarAndUserName.vue';
import type { User } from '@/types/User';
import { useRelationshipStore } from '@/stores/relationshipStore';
import Avatar from '@/components/profileList/Avatar.vue';
import FriendInvite from '@/components/profileList/FriendInvite.vue';
import BlockUser from '@/components/profileList/BlockUser.vue';
import router from '@/router';
import type { Relationship } from '@/types/Relationship';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
	name: 'ListRow',
	computed: {},
	created() {
		if (this.relationship.id > 0) {
			this.joinRoomOnConnect(this.relationship);
		}
	},

	setup() {
		const userStore = useUserStore();
		const relationshipStore = useRelationshipStore();
		const { isFriend, isBlocked, joinRoomOnConnect } = relationshipStore;
		return {
			userStore,
			isFriend,
			isBlocked,
			joinRoomOnConnect,
		};
	},

	components: {
		HorizontalAvatarAndUserName,
		Avatar,
		FriendInvite,
		BlockUser,
	},

	props: {
		user: {
			type: Object as PropType<User>,
			required: true,
		},
		online: Boolean,
		relationship: {
			type: Object as PropType<Relationship>,
			required: true,
		},
	},

	methods: {
		async routeToChat(userId: number) {
			console.log(`Starting chat with ${userId}`);
			await router.push({ name: 'chat', params: { profile_id: userId } });
		},
		async routeToProfile(userId: number) {
			await router.push({
				name: 'profile',
				params: { profile_id: userId },
			});
		},
	},
});
</script>
