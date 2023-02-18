import { Injectable } from '@nestjs/common';
import { Ball, GameState, MovementKeys, Paddle } from './Game.types';

// interface GameState {
// 	playerOnePaddle: Paddle;
// 	playerTwoPaddle: Paddle;
// 	ball: Ball;
// }

// interface MovementKeys {
// 	ArrowUp: boolean;
// 	ArrowDown: boolean;
// 	w: boolean;
// 	s: boolean;
// }

@Injectable()
export class PongService {

	private readonly offset = 0.05;

	private readonly paddleWidth = 1;
	private readonly paddleHeight = 12;

	private readonly ballRadius = 1;

	// ball direction %
	private dx = 0.4;
	private dy = 0.4;

	createNewGameState(): GameState {
		const newGameState: GameState = {
			playerOnePaddle: {
				position: {
					x: 0,
					y: 50,
				},
				width: this.paddleWidth,
				height: this.paddleHeight,
			},
	
			playerTwoPaddle: {
				position: {
					x: 100,
					y: 50,
				},
				width: this.paddleWidth,
				height: this.paddleHeight,
			},
	
			ball: {
				position: {
					x: 40,
					y: 65,
				},
				radius: this.ballRadius,
			},
		};
		return newGameState;
	}

	hitsWall(radius: number, pos: number, direction: number): boolean {
		return (
			pos + direction + this.offset > 100 - radius ||
			pos + direction < radius + this.offset
		);
	}

	// moves ball dy(directioY) / x(directionX)%
	// if ball hits a wall the directiion (dx /dy) reverses
	moveBall(ball: Ball) {
		const radius = 1;

		if (this.hitsWall(radius, ball.position.x, this.dx)) {
			this.dx = -this.dx;
		}
		if (this.hitsWall(radius, ball.position.y, this.dy)) {
			this.dy = -this.dy;
		}
		ball.position.x += this.dx;
		ball.position.y += this.dy;
	}

	// checks if paddle is at max x/y otherwise move it 1% up/down
	movePaddles(pressedKey: MovementKeys, playerOnePaddle: Paddle, playerTwoPaddle: Paddle) {
		if (pressedKey.ArrowUp) {
			if (playerTwoPaddle.position.y <= 5) {
				playerTwoPaddle.position.y = 5;
			} else {
				playerTwoPaddle.position.y -= 1;
			}
		}
		if (pressedKey.ArrowDown) {
			if (playerTwoPaddle.position.y >= 95) {
				playerTwoPaddle.position.y = 95;
			} else {
				playerTwoPaddle.position.y += 1;
			}
		}
		if (pressedKey.w) {
			if (playerOnePaddle.position.y <= 5) {
				playerOnePaddle.position.y = 5;
			} else {
				playerOnePaddle.position.y -= 1;
			}
		}
		if (pressedKey.s) {
			if (playerOnePaddle.position.y >= 95) {
				playerOnePaddle.position.y = 95;
			} else {
				playerOnePaddle.position.y += 1;
			}
		}
	}
}
