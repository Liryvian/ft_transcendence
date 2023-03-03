export class Position {
	x: number;
	y: number;
}

export class Paddle {
	position: Position;
	width: number;
	height: number;
}

export class Ball {
	position: Position;
	radius: number;
}

export interface GameState {
	gameId: number;
	playerOneId: number;
	playerTwoId: number;
	playerOnePaddle: Paddle;
	playerTwoPaddle: Paddle;
	ball: Ball;
	canvas: Position;
	scoreToWin: number;
	scorePlayerOne: number;
	scorePlayerTwo: number;
	roomName: string;
	isPressed: MovementKeys;
	pointIsover: boolean;
	gameIsOver: boolean;
	playerOneIsInGame: boolean;
	playerTwoIsInGame: boolean;
}

export interface MovementKeys {
	w: boolean;
	s: boolean;
}
