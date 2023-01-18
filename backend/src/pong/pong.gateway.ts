import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server , Socket} from 'socket.io';

class Position {
	x: number;
	y: number;
}

let position: Position = {
	x: 400,
	y: 235,
};

@WebSocketGateway({
	namespace: '/pong',
	cors: {
		origin: '*:*',
	},
})
export class PongGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server;

	async handleConnection(socket: Socket) {
		console.log('\n!Pong should be connected!\n');
		this.sendPosition({
			x: 400,
			y: 235,
		});
	}

	@SubscribeMessage('position')
	sendPosition(@MessageBody() data: any) {
		this.server.emit('position', position);
	}

	/*
	37 - Left arrow key
	39 - Right arrow key
	38 - Up arrow key
	40 - Down arrow key
	*/
	@SubscribeMessage('move')
	move(@MessageBody() direction: string) {
		console.log('Direction: ' + direction);
		switch (direction) {
			case 'ArrowLeft':
				position.x -= 10;
				if (position.x < 0) position.x = 800;
				this.sendPosition(position);
				break;
			case 'ArrowRight':
				position.x += 10;
				if (position.x > 800) position.x = 0;
				this.sendPosition(position);
				break;
			case 'ArrowUp':
				position.y -= 10;
				if (position.y < 0) position.y = 480;
				this.sendPosition(position);
				break;
			case 'ArrowDown':
				position.y += 10;
				if (position.y > 480) position.y = 0;
				this.sendPosition(position);
				break;
		}
	}
}
