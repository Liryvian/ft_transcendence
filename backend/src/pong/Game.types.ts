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
	playerOnePaddle: Paddle;
	playerTwoPaddle: Paddle;
	ball: Ball;
}

export interface MovementKeys {
	ArrowUp: boolean;
	ArrowDown: boolean;
	w: boolean;
	s: boolean;
}
