<template>
	<div class="c_conversation__header">
		<div v-if="canInviteForAGame()">invite for a game</div>
		<div v-if="canLeaveChannel()">
			<button class="link_button" @click.prevent="leaveChannel()">
				leave channel
			</button>
		</div>
		<div>
			<RouterLink
				:to="to"
				class="c_media c_media--assetright c_media--clickable"
			>
				<div class="c_media__asset" :class="is_online">
					<ChatProfileImages :chat="chat" />
				</div>
				<div class="c_media__content">{{ chatName }}</div>
			</RouterLink>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import {
	permissionsEnum,
	type Chat_List_Item,
	type Chat_Member,
} from '@/types/Chat';
import ChatProfileImages from '@/components/chat/ChatProfileImages.vue';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
	name: 'ChatHeader',
	components: {
		ChatProfileImages,
	},
	props: {
		chat: {
			type: Object as PropType<Chat_List_Item>,
			required: true,
		},
	},
	setup() {
		const userStore = useUserStore();

		return {
			userStore,
		};
	},
	computed: {
		to() {
			if (this.chat.type === 'dm') {
				return {
					name: 'profile',
					params: { profile_id: this.otherUser.id },
				};
			}
			return {
				name: 'channelMembers',
				params: { channelId: this.chat.id },
			};
		},
		otherUser(): Chat_Member {
			return this.chat.users.filter(
				(user) => user.id !== this.userStore.me.id,
			)[0];
		},
		is_online(): String {
			if (this.chat.type === 'dm') {
				if (this.userStore.getOnlineStatus(this.otherUser.id)) {
					return 'c_asset--online';
				}
				return 'c_asset--offline';
			}
			return 'c_asset--multi';
		},
		chatName() {
			if (this.chat.type === 'channel') {
				return this.chat.name;
			}
			return this.otherUser.name ?? this.chat.name;
		},
	},
	methods: {
		canInviteForAGame() {
			// logic here to check if there is not already a game going on between the two users
			return this.chat.type === 'dm';
		},
		canLeaveChannel() {
			if (this.chat.type === 'dm') {
				return false;
			}
			const me = this.chat.users.find(
				(user) => user.id === this.userStore.me.id,
			);
			if (me?.permissions.find((p) => p === permissionsEnum.OWNER)) {
				return false;
			}
			return true;
		},
		leaveChannel() {},
	},
});
</script>
