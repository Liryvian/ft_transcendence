import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
import { jwtCookieFromHandshakeString } from '../../socket/socket.utils';
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

	//  create a unique name for the room by:
	//  taking the id of the relationship and appending
	//  the smallest number between the source/target and then
	//  the biggestnumber from source/target
	//  this way the room name will always be the same no matter which of the two
	//  users, target or source, is acceessing the room.
	buildUniqueRoomId(roomInfo: RelationshipRoom): string {
		return `${roomInfo.id}${Math.min(
			roomInfo.source,
			roomInfo.target,
		)}${Math.max(roomInfo.source, roomInfo.target)}`;
	}

	//  this is only to be able to leave rooms when disconnecting
	saveRoomsObservedPerUser(userId: number, roomName: string) {
		if (!this.relationshipObservers[userId]) {
			this.relationshipObservers[userId] = {
				rooms: [],
			};
		}
		if (!this.relationshipObservers[userId].rooms.includes(roomName))
			this.relationshipObservers[userId].rooms.push(roomName);
	}

	handleConnection() {}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			client.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			if (this.relationshipObservers[userId]) {
				this.relationshipObservers[userId].rooms.forEach((roomId) => {
					client.leave(roomId);
				});
				this.relationshipObservers[userId].rooms = [];
			}
		} catch (e) {}
	}

	@SubscribeMessage('joinRoom')
	async joinRelationshipRoom(
		@MessageBody() relationData: RelationshipRoom,
		@ConnectedSocket() client: Socket,
	) {
		const cookie: string = jwtCookieFromHandshakeString(
			client.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			await this.userService.findOne({ where: { id: userId } });
			const roomName = this.buildUniqueRoomId(relationData);
			this.saveRoomsObservedPerUser(userId, roomName);
			client.join(roomName);
		} catch (e) {}
	}

	// receives an emit from relationshipStore updateRelationship()
	// and emits back to all users in room(roomName) to refresh their relationships
	@SubscribeMessage('updateRelationship')
	updateRelationship(@MessageBody() roomInfo: RelationshipRoom) {
		const roomName = this.buildUniqueRoomId(roomInfo);
		this.server.in(roomName).emit('updateHasHappened');
	}
}
