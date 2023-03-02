import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameState, MovementKeys } from './game.types.be';
import { Game } from './game/entities/game.entity';
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

	buildUniqueRoomId(roomInfo: Game): string {
		return `${roomInfo.id}${Math.min(
			roomInfo.player_one.id,
			roomInfo.player_two.id,
		)}${Math.max(roomInfo.player_one.id, roomInfo.player_two.id)}`;
	}

	handleConnection(client: Socket) {
		console.log('\n!Socket is connected!\n');
		this.pongService.gameIsFinished = false;
		this.pongService.pointIsOver = false;
		this.gameState = this.pongService.createNewGameState();
		client.on('joinGameRoom', (game: Game) => {
			console.log('Joining gameroom: ', game);
			const roomName = this.buildUniqueRoomId(game);
			client.join(roomName);
			this.gameState.roomName = roomName;
		});
		//  set score to win with requestGame info
		this.gameState.scoreToWin = 5;
	}

	sendPositionOfElements(@MessageBody() gameState: GameState) {
		this.server.in(this.gameState.roomName).emit('elementPositions', gameState);
	}

	sendPointOver(@MessageBody() player: string) {
		this.server.in(this.gameState.roomName).emit('pointOver', player);
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
			this.server.in(this.gameState.roomName).emit('pointOver', scores);
			this.pongService.pointIsOver = false;
		}
		if (this.pongService.gameIsFinished) {
			this.server.in(this.gameState.roomName).emit('gameOver');
			this.pongService.gameIsFinished = false;
		}
	}
}
