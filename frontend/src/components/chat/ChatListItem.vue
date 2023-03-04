<template>
	<div class="c_media c_media--clickable">
		<ChatProfileImages :chat="chat" />
		<div class="c_media__content">{{ chatName }}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { Chat_List_Item, Chat_Member } from '@/types/Chat';
import ChatProfileImages from '@/components/chat/ChatProfileImages.vue';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
	name: 'ChatListItem',
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
		otherUser(): Chat_Member {
			return this.chat.users.filter(
				(user) => user.id !== this.userStore.me.id,
			)[0];
		},
		chatName() {
			if (this.chat.type === 'channel') {
				return this.chat.name;
			}
			return this.otherUser.name ?? this.chat.name;
		}
	}
});
</script>

<style scoped></style>
