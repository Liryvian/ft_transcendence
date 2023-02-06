import type { Chat } from '@/types/Chat';
import { getRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import { useUserStore } from './userStore';

export const useChatStore = defineStore("chats", {
	//  actions == data definitions
	state: () => ({
		allChats: <Chat[]>[],
	}),
  // getters == computed values
	getters: {
		getMyChats: () => useUserStore().getMe.chats,
        getAllChats: (state) => state.allChats,
	},
  // actions == methods
	actions: {
		async refreshAllChats() {
			try {
				const data = await getRequest ("chats");
				this.allChats = data.data;
			}
			  catch (e) {
				console.error(e);
			}
		},
	}
})
