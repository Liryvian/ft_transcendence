import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../user/user.service';

type RelationshipObservers = Record<number, { rooms: string[] }>;

type RelationshipRoom = {
	source: number;
	target: number;
	id: number;
};

@WebSocketGateway({
	namespace: '/user/relationship',
	cors: {
		origin: '*',
	},
})
export class UserRelationshipGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	constructor(
		private readonly authService: AuthService,
		private userService: UserService,
	) {}
	@WebSocketServer()
	server: Server;
	public relationshipObservers: RelationshipObservers = {};

	jwtCookieFromHandshakeString(string: string) {
		return string
			.split(' ')
			.find((cookie) => cookie.startsWith('jwt='))
			?.slice(4);
	}

	buildUniqueRoomId(roomInfo: RelationshipRoom): string {
		return `${roomInfo.id}${Math.min(
			roomInfo.source,
			roomInfo.target,
		)}${Math.max(roomInfo.source, roomInfo.target)}`;
	}

	async handleConnection(client: Socket) {
		const cookie: string = this.jwtCookieFromHandshakeString(
			client.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			await this.userService.findOne({ where: { id: userId } });
			client.on('joinRoom', (roomInfo: RelationshipRoom) => {
				const roomName = this.buildUniqueRoomId(roomInfo);
				if (!this.relationshipObservers[userId]) {
					this.relationshipObservers[userId] = {
						rooms: [],
					};
				}
				if (!this.relationshipObservers[userId].rooms.includes(roomName))
					this.relationshipObservers[userId].rooms.push(roomName);
				client.join(roomName);
			});
		} catch (e) {
			console.log();
		}
	}

	handleDisconnect(client: Socket) {
		const cookie: string = this.jwtCookieFromHandshakeString(
			client.handshake.headers.cookie,
		);
		const userId: number = this.authService.userIdFromCookieString(cookie);
		this.relationshipObservers[userId].rooms.forEach((roomId) => {
			client.leave(roomId);
		});
		this.relationshipObservers[userId].rooms = [];
	}

	@SubscribeMessage('updateRelationship')
	updateRelationship(@MessageBody() roomInfo: RelationshipRoom) {
		const roomName = this.buildUniqueRoomId(roomInfo);
		this.server.in(roomName).emit('updateHasHappened');
	}
}
