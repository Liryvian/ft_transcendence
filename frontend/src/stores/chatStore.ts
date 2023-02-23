import type { Chat_List, Chat_List_Item, UpdateMessage } from '@/types/Chat';
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

		newChat(chat: Chat_List_Item) {
			if (chat.type === 'dm') {
				this.$patch((state) => {
					state.dms.push(chat);
				});
			} else if (chat.type === 'channel') {
				this.$patch((state) => {
					state.channels.push(chat);
				});
			}
		},

		updateChatListItemProperties(
			item: Chat_List_Item,
			newProps: Chat_List_Item,
		) {
			if (newProps.hasOwnProperty('name')) {
				item.name = newProps.name;
			}
			if (newProps.hasOwnProperty('users')) {
				item.users = newProps.users;
			}
			if (newProps.hasOwnProperty('type')) {
				item.type = newProps.type;
			}
			return item;
		},

		updateChat(chat: Chat_List_Item) {
			// this cannot switch between types..
			// so find item in all chats, update name/users
			// if type needs to update, remove from one, add to other?
			if (chat.type === 'dm') {
				this.$patch((state) => {
					state.dms = state.dms.map((dm) => {
						if (dm.id !== chat.id) return dm;
						return this.updateChatListItemProperties(dm, chat);
					});
				});
			} else if (chat.type === 'channel') {
				this.$patch((state) => {
					state.channels = state.channels.map((channel) => {
						if (channel.id !== chat.id) return channel;
						return this.updateChatListItemProperties(channel, chat);
					});
				});
			}
		},

		deleteChat(chat: Chat_List_Item) {
			if (chat.type === 'dm') {
				this.$patch((state) => {
					state.dms = state.dms.filter((dm) => {
						return dm.id !== chat.id;
					});
				});
			} else if (chat.type === 'channel') {
				this.$patch((state) => {
					state.channels = state.channels.filter((channel) => {
						return channel.id !== chat.id;
					});
				});
			}
		},

		socketAction(socketMessage: UpdateMessage<Chat_List_Item>) {
			console.log('chat store update list method: ', socketMessage);

			if (socketMessage.action === 'new') {
				return this.newChat(socketMessage.data);
			}
			if (socketMessage.action === 'delete') {
				return this.deleteChat(socketMessage.data);
			}
			if (socketMessage.action === 'update') {
				return this.updateChat(socketMessage.data);
			}
		},
	},
});
