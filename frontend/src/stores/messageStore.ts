import { defineStore } from 'pinia';
import type { SingleMessage } from '@/types/Chat';
import type { SocketMessage } from '@/types/Sockets';
import { getRequest } from '@/utils/apiRequests';
import { useSocketStore } from './socketStore';

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
				this.messages[chatId] = [];
				useSocketStore().subscribeToChatroom(chatId);
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

		newMessage(message: SingleMessage) {
			// if chat is does not exist, fuck it and ignore
			// temp store timestamp of last message
			const prev_timestamp = this.messages[message.chat_id]
				.slice(-1)[0]
				.created_at.valueOf();

			// add message
			this.messages[message.chat_id].push(message);

			// check if we need to sort
			if (message.created_at.valueOf() < prev_timestamp) {
				// sort if needed
				this.messages[message.chat_id].sort(
					(a: SingleMessage, b: SingleMessage) =>
						a.created_at.valueOf() - b.created_at.valueOf(),
				);
			}
		},
		updateMessage(message: SingleMessage) {
			console.log('updating messages is not implemented');
		},
		deleteMessage(message: SingleMessage) {
			if (this.messages[message.chat_id]) {
				this.$patch((state) => {
					state.messages[message.chat_id] = state.messages[
						message.chat_id
					].filter((msg) => msg.id !== message.id);
				});
			}
		},

		// should be typed
		socketAction(socketMessage: SocketMessage<SingleMessage>) {
			if (!this.messages[socketMessage.data.chat_id]) {
				return;
			}
			if (socketMessage.action === 'new') {
				return this.newMessage(socketMessage.data);
			}
			if (socketMessage.action === 'delete') {
				return this.deleteMessage(socketMessage.data);
			}
			if (socketMessage.action === 'update') {
				return this.updateMessage(socketMessage.data);
			}
		},
	},
});
