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

	customization: string;
	is_active: boolean;

	created_at: Date;
	updated_at: Date;

	player_one: User;
	p1_score: number;
	player_two: User;
	p2_score: number;
}

export interface ElementPositions {
	playerOnePaddle: Paddle;
	playerTwoPaddle: Paddle;
	ball: Ball;
}

export interface GameRequest {
	id: number;
	user: User;

	created_at: Date;
	updated_at: Date;
}
