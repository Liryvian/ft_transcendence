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
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly pongService: PongService,
		private readonly authService: AuthService,
	) {}
	@WebSocketServer() server: Server;

	handleConnection() {
		console.log('\n!Socket is connected!\n');
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			client.handshake.headers.cookie,
		);
		const userId: number = this.authService.userIdFromCookieString(cookie);
	}

	createGameInstance(game: Game, client: Socket) {
		const roomName = String(game.id);
		gameSubscribers[game.id] = this.pongService.createNewGameState();
		gameSubscribers[game.id].gameId = game.id;
		gameSubscribers[game.id].scoreToWin = 10;
		client.join(roomName);
		gameSubscribers[game.id].roomName = roomName;
	}

	@SubscribeMessage('joinGameRoom')
	joinGameRoom(@MessageBody() game: Game, @ConnectedSocket() client: Socket) {
		console.log('CurretnGame: ', game);
		const cookie: string = jwtCookieFromHandshakeString(
			client.handshake.headers.cookie,
		);
		try {
			const userId: number = this.authService.userIdFromCookieString(cookie);
			if (game.id && game.player_one && game.player_two) {
				if (!gameSubscribers[game.id]) {
					this.createGameInstance(game, client);
				} else {
					client.join(gameSubscribers[game.id].roomName);
				}
				if (userId === game.player_one.id) {
					gameSubscribers[game.id].playerOneIsInGame = true;
					gameSubscribers[game.id].playerOneId = userId;
				} else if (userId === game.player_two.id) {
					gameSubscribers[game.id].playerTwoIsInGame = true;
					gameSubscribers[game.id].playerTwoId = userId;
				}
				if (
					!this.pongService.gameHasStarted &&
					gameSubscribers[game.id].playerOneIsInGame &&
					gameSubscribers[game.id].playerTwoIsInGame
				) {
					console.log('Emitting game start');
					this.server
						.in(gameSubscribers[game.id].roomName)
						.emit('GameCanStart');
					this.pongService.gameHasStarted = true;
				}
			}
		} catch (e) {}
	}

	sendPositionOfElements(gameState: GameState) {
		this.server
			.in(gameSubscribers[gameState.gameId].roomName)
			.emit('elementPositions', gameState);
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
	updatePositions(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		const cookie: string = jwtCookieFromHandshakeString(
			client.handshake.headers.cookie,
		);
		const userId: number = this.authService.userIdFromCookieString(cookie);
		const currentgame = gameSubscribers[data!.id];
		if (!currentgame) {
			throw new BadRequestException("Game doesn't exists");
		}
		this.pongService.movePaddles(
			data.keyPress,
			currentgame.playerOnePaddle,
			currentgame.playerTwoPaddle,
			currentgame.playerOneId === userId,
		);
		this.pongService.moveBall(currentgame);
		this.sendPositionOfElements(currentgame);
		if (this.pongService.pointIsOver) {
			this.handleFinishedPoint(data.id);
		}
		if (this.pongService.gameIsFinished) {
			this.server.in(currentgame.roomName).emit('gameOver');
			gameSubscribers[data!.id] = undefined;
			this.pongService.gameIsFinished = false;
		}
	}
}
