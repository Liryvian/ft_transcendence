import type { User } from './User';

export enum gameStates {
	ACTIVE = 'active',
	DONE = 'done',
	PENDING = 'pending',
}

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
	state: gameStates;

	created_at: Date;
	updated_at: Date;

	player_one: User;
	p1_score: number;
	player_two: User;
	p2_score: number;
}

export interface CreateGameForm {
	score_to_win: number;
	background_color: string;

	player_one: number;
	player_two: number;
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

const GameStatusEnum = Object.freeze({
	GAME_OVER: 0,
	POINT_OVER: 1,
	PLAYING: 2
})

export default GameStatusEnum;

