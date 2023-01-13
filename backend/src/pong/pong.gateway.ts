import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameService } from './game/game.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
	namespace: '/pong',
	cors: {
		origin: '*',
	},
})
export class PongGateway implements OnGatewayConnection {
	@WebSocketServer() wss: Server;
	server: Server;
	constructor(private readonly gameService: GameService) {}

	async handleConnection(socket: Socket) {
		socket.handshake.headers.cookie;
		console.log('\n!Pong should be connected!\n');
	}

	@SubscribeMessage('send_message')
	listenForMessages(@MessageBody() data: string) {
		this.gameService.findAll();
		this.server.sockets.emit('receive_message: ', data);
	}
}
