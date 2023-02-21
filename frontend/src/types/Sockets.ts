import type { Socket } from 'socket.io-client';

export interface SocketChat {
	socket: Socket | null;
	in_rooms: number[];
}

export interface SocketStore {
	chats: SocketChat;
}
