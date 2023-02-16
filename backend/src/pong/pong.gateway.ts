import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Position } from './Game.types';

interface GameState {
	playerOnePaddle: Position;
	playerTwoPaddle: Position;
	ball: Position;
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

	gameState = {
		playerOnePaddle: {
			x: 0,
			y: 50,
		},

		playerTwoPaddle: {
			x: 100,
			y: 50,
		},

		ball: {
			x: 40,
			y: 65,
		},
	};

	async handleConnection(socket: Socket) {
		console.log('\n!Socket is connected!\n');
		this.sendHallo('Hallo frontend!!!');
		setInterval(this.drawBall, 10, this.gameState, socket);
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
	drawBall(gameState: GameState, socket: Socket) {
		const radius = 1;

		if (
			gameState.ball.x + dx > 100 - radius ||
			gameState.ball.x + dx < radius
		) {
			dx = -dx;
		}
		if (
			gameState.ball.y + dy >= 100 - radius ||
			gameState.ball.y + dy <= radius
		) {
			dy = -dy;
		}
		gameState.ball.x += dx;
		gameState.ball.y += dy;
		socket.emit('updatePosition', gameState);
	}

	@SubscribeMessage('moveBar')
	moveBar(@MessageBody() keyPress: MovementKeys) {
		console.log(keyPress, 'pressed!');
		if (keyPress.ArrowUp) {
			this.gameState.playerTwoPaddle.y -= 5;
			if (this.gameState.playerTwoPaddle.y <= 0) {
				this.gameState.playerTwoPaddle.y = 5;
			}
		}
		if (keyPress.ArrowDown) {
			this.gameState.playerTwoPaddle.y += 5;
			if (this.gameState.playerTwoPaddle.y >= 100) {
				this.gameState.playerTwoPaddle.y = 95;
			}
		}
		if (keyPress.w) {
			this.gameState.playerOnePaddle.y -= 5;
			if (this.gameState.playerOnePaddle.y <= 0) {
				this.gameState.playerOnePaddle.y = 5;
			}
		}
		if (keyPress.s) {
			this.gameState.playerOnePaddle.y += 5;
			if (this.gameState.playerOnePaddle.y >= 100) {
				this.gameState.playerOnePaddle.y = 95;
			}
		}
		this.sendPositionOfElements(this.gameState);
		// setInterval(this.moveBar, 10, keyPress);
	}
}
