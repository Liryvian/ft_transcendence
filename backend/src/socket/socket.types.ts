export type Chat_Type = 'dm' | 'channel';
export type ActionType = 'new' | 'update' | 'delete';

export interface Chat_Member {
	id: number;
	name: string;
	avatar?: string;
}

export interface Chat_List_Item {
	id: number;
	name?: string;
	type?: Chat_Type;
	users?: Chat_Member[];
}

export interface SocketMessage<T> {
	action: ActionType;
	data: T;
}
