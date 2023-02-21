import io from 'socket.io-client';
import { defineStore } from 'pinia';
import type { SocketStore } from '@/types/Sockets';
import { useChatStore } from './chatStore';
import { useMessageStore } from './messageStore';

export const useSocketStore = defineStore('sockets', {
	state: (): SocketStore => ({
		chats: null,
	}),
	actions: {
		initialize() {
			console.log('Socket store init function');
			if (this.chats === null) {
				this.initializeChats();
			}
		},
		async initializeChats() {
			console.log('Init chats');
			// get initial data in chat store
			await useChatStore().refreshAllChats();
			this.chats = io('/chats');
			this.chats.on('connection', (conn) => {
				console.log('Connected: ', conn);
			});
			this.chats.on('listUpdate', (update) => {
				console.log('listUpdate: ', update);
				// call other store method
			});
			this.chats.on('newMessage', (update) => {
				console.log('new message: ', update);
				useMessageStore().socketAction(update);
			});
		},
		disconnect() {
			this.chats?.disconnect();
		},
	},
});
