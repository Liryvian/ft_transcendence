import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameState, MovementKeys } from './game.types.be';
import { PongService } from './pong.service';

@WebSocketGateway({
	namespace: '/pong',
	cors: {
		origin: '*',
	},
})
export class PongGateway implements OnGatewayConnection {
	constructor(private readonly pongService: PongService) {}
	@WebSocketServer()
	server: Server;

	private gameState: GameState;

	handleConnection() {
		console.log('\n!Socket is connected!\n');
		this.pongService.gameIsFinished = false;
		this.pongService.pointIsOver = false;
		this.gameState = this.pongService.createNewGameState();
		//  set score to win with requestGame info
		this.gameState.scoreToWin = 2;
	}

	sendPositionOfElements(@MessageBody() gameState: GameState) {
		this.server.emit('elementPositions', gameState);
	}

	sendPointOver(@MessageBody() player: string) {
		this.server.emit('pointOver', player);
	}

	@SubscribeMessage('resetAfterPointFinished')
	resetBallAfterPointIsOver() {
		this.pongService.resetBallPosition(this.gameState.ball);
		this.sendPositionOfElements(this.gameState);
	}

	@SubscribeMessage('updatePositions')
	updatePositions(@MessageBody() keyPress: MovementKeys) {
		this.pongService.movePaddles(
			keyPress,
			this.gameState.playerOnePaddle,
			this.gameState.playerTwoPaddle,
		);
		this.pongService.moveBall(this.gameState);
		this.sendPositionOfElements(this.gameState);
		if (this.pongService.pointIsOver) {
			console.log('Emitting point is over');
			const scores = {
				scorePlayerOne: this.gameState.scorePlayerOne,
				scorePlayerTwo: this.gameState.scorePlayerTwo,
			};
			this.server.emit('pointOver', scores);
			this.pongService.pointIsOver = false;
		}
		if (this.pongService.gameIsFinished) {
			this.server.emit('gameOver');
			this.pongService.gameIsFinished = false;
		}
	}
}
