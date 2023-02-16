import type { User } from './User';

export interface UserChatPermissions {
	id: number;

	chat_id: number;

	chats: Chat[];

	user_id: number;

	users: User[];

	permission: string;
}

export interface Message {
	id: number;

	sender_id: User;
	chat_id: Chat;

	content: string;

	created_at: Date;
	updated_at: Date;
}

export interface Chat {
	id: number;
	name: string;

	has_users: UserChatPermissions[];
	users: User;

	visibility: string;
	password: string;

	messages: Message[];
}
