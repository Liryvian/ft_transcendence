import type { User } from './User';

export enum permissionsEnum {
	READ = 'read',
	POST = 'post',
	LEFT = 'left',
	BLOCKED = 'blocked',
	MANAGE_USERS = 'manage_users',
	EDIT_SETTINGS = 'edit_settings',
}

export interface UserChatPermissions {
	id: number;

	chat_id: number;

	chats: Chat[];

	user_id: number;

	users: User[];

	permission: permissionsEnum;
}

export interface SingleMessage {
	id: number;

	sender?: User;

	user_id: number;
	chat_id: number;
	content: string;

	created_at: Date;
	updated_at?: Date;
}

export interface NewMessage {
	sender_id: number;
	chat: number;
	content: string;
}

export type ChatVisibility = 'public' | 'private';

export interface Chat {
	id: number;
	name: string;

	has_users: UserChatPermissions[];
	users: User;

	visibility: ChatVisibility;
	password: string;

	messages: SingleMessage[];
}

export interface Chat_Member {
	id: number;
	name: string;
	avatar?: string;
	permissions: permissionsEnum[];
}

export type Chat_Type = 'dm' | 'channel';

export interface Chat_List_Item {
	id: number;
	name: string;
	type: Chat_Type;
	users: Chat_Member[];
}

export interface Chat_List {
	name: string;
	type: Chat_Type;
	items: Chat_List_Item[];
}

export interface CreateNewChannelForm {
	name: string;
	visibility: ChatVisibility;
	password: string;
	confirm_password: string;
	type: Chat_Type;
	users: number[];
}