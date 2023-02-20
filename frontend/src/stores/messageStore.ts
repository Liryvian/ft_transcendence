import { defineStore } from 'pinia';
import type { SingleMessage } from '@/types/Chat';
import { getRequest } from '@/utils/apiRequests';

type ChatId = number;
type MessageList = Record<ChatId, SingleMessage[]>;

export const useChatStore = defineStore('messages', {
	state: () => ({
		messages: {} as MessageList,
	}),
	getters: {},
	actions: {
		async getActiveChatMessages(chatId: ChatId) {
			if (!this.messages[chatId]) {
				// fetch messages for chat
				// make sure user is subscribed to socket
				const freshMessages = await getRequest(
					`chats/${chatId}/messages`,
				);
				this.messages[chatId] = freshMessages;
			}
			return this.messages[chatId];
		},
	},
});
