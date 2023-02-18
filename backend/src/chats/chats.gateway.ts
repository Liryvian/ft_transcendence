import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	namespace: '/chats',
	cors: {
		origin: '*:*',
	},
})
export class ChatsGateway
	implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	server: Server;

	afterInit(server: Server) {
		console.log('after init for server');
		// this.socketService.chatServer = server;
	}

	handleDisconnect(socket: Socket) {
		// socket.leave('chatlist');
	}

	async handleConnection(socket: Socket) {
		console.log('\n!Socket is connected!\n');
		this.sendHallo('Hallo frontend!!!');
	}

	@SubscribeMessage('hallo')
	sendHallo(@MessageBody() data: any) {
		this.server.emit('hallo', data);
	}
}
