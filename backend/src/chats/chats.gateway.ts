import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from '../socket/socket.service';

// type UpdateType = 'new' | 'update' | 'delete';

// interface UpdateMessage<T> {
// 	action: UpdateType;
// 	data: T | any;
// }

// class JoinRoom {
// 	name: String;
// }

@WebSocketGateway({
	namespace: '/chats',
	cors: {
		origin: '*',
	},
})
export class ChatsGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	constructor(private socketService: SocketService) {}

	@WebSocketServer()
	server: Server;

	afterInit(server: Server) {
		this.socketService.chatServer = server;
	}

	handleDisconnect(socket: Socket) {
		console.log('----- disconnect');
		this.socketService.chatList_unsubscribe(socket);
	}

	handleConnection(socket: Socket) {
		console.log('\n!Socket is connected!\n');
		this.socketService.chatList_subscribe(socket);
	}

	// @SubscribeMessage('join')
	// subscribeToRoom(
	// 	@MessageBody() data: JoinRoom,
	// 	@ConnectedSocket() client: Socket,
	// ) {
	// 	console.log('joining ', data);
	// 	client.join(`${data.name}`);
	// }
}
