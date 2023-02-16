<template>
	<div class="c_chat__conversation">
		<div
			v-if="focusTarget == 'c_chat--list'"
			@click="$emit('toggleFocusTarget', 'msg')"
			class="toggleHandler"
		></div>
		<ChatHeader />
		<div class="c_messagelist">
			messages
			<!-- <Message
				v-for="message in messageStore.getActiveMessages(chatId)"
				:message="message"
				:key="message.id"
			/> -->
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
import { type SingleMessage, type Chat_List_Item } from "@/types/Chat";

export default defineComponent({
	name: 'Chat',
	components: {
		Message,
	},
	props: {
		focusTarget: String,
		info: {
			type: Object as PropType<Chat_List_Item>,
			required: true,
		},
		chatId: {
			type: Number,
			required: true,
		},
	},
	setup() {
	},
	data() {
		return {
			messages: [
				{
					id: 0,
					content: "First message"
				},
				{
					id: 1,
					content: "second message"
				},
			] as SingleMessage[]
		}
	}
});
</script>
