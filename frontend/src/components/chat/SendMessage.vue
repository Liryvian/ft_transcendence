<template>
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
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import type { NewMessage } from '@/types/Chat';
import { useUserStore } from '@/stores/userStore';
import { postRequest } from '@/utils/apiRequests';

export default defineComponent({
	name: 'SendMessage',
	props: {
		chatId: {
			type: Number,
			required: true,
		},
	},
	setup() {
		const userStore = useUserStore();
		const me = userStore.me;

		return {
			me,
		};
	},
	methods: {
		async postNewMessage() {
			if (this.is_sending) return;
			if (this.new_message.length === 0) return;

			// set field to disabled
			this.is_sending = true;
			const newMessage: NewMessage = {
				sender_id: this.me.id,
				chat: this.chatId,
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
