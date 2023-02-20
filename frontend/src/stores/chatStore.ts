import type { Chat_List_Item } from '@/types/Chat';
import { getRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import { useUserStore } from './userStore';

export const useChatStore = defineStore('chats', {
	//  actions == data definitions
	state: () => ({
		allChats: <Chat_List_Item[]>[],
	}),
	// getters == computed values
	getters: {
		getDms: (state) =>
			state.allChats.filter((chat: Chat_List_Item) => chat.type === 'dm'),
		getChannels: (state) =>
			state.allChats.filter(
				(chat: Chat_List_Item) => chat.type === 'channel',
			),

		getMyChats: () => useUserStore().getMe.chats,
		getAllChats: (state) => state.allChats,
	},
	// actions == methods
	actions: {
		async refreshAllChats() {
			try {
				console.log('Refreshing all chats');
				const data = await getRequest('me/chats');
				console.log('Refreshed all chats');
				this.allChats = data.data;
			} catch (e) {
				console.error(e);
				return [];
			}
		},
		async refreshMyChats() {
			await useUserStore().refreshMe();
		},

		async refreshData() {
			await this.refreshAllChats();
			await this.refreshMyChats();
		},
	},
});
