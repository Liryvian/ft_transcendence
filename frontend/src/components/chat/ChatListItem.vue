<template>
	<div class="c_media c_media--clickable">
		<div class="c_media__asset" :class="is_online">
			<ChatProfileImages :chat="chat" />
		</div>
		<div class="c_media__content">{{ chat.name }}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { Chat_List_Item, Chat_Member } from '@/types/Chat';
import ChatProfileImages from '@/components/chat/ChatProfileImages.vue'

export default defineComponent({
	name: 'ChatListItem',
	components: {
		ChatProfileImages
	},
	props: {
		chat: {
			type: Object as PropType<Chat_List_Item>,
			required: true,
		},
	},
	setup() {
	},
	computed: {
		is_online(): String {
			if (this.chat.type === 'dm') {
				// here logic to check if other user in dm is online or not
				return 'c_asset--online';
			}
			return 'c_asset--multi';
		},
	},
});
</script>

<style scoped></style>
