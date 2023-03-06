import { BadRequestException } from '@nestjs/common';
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
import { GameState } from './game.types.be';
import { Game } from './game/entities/game.entity';
import { PongService } from './pong.service';

const gameSubscribers: Record<number, GameState> = {};

@WebSocketGateway({
	namespace: '/pong',
	cors: {
		origin: '*',
	},
})
export class PongGateway implements OnGatewayConnection {
	constructor(
		private readonly pongService: PongService,
		private readonly authService: AuthService,
	) {}
	@WebSocketServer() server: Server;

	handleConnection() {
		console.log('Game connected');
	}

	createGameInstance(game: Game, client: Socket) {
		const roomName = String(game.id);
		gameSubscribers[game.id] = this.pongService.createNewGameState();
		gameSubscribers[game.id].gameId = game.id;
		gameSubscribers[game.id].scoreToWin = game.score_to_win || 5;
		gameSubscribers[game.id].roomName = roomName;
	}

	@SubscribeMessage('PlayerDisconnected')
	playerDisconnected(@MessageBody() gameId: string) {
		if (!gameSubscribers[+gameId].gameIsOver) {
			gameSubscribers[+gameId].gameIsOver = true;
		}
	}

	@SubscribeMessage('joinGameRoom')
	joinGameRoom(@MessageBody() game: Game, @ConnectedSocket() client: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			client.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			if (game.id && game.player_one && game.player_two) {
				console.log('Entering socket setup');
				if (!gameSubscribers[game.id]) {
					this.createGameInstance(game, client);
				}
				client.join(gameSubscribers[game.id].roomName);
				console.log('Joining room BE');
				if (userId === game.player_one.id) {
					gameSubscribers[game.id].playerOneIsInGame = true;
					gameSubscribers[game.id].playerOneId = userId;
				} else if (userId === game.player_two.id) {
					gameSubscribers[game.id].playerTwoIsInGame = true;
					gameSubscribers[game.id].playerTwoId = userId;
				}
				if (
					!gameSubscribers[game.id].gameCanStart &&
					gameSubscribers[game.id].playerOneIsInGame &&
					gameSubscribers[game.id].playerTwoIsInGame
				) {
					console.log('Emitting game can start');
					this.server
						.in(gameSubscribers[game.id].roomName)
						.emit('GameCanStart');
					gameSubscribers[game.id].gameCanStart = true;
				}
			}
		} catch (e) {}
	}

	sendPositionOfElements(gameState: GameState) {
		this.server
			.in(gameSubscribers[gameState.gameId].roomName)
			.emit('elementPositions', gameState);
	}

	handleFinishedPoint(currentGame: any) {
		const scores = {
			scorePlayerOne: currentGame.scorePlayerOne,
			scorePlayerTwo: currentGame.scorePlayerTwo,
		};
		this.server.in(currentGame.roomName).emit('pointOver', scores);
		currentGame.pointIsover = false;
	}

	handleGameOver(currentGame: any) {
		this.server.in(currentGame.roomName).emit('gameOver');
	}

	@SubscribeMessage('keyStateUpdate')
	keyStateUpdate(@MessageBody() data: any) {
		const currentGame = gameSubscribers[data!.id];
		if (!currentGame) return;

		if (data.userId === currentGame.playerOneId) {
			currentGame.playerOnePaddle.isPressed = data.keyPress;
		} else {
			currentGame.playerTwoPaddle.isPressed = data.keyPress;
		}
	}

	@SubscribeMessage('updatePositions')
	updatePositions(@MessageBody() data: any) {
		const currentGame = gameSubscribers[data!.id];
		if (!currentGame) return;

		this.pongService.movePaddles(
			currentGame.playerOnePaddle,
			currentGame.playerTwoPaddle,
		);
		this.pongService.moveBall(currentGame);
		this.sendPositionOfElements(currentGame);
		if (currentGame.pointIsOver) {
			this.handleFinishedPoint(currentGame);
		}
		if (currentGame.gameIsOver) {
			this.handleGameOver(currentGame);
		}
	}
}
