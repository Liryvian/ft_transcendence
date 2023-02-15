import type { Chat } from './Chat';
import type { Game, GameRequest } from './Game';
import type { Relationship } from './Relationship';

export interface Achievement {
	id: number;
	name: string;
}

export interface RegisterForm {
	name: string;
	password: string;
	password_confirm: string;
}

export interface LoginForm {
	name: string;
	password: string;
}

export interface User {
	id: number;
	name: string;

	is_intra: boolean;
	intra_id: number;
	avatar: string;

	matchmaking_request: GameRequest[];
	games: Game[];

	achievements: Achievement[];
	relationships: Relationship[];

	chats: Chat[];

	created_at: Date;
	updated_at: Date;
}
