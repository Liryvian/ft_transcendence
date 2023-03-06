import type { Chat_List_Item } from '@/types/Chat';
import type { SocketMessage } from '@/types/Sockets';
import { getRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';

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
			console.log('new chat from socket in chatStore ', chat);
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

		updateChat(item: Chat_List_Item) {
			const currentItem: Chat_List_Item | undefined =
				this.getAllChats.find((current) => current.id === item.id);
			if (currentItem === undefined) {
				return false;
			}
			if (currentItem.type === 'channel') {
				this.$patch((state) => {
					state.channels = state.channels.map((channel) => {
						if (channel.id !== item.id) return channel;
						return this.updateChatListItemProperties(channel, item);
					});
				});
			} else if (currentItem.type === 'dm') {
				this.$patch((state) => {
					state.dms = state.dms.map((dm) => {
						if (dm.id !== item.id) return dm;
						return this.updateChatListItemProperties(dm, item);
					});
				});
			}
		},

		deleteChat(item: Chat_List_Item) {
			const currentItem: Chat_List_Item | undefined =
				this.getAllChats.find((current) => current.id === item.id);
			if (currentItem === undefined) {
				return false;
			}
			if (currentItem.type === 'channel') {
				this.$patch((state) => {
					state.channels = state.channels.filter((channel) => {
						return channel.id !== item.id;
					});
				});
			} else if (currentItem.type === 'dm') {
				this.$patch((state) => {
					state.dms = state.dms.filter((dm) => {
						return dm.id !== item.id;
					});
				});
			}
		},

		socketAction(socketMessage: SocketMessage<Chat_List_Item>) {
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
