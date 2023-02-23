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

	async handleConnection() {
		console.log('\n!Socket is connected!\n');
		this.gameState = this.pongService.createNewGameState();
	}

	sendPositionOfElements(@MessageBody() gameState: GameState) {
		this.server.emit('elementPositions', gameState);
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
	}
}
