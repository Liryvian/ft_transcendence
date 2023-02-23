<template>
	<div class="c_chat__conversation">
		<div
			v-if="focusTarget == 'c_chat--list'"
			@click="$emit('toggleFocusTarget', 'msg')"
			class="toggleHandler"
		></div>
		<ChatHeader :chat="info" />
		<div class="c_messagelist">
			<Message
				v-for="message in activeChatMessages"
				:message="message"
				:key="message.id"
			/>
		</div>
		<form @submit.prevent="postNewMessage()" class="c_send_message">
			<textarea
				name="new_message"
				id="new_message"
				placeholder="type..."
				v-model="new_message"
				:disabled="is_sending"
				@keypress.enter.exact.prevent="postNewMessage()"
			></textarea>
			<input type="submit" value="enter" />
		</form>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

import Message from './Message.vue';
import ChatHeader from './ChatHeader.vue';
import { useMessageStore } from '@/stores/messageStore';
import { useUserStore } from '@/stores/userStore';
import type { Chat_List_Item, SingleMessage, NewMessage } from '@/types/Chat';
import { postRequest } from '@/utils/apiRequests';
import { storeToRefs } from 'pinia';

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
		const userStore = useUserStore();
		const { messages } = storeToRefs(messageStore);

		return {
			messageStore,
			userStore,
			messages,
		};
	},
	beforeMount() {},
	computed: {
		activeChatMessages(): SingleMessage[] {
			if (!this.messages[this.info.id]) {
				this.messageStore.getActiveChatMessages(this.info.id);
				return [];
			}
			return this.messages[this.info.id];
		},
	},
	methods: {
		async postNewMessage() {
			if (this.is_sending) return;
			if (this.new_message.length === 0) return;

			// set field to disabled
			this.is_sending = true;
			const newMessage: NewMessage = {
				sender_id: this.userStore.getMe.id,
				chat: this.info.id,
				content: this.new_message,
			};
			try {
				const response = await postRequest('messages', newMessage);
				if (response.status >= 200 && response.status < 300) {
					this.new_message = '';
				}
				this.is_sending = false;
			} catch (e) {
				console.error(e);
				this.is_sending = false;
			}
		},
	},
	data() {
		return {
			new_message: '',
			is_sending: false,
		};
	},
});
</script>
