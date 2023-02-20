import { defineStore } from 'pinia';
import type { SingleMessage } from '@/types/Chat';

type chatId = number;
type MessageList = Record<chatId, SingleMessage[]>;

export const useChatStore = defineStore('messages', {
	state: () => ({
		messages: {} as MessageList,
	}),
	getters: {},
	actions: {},
});
