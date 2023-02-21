import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { Message } from '../chats/message/entities/message.entity';

type ChatId = number;

export interface Chat_Member {
	id: number;
	name: string;
	avatar?: string;
	permissions?: string[];
}

export type Chat_Type = 'dm' | 'channel';
export interface ChatInfo {
	id: number;
	name: string;
	type: Chat_Type;
	users: Chat_Member[];
}

export interface ChatSocket extends Socket {
	name: String;
	info: ChatInfo;
	messages: Message[];
}
type ChatroomMap = Record<ChatId, ChatSocket>;

@Injectable()
export class SocketService {
	public chatServer: Server = null;

	// list of key=ChatId with subscribed userIds[]
	public chatrooms: ChatroomMap = {};

	broadcastChatList() {}
}
