import type { Socket } from 'socket.io-client';

export interface SocketStore {
	chats: Socket | null;
}
