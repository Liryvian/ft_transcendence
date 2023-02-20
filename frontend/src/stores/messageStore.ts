import { defineStore } from 'pinia';
import type { SingleMessage, UpdateMessage } from '@/types/Chat';
import { getRequest } from '@/utils/apiRequests';

type ChatId = number;
type MessageList = Record<ChatId, SingleMessage[]>;

export const useMessageStore = defineStore('messages', {
	state: () => ({
		messages: {} as MessageList,
	}),
	getters: {},
	actions: {
		getActiveChatMessages(chatId: ChatId) {
			if (!this.messages[chatId]) {
				// fetch messages for chat
				// make sure user is subscribed to socket
				getRequest(`chats/${chatId}/messages`).then((data) => {
					this.messages[chatId] = data.data.sort(
						(a: SingleMessage, b: SingleMessage) =>
							a.created_at.valueOf() - b.created_at.valueOf(),
					);
				});
			}
			return this.messages[chatId];
		},

		// should be typed
		socketAction(update: UpdateMessage<SingleMessage>) {
			// if chat is does not exist, fuck it and ignore
			if (!this.messages[update.data.chat_id]) {
				console.log('Chat does not exist, no update needed');
				return;
			}
			// temp store timestamp of last message
			const prev_timestamp = this.messages[update.data.chat_id]
				.slice(-1)[0]
				.created_at.valueOf();

			// append new message to the end
			this.messages[update.data.chat_id].push(update.data);

			// check if we need to sort
			if (update.data.created_at.valueOf() < prev_timestamp) {
				// sort if needed
				this.messages[update.data.chat_id].sort(
					(a: SingleMessage, b: SingleMessage) =>
						a.created_at.valueOf() - b.created_at.valueOf(),
				);
			}
		},
	},
});
