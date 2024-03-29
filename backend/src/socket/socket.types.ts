import { Socket } from 'socket.io';
import { permissionsEnum } from '../chats/chat-user-permissions/entities/chat-user-permission.entity';

export type ChatId = number;
export type UserId = number;
export type SocketId = string;

export interface ChatInfo {
	chatId: ChatId;
	roomName: string;
	subscribers: UserId[];
}

export type ChatList = Record<UserId, Socket[]>;
export type MessageList = Record<ChatId, ChatInfo>;
export type OnlineList = Record<UserId, SocketId[]>;

export type Chat_Type = 'dm' | 'channel';
export type ActionType = 'new' | 'update' | 'delete';

export interface SingleMessage {
	id: number;

	user_id?: number;
	chat_id: number;
	content?: string;
	is_game_request?: boolean;

	created_at?: Date;
}

export interface Chat_Member {
	id: number;
	name: string;
	avatar?: string;
	permissions?: permissionsEnum[];
}

export interface Chat_List_Item {
	id: number;
	name?: string;
	type?: Chat_Type;
	users?: Chat_Member[];
	hasPassword?: boolean;
}

export interface SocketMessage<T> {
	action: ActionType;
	data: T;
}
