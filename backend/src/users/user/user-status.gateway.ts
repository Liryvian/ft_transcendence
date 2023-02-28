import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { jwtCookieFromHandshakeString } from '../../socket/socket.utils';
import { OnlineList } from '../../socket/socket.types';
import { AuthService } from '../../auth/auth.service';

@WebSocketGateway({
	namespace: '/onlinestatus',
	cors: {
		origin: '*',
	},
})
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly authService: AuthService) {}

	public onlineList: OnlineList = {};

	@WebSocketServer()
	server: Server;

	async handleDisconnect(socket: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			socket.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			// we don't realy care if it's a valid user id for removing it right?
			// await this.userService.findOne({ where: { id: userId } });

			if (this.onlineList[userId]) {
				// if userId is in onlineList
				const socketIndex = this.onlineList[userId].findIndex(
					(sock) => sock === socket.id,
				);
				if (socketIndex !== -1) {
					this.onlineList[userId].splice(socketIndex, 1);
				}
				if (this.onlineList[userId].length === 0) {
					this.server.emit('update', { user_id: userId, status: false });
					delete this.onlineList[userId];
				}
			}
		} catch (e) {
			console.log('something went wrong on disconnecting to online-status');
		}
	}

	handleConnection(socket: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			socket.handshake.headers.cookie,
		);

		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);

			if (!this.onlineList[userId]) {
				this.onlineList[userId] = [];
			}
			this.onlineList[userId].push(socket.id);
			const initialList = [];
			for (const userId in this.onlineList) {
				initialList.push({
					user_id: userId,
					status: this.onlineList[userId].length > 0,
				});
			}
			socket.emit('initList', initialList);
			this.server.emit('update', { user_id: userId, status: true });
		} catch (e) {
			console.log('something went wrong on connecting to online-status');
		}
	}
}
