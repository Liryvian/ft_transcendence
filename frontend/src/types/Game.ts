import type { User } from "./User";

export interface Game {
    id: number;

    score_player_one: number;
    score_player_two: number;

    customization: string;
    is_active: boolean;

    created_at: Date;
    updated_at: Date;

    player_one: User
    player_two: User
}


export interface GameRequest {
	id: number;
	user: User;
	
    created_at: Date;
	updated_at: Date;
}