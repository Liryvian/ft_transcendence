import io from 'socket.io-client';
import { defineStore } from 'pinia';
import type { SocketStore } from '@/types/Sockets';
import { useChatStore } from './chatStore';
import { useMessageStore } from './messageStore';

// it's always only one user..

export const useSocketStore = defineStore('sockets', {
	state: (): SocketStore => ({
		chats: {
			socket: null,
			in_rooms: [],
		},
	}),
	actions: {
		initialize() {
			if (this.chats === null) {
				this.initializeChats();
			}
		},
		async initializeChats() {
			console.log('Init chats');
			// get initial data in chat store
			await useChatStore().init(false);
			this.chats.socket = io('/chats');
			this.chats.socket.on('connection', (conn) => {
				console.log('Connected: ', conn);
			});
			this.chats.socket.on('listUpdate', (update) => {
				console.log('listUpdate: ', update);
				// call other store method
			});
			this.chats.socket.on('newMessage', (update) => {
				console.log('new message: ', update);
				useMessageStore().socketAction(update);
			});
		},
		disconnect() {
			this.chats.socket?.disconnect();
		},
		async subscribeToChatroom(room: String) {
			if (this.chats.socket === null) {
				await this.initializeChats();
			}
			// this.chats.socket!.emit('join', { roomName: room });
		},
	},
});
