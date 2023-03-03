<template>
	<div class="c_media c_media--clickable">
		<ChatProfileImages :chat="chat" />
		<div class="c_media__content">{{ chat.name }}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { Chat_List_Item } from '@/types/Chat';
import ChatProfileImages from '@/components/chat/ChatProfileImages.vue';

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
});
</script>

<style scoped></style>
