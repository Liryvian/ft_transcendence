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

let dx = 0.1;
let dy = 0.1;

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
	gameState = {
		playerOnePaddle: {
			position: {
				x: 0,
				y: 50,
			},
			width: 1,
			height: 12,
		},

		playerTwoPaddle: {
			position: {
				x: 100,
				y: 50,
			},
			width: 1,
			height: 12,
		},

		ball: {
			position: {
				x: 40,
				y: 65,
			},
			radius: 1,
		},
	};

	async handleConnection(socket: Socket) {
		console.log('\n!Socket is connected!\n');
		this.sendHallo('Hallo frontend!!!');
		setInterval(this.drawBall, 10, this.gameState, socket, this.hitsWall);
	}

	printInterValCallback() {
		console.log('SetintervalCallback');
	}

	@SubscribeMessage('hallo')
	sendHallo(@MessageBody() data: any) {
		this.server.emit('hallo', data);
	}

	// @SubscribeMessage('updatePosition')
	sendPositionOfElements(@MessageBody() gameState: GameState) {
		this.server.emit('updatePosition', gameState);
	}

	// @SubscribeMessage('moveBall')
	// dx = 0.5;
	// dy = 0.5;
	hitsWall(radius: number, pos: number, direction: number): boolean {
		return pos + direction > 100 - radius || pos + direction < radius;
	}

	drawBall(gameState: GameState, socket: Socket, hitsWall) {
		const radius = 1;

		if (hitsWall(radius, gameState.ball.position.x, dx)) {
			dx = -dx;
		}
		if (hitsWall(radius, gameState.ball.position.y, dy)) {
			dy = -dy;
		}
		gameState.ball.position.x += dx;
		gameState.ball.position.y += dy;
		socket.emit('updatePosition', gameState);
	}

	@SubscribeMessage('moveBar')
	moveBar(@MessageBody() keyPress: MovementKeys) {
		console.log(keyPress, 'pressed!');
		if (keyPress.ArrowUp) {
			this.gameState.playerTwoPaddle.position.y -= 5;
			if (this.gameState.playerTwoPaddle.position.y <= 0) {
				this.gameState.playerTwoPaddle.position.y = 5;
			}
		}
		if (keyPress.ArrowDown) {
			this.gameState.playerTwoPaddle.position.y += 5;
			if (this.gameState.playerTwoPaddle.position.y >= 100) {
				this.gameState.playerTwoPaddle.position.y = 95;
			}
		}
		if (keyPress.w) {
			this.gameState.playerOnePaddle.position.y -= 5;
			if (this.gameState.playerOnePaddle.position.y <= 0) {
				this.gameState.playerOnePaddle.position.y = 5;
			}
		}
		if (keyPress.s) {
			this.gameState.playerOnePaddle.position.y += 5;
			if (this.gameState.playerOnePaddle.position.y >= 100) {
				this.gameState.playerOnePaddle.position.y = 95;
			}
		}
		this.sendPositionOfElements(this.gameState);
	}
}
