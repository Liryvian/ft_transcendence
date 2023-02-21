import type { Chat_List_Item } from '@/types/Chat';
import { getRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import { useSocketStore } from './socketStore';

export const useChatStore = defineStore('chats', {
	//  actions == data definitions
	state: () => ({
		dms: [] as Chat_List_Item[],
		channels: [] as Chat_List_Item[],
		subscribed: false,
	}),
	// getters == computed values
	getters: {
		getAllChats: (state) =>
			[...state.dms, ...state.channels].sort((a, b) => a.id - b.id),
	},
	// actions == methods
	actions: {
		async init(force: boolean) {
			if (this.getAllChats.length === 0 || force) {
				try {
					const all = (await getRequest('me/chats')).data;
					this.dms = all.filter(
						(chat: Chat_List_Item) => chat.type === 'dm',
					);
					this.channels = all.filter(
						(chat: Chat_List_Item) => chat.type === 'channel',
					);
				} catch (e) {
					console.error('error on getting me/chats', e);
					return [];
				}
			}
		},
	},
});
