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
import { ChatId } from '../socket/socket.types';

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
		this.socketService.leaveRooms(socket);
	}

	handleConnection(socket: Socket) {
		console.log('\n!Socket is connected!\n');
		this.socketService.chatList_subscribe(socket);
	}

	@SubscribeMessage('join')
	subscribeToRoom(
		@MessageBody() chatId: ChatId,
		@ConnectedSocket() client: Socket,
	) {
		this.socketService.joinRoom(chatId, client);
	}
}
