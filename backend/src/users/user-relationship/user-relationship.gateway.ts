import {
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UpdateUserRelationshipDto } from './dto/update-user-relationship.dto';

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
			this.roomIds.push(`room_${roomUID}`);
			console.log(`Connected to: room_${roomUID}`);
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

	@SubscribeMessage('updateRelationship')
	updateRelationship(@MessageBody() updateData: UpdateUserRelationshipDto) {
		console.log('updating rel via sockets');
		this.roomIds.forEach((roomid) => {
			this.server.in(roomid).emit('updateHasHappened');
		});
		// this.server.in(this.roomIds[4]).emit('updateHasHappened');
	}
}
