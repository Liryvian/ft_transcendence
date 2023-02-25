import type { User } from './User';

export interface Position {
	x: number;
	y: number;
}

export interface Paddle {
	position: Position;
	width: number;
	height: number;
}

export interface Ball {
	position: Position;
	radius: number;
}


export interface Game {
	id: number;

	score_player_one: number;
	score_player_two: number;

	score_to_win: number;
	background_color: string;
	is_active: boolean;

	created_at: Date;
	updated_at: Date;

	player_one: User;
	player_two: User;
}

export interface CreateGameForm {
	score_to_win: number,
	background_color: string,

	player_one: number,
	player_two: number,
}

export interface ElementPositions {
	playerOnePaddle: Paddle;
	playerTwoPaddle: Paddle;
	ball: Ball;
}

// export interface GameRequest {
// 	id: number;
// 	user: User;
//
// 	created_at: Date;
// 	updated_at: Date;
// }

