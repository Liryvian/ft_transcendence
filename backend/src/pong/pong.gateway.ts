import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Ball, Paddle } from './Game.types';

const paddleHeight = 12;
const paddleWidth = 1;
const ballRadius = 1;

@WebSocketGateway({
	namespace: '/pong',
	cors: {
		origin: '*:*',
	},
})
export class PongGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server;
	// all element values are percentages of width and height in FE
	//  so 0-100
	playerOnePaddle: Paddle = {
		position: {
			x: 0,
			y: 50,
		},
		width: paddleWidth,
		height: paddleHeight,
	};

	playerTwoPaddle: Paddle = {
		position: {
			x: 100,
			y: 50,
		},
		width: paddleWidth,
		height: paddleHeight,
	};

	ball: Ball = {
		position: {
			x: 40,
			y: 65,
		},
		radius: ballRadius,
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
	sendPaddlePosition(@MessageBody() paddle: Paddle) {
		this.server.emit('barPosition', paddle);
	}
	@SubscribeMessage('ballPosition')
	sendBallPosition(@MessageBody() ball: Ball) {
		this.server.emit('ballPosition', ball);
	}
}
