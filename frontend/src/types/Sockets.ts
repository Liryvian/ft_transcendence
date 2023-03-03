import type { Socket } from 'socket.io-client';

export interface SocketChat {
	socket: Socket | null;
	initialized: boolean;
}

export interface SocketStore {
	chats: SocketChat;
	online: SocketChat;
}

export type ActionType = 'new' | 'update' | 'delete';

export interface SocketMessage<T> {
	action: ActionType;
	data: T;
}

export interface StatusUpdate {
	user_id: string;
	status: boolean;
}

export type StatusList = Record<string, boolean>;
