import {
	MessageBody,
	OnGatewayConnection,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';

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
		// allowedHeaders: [
		// 	'Access-Control-Allow-Origin',
		// 	'Content-Type',
		// 	'Authorization',
		// ],
	},
})
export class PongGateway implements OnGatewayConnection {
	@WebSocketServer()
	server: Server;

	async handleConnection(socket: Socket) {
		console.log('\n!Pong should be connected!\n');
		this.server.emit('position', position);
	}

	@SubscribeMessage('position')
	sendPosition(@MessageBody() data: any) {
		console.log('Emitting position', data);
		this.server.emit('position', position);
	}

	/*
		37 - Left arrow key
		39 - Right arrow key
		38 - Up arrow key
		40 - Down arrow key
	*/
	@SubscribeMessage('move')
	move(@MessageBody() direction: number) {
		console.log('Direcetion: ' + direction);
		switch (direction) {
			case 37:
				position.x -= 10;
				if (position.x < 0) position.x = 800;
				this.sendPosition(position);
				break;
			case 39:
				position.x += 10;
				if (position.x > 800) position.x = 0;
				this.sendPosition(position);
				break;
			case 38:
				position.y -= 10;
				if (position.y < 0) position.y = 480;
				this.sendPosition(position);
				break;
			case 40:
				position.y += 10;
				if (position.y > 480) position.y = 0;
				this.sendPosition(position);
				break;
		}
	}
}
