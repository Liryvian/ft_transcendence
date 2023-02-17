import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Ball, Paddle } from './Game.types';

interface GameState {
	playerOnePaddle: Paddle;
	playerTwoPaddle: Paddle;
	ball: Ball;
}

interface MovementKeys {
	ArrowUp: boolean;
	ArrowDown: boolean;
	w: boolean;
	s: boolean;
}

let dx = 0.4;
let dy = 0.4;

const paddleWidth = 1;
const paddleHeight = 12;

const ballRadius = 1;

const offset = 0.05;

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
	gameState: GameState = {
		playerOnePaddle: {
			position: {
				x: 0,
				y: 50,
			},
			width: paddleWidth,
			height: paddleHeight,
		},

		playerTwoPaddle: {
			position: {
				x: 100,
				y: 50,
			},
			width: paddleWidth,
			height: paddleHeight,
		},

		ball: {
			position: {
				x: 40,
				y: 65,
			},
			radius: ballRadius,
		},
	};

	async handleConnection(socket: Socket) {
		console.log('\n!Socket is connected!\n');
		this.sendHallo('Hallo frontend!!!');
	}

	printInterValCallback() {
		console.log('SetintervalCallback');
	}

	@SubscribeMessage('hallo')
	sendHallo(@MessageBody() data: any) {
		this.server.emit('hallo', data);
	}

	sendPositionOfElements(@MessageBody() gameState: GameState) {
		this.server.emit('elementPositions', gameState);
	}

	hitsWall(radius: number, pos: number, direction: number): boolean {
		return (
			pos + direction + offset > 100 - radius ||
			pos + direction < radius + offset
		);
	}

	moveBall() {
		const radius = 1;

		if (this.hitsWall(radius, this.gameState.ball.position.x, dx)) {
			dx = -dx;
		}
		if (this.hitsWall(radius, this.gameState.ball.position.y, dy)) {
			dy = -dy;
		}
		this.gameState.ball.position.x += dx;
		this.gameState.ball.position.y += dy;
	}

	movePaddles(pressedKey: MovementKeys) {
		if (pressedKey.ArrowUp) {
			if (this.gameState.playerTwoPaddle.position.y <= 5) {
				this.gameState.playerTwoPaddle.position.y = 5;
			} else {
				this.gameState.playerTwoPaddle.position.y -= 1;
			}
		}
		if (pressedKey.ArrowDown) {
			if (this.gameState.playerTwoPaddle.position.y >= 95) {
				this.gameState.playerTwoPaddle.position.y = 95;
			} else {
				this.gameState.playerTwoPaddle.position.y += 1;
			}
		}
		if (pressedKey.w) {
			if (this.gameState.playerOnePaddle.position.y <= 5) {
				this.gameState.playerOnePaddle.position.y = 5;
			} else {
				this.gameState.playerOnePaddle.position.y -= 1;
			}
		}
		if (pressedKey.s) {
			if (this.gameState.playerOnePaddle.position.y >= 95) {
				this.gameState.playerOnePaddle.position.y = 95;
			} else {
				this.gameState.playerOnePaddle.position.y += 1;
			}
		}
	}

	@SubscribeMessage('updatePositions')
	updatePositions(@MessageBody() keyPress: MovementKeys) {
		this.movePaddles(keyPress);
		this.moveBall();
		this.sendPositionOfElements(this.gameState);
	}
}
