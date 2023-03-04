<template>
	<Avatar
		:avatar="avatarString"
		:is-online="userStore.getOnlineStatus(userId)"
	/>
	<div>
		{{ userName }}
	</div>

	<div v-if="isOwner">
		<a href="#" v-on:click.prevent="updateChat(userId, channelId)">
			Kick
		</a>
	</div>
	<div v-else>
		<a href="#" class="grayedOut"> Kick </a>
	</div>

	<div v-if="isOwner">
		<a href="#" v-on:click.prevent="updateChat(userId, channelId)">
			Mute
		</a>
	</div>
	<div v-else>
		<a href="#" class="grayedOut"> Mute </a>
	</div>
	<div v-if="isOwner">
		<a href="#" v-on:click.prevent="updateChat(userId, channelId)"> Ban </a>
	</div>
	<div v-else>
		<a href="#" class="grayedOut"> Ban </a>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Avatar from '@/components/profileList/Avatar.vue';
import { useUserStore } from '@/stores/userStore';
import router from '@/router';
import { useChatStore } from '@/stores/chatStore';

export default defineComponent({
	name: 'ChannelMemberRow',
	props: {
		channelId: {
			type: Number,
			required: true,
		},
		userId: {
			type: Number,
			required: true,
		},
		userName: String,
		avatarString: String,
		isOwner: {
			type: Boolean,
			required: true,
		},
	},
	components: {
		Avatar,
	},
	setup() {
		const chatStore = useChatStore();
		const { updateChat } = chatStore;
		const userStore = useUserStore();
		userStore.refreshData();
		return {
			userStore,
			updateChat,
		};
	},
	methods: {
		async routeToProfile(userId: number) {
			await router.push({
				name: 'profile',
				params: { profile_id: userId },
			});
		},

		updateChat(userId: number, channelId: number) {},
	},
});
</script>
