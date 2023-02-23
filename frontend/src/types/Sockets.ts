import type { Socket } from 'socket.io-client';

export interface SocketChat {
	socket: Socket | null;
	initialized: boolean;
	in_rooms: number[];
}

export interface SocketStore {
	chats: SocketChat;
}

export type ActionType = 'new' | 'update' | 'delete';

export interface SocketMessage<T> {
	action: ActionType;
	data: T;
}
