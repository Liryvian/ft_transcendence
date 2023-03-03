import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { jwtCookieFromHandshakeString } from '../socket/socket.utils';
import { GameState, MovementKeys } from './game.types.be';
import { Game, gameStates } from './game/entities/game.entity';
import { PongService } from './pong.service';

const gameSubscribers: Record<number, GameState> = {};

@WebSocketGateway({
	namespace: '/pong',
	cors: {
		origin: '*',
	},
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly pongService: PongService,
		private readonly authService: AuthService,
	) {}
	@WebSocketServer() server: Server;

	// private playerOneIsInGame: boolean = false;
	// private playerTwoIsInGame: boolean = false;
	// private playerOneId: number = -1;
	// private playerTwoId: number = -1;

	handleConnection() {
		console.log('\n!Socket is connected!\n');
		// this.pongService.gameIsFinished = false;
		// this.pongService.pointIsOver = false;
		// this.gameState = this.pongService.createNewGameState();
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {}

	createGameInstance(game: Game, userId: number, client: Socket) {
		const roomName = String(game.id);
		gameSubscribers[game.id] = this.pongService.createNewGameState();
		gameSubscribers[game.id].gameId = game.id;
		gameSubscribers[game.id].scoreToWin = 10;
		client.join(roomName);
		if (userId === game.player_one.id) {
			gameSubscribers[game.id].playerOneIsInGame = true;
		} else if (userId === game.player_two.id) {
			gameSubscribers[game.id].playerTwoIsInGame = true;
		}
		gameSubscribers[game.id].roomName = roomName;
	}

	@SubscribeMessage('joinGameRoom')
	joinGameRoom(@MessageBody() game: Game, @ConnectedSocket() client: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			client.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			if (game.id && game.player_one && game.player_two) {
				if (!gameSubscribers[game.id]) {
					this.createGameInstance(game, userId, client);
				}
				if (
					gameSubscribers[game.id].playerOneIsInGame &&
					gameSubscribers[game.id].playerTwoIsInGame
				) {
					console.log('Starting game loop');
					this.server
						.in(gameSubscribers[game.id].roomName)
						.emit('GameCanStart');
					// this.playerOneIsInGame = false;
					// this.playerTwoIsInGame = false;
				}
			}
		} catch (e) {}
	}

	sendPositionOfElements(gameState: GameState) {
		console.log('emitting positions');
		//  if exists
		this.server
			.in(gameSubscribers[gameState.gameId].roomName)
			.emit('elementPositions', gameState);
	}

	@SubscribeMessage('resetAfterPointFinished')
	resetBallAfterPointIsOver(@MessageBody() gameId: number) {
		this.pongService.resetBallPosition(gameSubscribers[gameId].ball);
		this.sendPositionOfElements(gameSubscribers[gameId]);
	}

	resetService() {}

	handleFinishedPoint(gameId: number) {
		const scores = {
			scorePlayerOne: gameSubscribers[gameId].scorePlayerOne,
			scorePlayerTwo: gameSubscribers[gameId].scorePlayerTwo,
		};
		this.server.in(gameSubscribers[gameId].roomName).emit('pointOver', scores);
		gameSubscribers[gameId].pointIsover = false;
	}

	@SubscribeMessage('updatePositions')
	updatePositions(
		@MessageBody() gameId: number,
		@MessageBody() keyPress: MovementKeys,
		@ConnectedSocket() client: Socket,
	) {
		console.log('setting positions');
		const cookie: string = jwtCookieFromHandshakeString(
			client.handshake.headers.cookie,
		);
		const userId: number = this.authService.userIdFromCookieString(cookie);
		const currentgame = gameSubscribers[gameId];
		currentgame.isPressed = keyPress;
		this.pongService.movePaddles(
			currentgame.isPressed,
			currentgame.playerOnePaddle,
			currentgame.playerTwoPaddle,
			currentgame.playerOneId === userId,
		);
		this.pongService.moveBall(currentgame);
		this.sendPositionOfElements(currentgame);
		if (this.pongService.pointIsOver) {
			this.handleFinishedPoint(gameId);
		}
		if (this.pongService.gameIsFinished) {
			this.server.in(currentgame.roomName).emit('gameOver');
			this.resetService();
		}
	}

	// updatePositions(@MessageBody() keyPress: MovementKeys, @ConnectedSocket() client: Socket) {
	// 	const cookie: string = jwtCookieFromHandshakeString(
	// 		client.handshake.headers.cookie,
	// 	);
	// 	const userId: number = this.authService.userIdFromCookieString(cookie);
	// 	this.pongService.movePaddles(
	// 		keyPress,
	// 		this.gameState.playerOnePaddle,
	// 		this.gameState.playerTwoPaddle,
	// 		this.playerOneId === userId,
	// 	);
	// 	this.pongService.moveBall(this.gameState);
	// 	this.sendPositionOfElements(this.gameState);
	// 	if (this.pongService.pointIsOver) {
	// 		console.log('Emitting point is over');
	// 		const scores = {
	// 			scorePlayerOne: this.gameState.scorePlayerOne,
	// 			scorePlayerTwo: this.gameState.scorePlayerTwo,
	// 		};
	// 		this.server.emit('pointOver', scores);
	// 		this.pongService.pointIsOver = false;
	// 		this.handleFinishedPoint()
	// 	}
	// 	if (this.pongService.gameIsFinished) {
	// 		this.server.emit('gameOver');
	// 		this.pongService.gameIsFinished = false;
	// 		this.server.in(this.gameState.roomName).emit('gameOver');
	// 		this.resetService();
	// 	}
	// }
}
