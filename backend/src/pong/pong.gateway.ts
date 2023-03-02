import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { jwtCookieFromHandshakeString } from '../socket/socket.utils';
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
	constructor(private readonly pongService: PongService, private readonly authService: AuthService) {}
	@WebSocketServer()
	server: Server;

	private gameState: GameState;
	private playerOneIsInGame: boolean;
	private playerTwoIsInGame: boolean;

	buildUniqueRoomId(roomInfo: Game): string {
		return `${roomInfo.id}${Math.min(
			roomInfo.player_one.id,
			roomInfo.player_two.id,
			)}${Math.max(roomInfo.player_one.id, roomInfo.player_two.id)}`;
		}
		
		handleConnection() {
		this.playerOneIsInGame = false;
		this.playerTwoIsInGame = false;
		console.log("P1 online: ", this.playerOneIsInGame);
		console.log("P2 online: ", this.playerTwoIsInGame);
		console.log('\n!Socket is connected!\n');
		this.pongService.gameIsFinished = false;
		this.pongService.pointIsOver = false;
		this.gameState = this.pongService.createNewGameState();

		this.gameState.scoreToWin = 2;
	}

	@SubscribeMessage("joinGameRoom") 
	joinGameRoom(@MessageBody() game: Game, @ConnectedSocket() client: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			client.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			if (userId === game.player_one.id) {
				this.playerOneIsInGame = true;
			}
			else if (userId === game.player_two.id) {
				this.playerTwoIsInGame = true;
			}
			const roomName = this.buildUniqueRoomId(game);
			client.join(roomName);
			this.gameState.roomName = roomName;
			if (this.playerOneIsInGame && this.playerTwoIsInGame) {
				this.server.in(roomName).emit("GameCanStart");
			}
		} catch (e) {}
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
			console.log("Emitting gam is over")
			this.server.in(this.gameState.roomName).emit('gameOver');
			this.pongService.gameIsFinished = false;
		}
	}
}
