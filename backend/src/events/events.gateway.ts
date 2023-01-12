import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	WsResponse,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server } from 'socket.io';
import { ObjectLiteral } from 'typeorm';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class EventsGateway {
	@WebSocketServer()
	server: Server;

	@SubscribeMessage('events')
	findAll(@MessageBody() data: any): Observable<WsResponse<ObjectLiteral>> {
		console.log('events', data);
		return from([
			{ count: data.count ? data.count : 1 },
			{ count_plus_one: data.count ? data.count + 1 : 2 },
		]).pipe(map((item) => ({ event: 'events', data: item })));
	}

	@SubscribeMessage('identity')
	async identity(@MessageBody() data: number): Promise<number> {
		console.log('identity');
		return data;
	}
}
