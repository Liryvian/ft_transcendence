import type { Chat } from './Chat';
import type { Game, GameRequest } from './game.fe';
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

export interface UpdateProfileForm {
	name: string;
	new_password?: string;
	new_password_confirm?: string;
	password?: string;
}

export interface LoginForm {
	name: string;
	password: string;
}

export interface UserRelationsQuery {
	matchmaking_request?: boolean;
	invite?: boolean;
	games_as_player_one?: boolean;
	games_as_player_two?: boolean;
	relationshipTarget?: boolean;
	relationshipSource?: boolean;
	achievements?: boolean;
	in_chats?: boolean;
}

export interface User {
	id: number;
	name: string;

	is_intra: boolean;
	intra_id: number;
	intra_login: string;
	avatar: string;

	matchmaking_request: GameRequest[];
	games: Game[];

	achievements: Achievement[];
	relationships: Relationship[];

	chats: Chat[];

	two_factor_required: boolean;

	created_at: Date;
	updated_at: Date;
}
