import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { Message } from '../chats/message/entities/message.entity';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../users/user/user.service';

type ChatId = number;
type UserId = number;

export type ChatList = Record<UserId, Socket[]>;

@Injectable()
export class SocketService {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}
	public chatServer: Server = null;

	public chatListSubscribers: ChatList = {};

	jwtCookieFromHandshakeString(string: string) {
		return string
			.split(' ')
			.find((cookie) => cookie.startsWith('jwt='))
			?.slice(4);
	}

	async chatList_subscribe(socket: Socket) {
		const cookie: string = this.jwtCookieFromHandshakeString(
			socket.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			await this.userService.findOne({ where: { id: userId } });

			if (!this.chatListSubscribers[userId]) {
				this.chatListSubscribers[userId] = [];
			}
			this.chatListSubscribers[userId].push(socket);
			console.log({
				userId,
				sockets: this.chatListSubscribers[userId].map((sock) => sock.id),
			});
		} catch (e) {
			console.log('Error on subscribing to chatlist');
		}
	}

	async chatList_unsubscribe(socket: Socket) {
		const cookie: string = this.jwtCookieFromHandshakeString(
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
