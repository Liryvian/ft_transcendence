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

export interface Chat_Member {
	name: string;
	avatar?: string;
}

export interface Chat_List_Item {
	id: number;
	name: string;
	members: Chat_Member[];
}

export type Chat_Type = "dm" | "channel";

export interface Chat_List {
	name: string;
	type: Chat_Type;
	items: Chat_List_Item[];
}

