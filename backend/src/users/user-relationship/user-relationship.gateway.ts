import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	namespace: '/user/relationship',
	cors: {
		origin: '*',
	},
})
export class UserRelationshipGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	// constructor(private readonly socketService: UserRelationshipSocketService) {}
	@WebSocketServer()
	server: Server;
	public roomIds: string[] = [];

	handleConnection(client: Socket) {
		client.on('joinRoom', (roomUID: number) => {
			this.roomIds.push(`${roomUID}`);
			console.log('Connected to rom: ', roomUID);
			client.join(`room_${roomUID}`);
		});
	}

	handleDisconnect(client: any) {
		// leave all roomids, spread.value returns only unique values
		this.roomIds.forEach((roomId) => {
			console.log('leaving UID: ', roomId);
			client.leave(roomId);
			this.roomIds = [];
		});
	}

	// sendupdatedRelationship(@MessageBody() body) {}

	// @SubscribeMessage('updateRelationship')
	// updatePositions(@MessageBody() data) {}
}
