import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

type chatId = number;
type chatIds = chatId[];
type userId = number;
type userIds = userId[];
type ChatroomMap = Record<chatId, userIds>;
type ChatlistMap = Record<userId, chatIds>;

@Injectable()
export class SocketService {
	public chatServer: Server = null;

	// list of key=userId subscribed to chatIds[]
	public chatlist: ChatlistMap = {};
	// list of key=chatId with subscribed userIds[]
	public chatrooms: ChatroomMap = {};
}
