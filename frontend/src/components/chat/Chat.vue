<template>
	<div class="c_chat__conversation">
		<div
			v-if="focusTarget == 'c_chat--list'"
			@click="$emit('toggleFocusTarget', 'msg')"
			class="toggleHandler"
		></div>
		<ChatHeader :chat="info"  />
		<div class="c_messagelist">
			<Message
				v-for="message in activeChatMessages"
				:message="message"
				:key="message.id"
			/>
		</div>
		<div class="c_send_message">
			<textarea
				name="new_message"
				id="new_message"
				placeholder="type..."
			></textarea>
			<input type="submit" value="enter" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

import Message from './Message.vue';
import ChatHeader from './ChatHeader.vue';
import { useMessageStore } from '@/stores/messageStore';
import type { Chat_List_Item } from "@/types/Chat";

export default defineComponent({
	name: 'Chat',
	components: {
		Message,
		ChatHeader,
	},
	props: {
		focusTarget: String,
		info: {
			type: Object as PropType<Chat_List_Item>,
			required: true,
		},
	},
	setup() {
		const messageStore = useMessageStore();

		return {
			messageStore
		}
	},
	computed: {
		activeChatMessages() {
			return this.messageStore.getActiveChatMessages(this.info.id);
		}
	}
});
</script>
