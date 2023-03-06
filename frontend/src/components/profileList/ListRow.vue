<template>
	<!-- Route to profile via avatar link -->
	<Avatar
		:isBlocked="isBlocked(relationship.type)"
		:userId="user.id"
		:avatar="user.avatar"
		:is-online="userStore.getOnlineStatus(user.id)"
	/>

	<!-- Route to profile via username link -->
	<div v-if="!isBlocked(relationship.type)">
		<RouterLink :to="{ name: 'profile', params: { profile_id: user.id }}">
			{{ user.name }}
		</RouterLink>
	</div>
	<div v-else>
		<span class="grayedOut">{{ user.name }}</span>
	</div>

	<!-- Route to chat -->
	<div v-if="!isBlocked(relationship.type)">
		<RouterLink :to="{ name: 'dm', params: { dmId: user.id }}">Chat</RouterLink>
	</div>
	<div v-else>
		<span class="grayedOut">Chat</span>
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
import type { Relationship } from '@/types/Relationship';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
	name: 'ListRow',

	setup(props) {
		const userStore = useUserStore();
		const relationshipStore = useRelationshipStore();
		relationshipStore.initialize();
		const { isFriend, isBlocked, joinRoomOnConnect, disconnectSocket } =
			relationshipStore;
		return {
			userStore,
			isFriend,
			isBlocked,
			joinRoomOnConnect,
			disconnectSocket,
		};
	},
	mounted() {
		// this.socke
		this.joinRoomOnConnect(this.relationship);
	},

	unmounted() {
		this.disconnectSocket();
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
});
</script>
