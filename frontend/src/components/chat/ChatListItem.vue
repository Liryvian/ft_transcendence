<template>
	<RouterLink :to="to">
		<div class="c_media c_media--clickable">
			<ChatProfileImages :chat="chat" />
			<div class="c_media__content">{{ chat.name }}</div>
		</div>
	</RouterLink>
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
		to() {
			if (this.chat.type === 'channel') {
				return { name: 'channel', params: { channelId: this.chat.id }}
			}
			return { name: 'dm', params: { dmId: this.otherUser.id }}
		}
	}
});
</script>

<style scoped></style>
