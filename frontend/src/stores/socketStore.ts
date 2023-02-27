import io from 'socket.io-client';
import { defineStore } from 'pinia';
import type { SocketStore } from '@/types/Sockets';
import { useChatStore } from './chatStore';
import { useMessageStore } from './messageStore';
import type { Chat_List_Item, SingleMessage } from '@/types/Chat';
import type { SocketMessage } from '@/types/Sockets';

// it's always only one user..

export const useSocketStore = defineStore('sockets', {
	state: (): SocketStore => ({
		chats: {
			socket: null,
			initialized: false,
		},
		online: {
			socket: null,
			initialized: false,
		},
	}),
	actions: {
		initialize() {
			if (this.chats.initialized === false) {
				this.initializeChats();
			}
			if (this.online.initialized === false) {
				this.initializeOnline();
			}
		},
		async initializeChats() {
			this.chats.initialized = true;
			// get initial data in chat store if it is not there
			await useChatStore().init(false);
			// create socket
			this.chats.socket = io('/chats', { withCredentials: true });
			this.chats.socket.on('connection', (conn) => {
				console.log('Connected: ', conn);
			});
			this.chats.socket.on(
				'chatListUpdate',
				(update: SocketMessage<Chat_List_Item>) => {
					useChatStore().socketAction(update);
				},
			);
			this.chats.socket.on(
				'messageListUpdate',
				(update: SocketMessage<SingleMessage>) => {
					useMessageStore().socketAction(update);
				},
			);
		},
		async initializeOnline() {
			this.online.initialized = true;
		},
		disconnect() {
			this.chats.socket?.off('newMessage');
			this.chats.socket?.off('chatListUpdate');
			this.chats.socket?.disconnect();
		},
		async subscribeToChatroom(chatId: number) {
			if (this.chats.initialized === false) {
				await this.initializeChats();
			}
			if (this.chats.socket !== null) {
				this.chats.socket!.emit('join', chatId);
			}
		},
	},
});
