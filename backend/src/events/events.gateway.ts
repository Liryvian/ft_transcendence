import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server } from 'socket.io';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class EventsGateway {
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('events')
	findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
		console.log('events');
		return from([1, 2, 3]).pipe(
			map((item) => ({ event: 'events', data: item })),
		);
	}

	@SubscribeMessage('identity')
	async identity(@MessageBody() data: number): Promise<number> {
		console.log('identity');
		return data;
	}
}
