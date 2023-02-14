import type { Chat } from './Chat';
import type { Game, GameRequest } from './Game';
import type { Relationship } from './Relationship';

interface Achievement {
	name: string;
}

export interface RegisterForm {
	name: string;
	password: string;
	password_confirm: string;
}

export interface LoginForm {
	name: string;
    password: string
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
	avatar: string;

	matchmaking_request: GameRequest[];
	games: Game[];

	achievements: Achievement[];
	relationships: Relationship[];

	chats: Chat[];

    created_at: Date;
    updated_at: Date;
}
