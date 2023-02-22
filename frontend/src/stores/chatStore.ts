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
		initialized: false,
	}),
	// getters == computed values
	getters: {
		getAllChats: (state) =>
			[...state.dms, ...state.channels].sort((a, b) => a.id - b.id),
	},
	// actions == methods
	actions: {
		async init(force: boolean) {
			if (this.initialized === false || force) {
				this.initialized = true;
				try {
					const all = (await getRequest('me/chats')).data;
					this.dms = all.filter(
						(chat: Chat_List_Item) => chat.type === 'dm',
					);
					this.channels = all.filter(
						(chat: Chat_List_Item) => chat.type === 'channel',
					);
				} catch (e) {
					this.initialized = false;
					console.error('error on getting me/chats', e);
					return [];
				}
			}
		},
		updateList(data: Chat_List_Item) {
			console.log('chat store update list method: ', data);
			if (data.type === 'dm') {
				this.dms.push(data);
			} else if (data.type === 'channel') {
				this.channels.push(data);
			}
		},
	},
});
