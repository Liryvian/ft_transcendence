import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Position } from './Game.types';

@WebSocketGateway({
	namespace: '/pong',
	cors: {
		origin: '*:*',
	},
})
export class PongGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server;

	playerOnePaddle: Position = {
		x: 0,
		y: 50,
	};

	playerTwoPaddle: Position = {
		x: 100,
		y: 50,
	};

	ball: Position = {
		x: 40,
		y: 65,
	};

	async handleConnection(socket: Socket) {
		console.log('\n!Socket is connected!\n');
		this.sendHallo('Hallo frontend!!!');
		this.sendPaddlePosition(this.playerOnePaddle);
		this.sendPaddlePosition(this.playerTwoPaddle);
		this.sendBallPosition(this.ball);
	}

	@SubscribeMessage('hallo')
	sendHallo(@MessageBody() data: any) {
		this.server.emit('hallo', data);
	}

	@SubscribeMessage('barPosition')
	sendPaddlePosition(@MessageBody() position: Position) {
		this.server.emit('barPosition', position);
	}
	@SubscribeMessage('ballPosition')
	sendBallPosition(@MessageBody() position: Position) {
		this.server.emit('ballPosition', position);
	}
}
