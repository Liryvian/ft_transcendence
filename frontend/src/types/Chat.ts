import type { User } from './User';

export interface UserChatPermissions {
	id: number;

	chat_id: number;

	chats: Chat[];

	user_id: number;

	users: User[];

	permission: string;
}

export interface SingleMessage {
	id: number;

	sender: User;
	chat: Chat;

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

	messages: SingleMessage[];
}

export interface Chat_Member {
	name: string;
	avatar?: string;
}

export type Chat_Type = 'dm' | 'channel';

export interface Chat_List_Item {
	id: number;
	name: string;
	type: Chat_Type;
	members: Chat_Member[];
}

export interface Chat_List {
	name: string;
	type: Chat_Type;
	items: Chat_List_Item[];
}
