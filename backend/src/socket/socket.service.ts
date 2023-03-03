import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../users/user/user.service';
import {
	ChatId,
	ChatList,
	Chat_List_Item,
	MessageList,
	SingleMessage,
	SocketMessage,
} from './socket.types';
import { jwtCookieFromHandshakeString } from './socket.utils';

@Injectable()
export class SocketService {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}
	public chatServer: Server = null;

	public chatListSubscribers: ChatList = {};
	public messageLists: MessageList = {};

	chatIdToRoomName(chatId: string): string;
	chatIdToRoomName(chatId: ChatId): string;
	chatIdToRoomName(chatId: ChatId | string): string {
		return `room_${chatId}`;
	}

	async joinRoom(chatId: ChatId, socket: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			socket.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			await this.userService.findOne({ where: { id: userId } });
			const roomName = this.chatIdToRoomName(chatId);
			if (!this.messageLists[chatId]) {
				this.messageLists[chatId] = {
					chatId: chatId,
					roomName: roomName,
					subscribers: [],
				};
			}
			this.messageLists[chatId].subscribers.push(userId);
			socket.join(roomName);
		} catch (e) {
			console.log('somthing went wrong in joining a room');
		}
	}

	emit_to_room(chatId: ChatId, message: SocketMessage<SingleMessage>) {
		// if this works...
		this.chatServer
			.to(this.chatIdToRoomName(chatId))
			.emit('newMessage', message);
	}

	leaveRoom(chatId: ChatId, socket: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			socket.handshake.headers.cookie,
		);
		// leave a room...
	}

	async leaveRooms(socket: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			socket.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			await this.userService.findOne({ where: { id: userId } });

			for (const chatId in this.messageLists) {
				const index = this.messageLists[chatId].subscribers.indexOf(userId);
				if (index != -1) {
					this.messageLists[chatId].subscribers.splice(index, 1);
					socket.leave(this.chatIdToRoomName(chatId));
				}
			}
		} catch (e) {
			console.log('something went wrong on leaving rooms');
		}
	}

	chatlist_emit(to: string | number[], message: SocketMessage<Chat_List_Item>) {
		if (to === 'all') {
			for (const userId in this.chatListSubscribers) {
				this.chatListSubscribers[userId].forEach((socket) => {
					socket.emit('chatListUpdate', message);
				});
			}
		} else if (to instanceof Array && to.length > 0) {
			to.forEach((userId: number) => {
				if (this.chatListSubscribers[userId]) {
					this.chatListSubscribers[userId].forEach((socket) => {
						socket.emit('chatListUpdate', message);
					});
				} else {
					console.log(`User ${userId} not subscribed, not emitting`);
				}
			});
		}
	}

	async chatList_subscribe(socket: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			socket.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			await this.userService.findOne({ where: { id: userId } });

			if (!this.chatListSubscribers[userId]) {
				this.chatListSubscribers[userId] = [];
			}
			this.chatListSubscribers[userId].push(socket);
		} catch (e) {
			console.log('Error on subscribing to chatlist');
			console.log(e);
		}
	}

	async chatList_unsubscribe(socket: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			socket.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			await this.userService.findOne({ where: { id: userId } });

			if (this.chatListSubscribers[userId]) {
				const socketIndex = this.chatListSubscribers[userId].findIndex(
					(sock) => sock.id === socket.id,
				);
				if (socketIndex !== -1) {
					this.chatListSubscribers[userId].splice(socketIndex, 1);
				}
				if (this.chatListSubscribers[userId].length === 0) {
					delete this.chatListSubscribers[userId];
				}
			}
		} catch (e) {
			console.log('Error on unsubscribing from chatlist');
		}
	}
}
