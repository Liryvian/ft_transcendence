import type { Chat_List_Item, CreateNewChannelForm } from '@/types/Chat';
import { permissionsEnum } from '@/types/Chat';
import type { SocketMessage } from '@/types/Sockets';
import { getRequest, postRequest } from '@/utils/apiRequests';
import { defineStore } from 'pinia';
import router from '@/router';
import { useUserStore } from '@/stores/userStore';

export const useChatStore = defineStore('chats', {
	//  actions == data definitions
	state: () => ({
		dms: [] as Chat_List_Item[],
		channels: [] as Chat_List_Item[],
		subscribed: false,
		initialized: false,
		errors: [] as String[],
	}),
	// getters == computed values
	getters: {
		getAllChats: (state) =>
			[...state.dms, ...state.channels].sort((a, b) => a.id - b.id),
	},
	// actions == methods
	actions: {
		handleFormError(responseData: any) {
			if (typeof responseData.message === 'string') {
				this.errors.length = 0;
				this.errors.push(responseData.message);
			} else {
				this.errors = responseData.message.map((msg: String) =>
					msg.replace('(o) => o.', ''),
				);
			}
		},

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

		async createNewChannel(createNewChannelForm: CreateNewChannelForm) {
			try {
				this.errors.length = 0;

				const all = (await getRequest('chats')).data;
				const found = all.find(
					(chat: Chat_List_Item) => chat.name === createNewChannelForm.name,
				);
				if (found !== undefined){
					this.errors.push('channel name already exists');
					return;
				}
				if (!createNewChannelForm.name || createNewChannelForm.name.trim().length === 0){
					this.errors.push('Not a valid channel name');
					return;
				}
				// if (!createNewChannelForm.users[0]){
				// 	this.errors.push('you need to assign users to this channel');
				// 	return;
				// }
				const usersToSend = createNewChannelForm.users.map(
					(userId) => ({
						id: userId,
						permissions: [
							permissionsEnum.READ,
							permissionsEnum.POST,
						],
					}),
				);
				usersToSend.push({
					id: useUserStore().me.id,
					permissions: [
						permissionsEnum.READ,
						permissionsEnum.POST,
						permissionsEnum.OWNER,
					]
				})
				const newChannel = await postRequest('chats', {
					...createNewChannelForm,
					users: usersToSend
				});
				router.push({
					name: 'singlechat',
					params: { currentChat : newChannel.data.id },
				});
			} catch (e: any) {
				this.handleFormError(e.response.data);
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
