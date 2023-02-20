import { Injectable } from '@nestjs/common';
import { Ball, GameState, MovementKeys, Paddle, Position } from './Game.types';

@Injectable()
export class PongService {
	private readonly paddleWidth = 1;
	private readonly paddleHeight = 12;

	private readonly ballRadius = 1;

	// ball direction and speed %
	private dx = -0.4;
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
			canvas: {
				x: 1200,
				y: 960,
			},
		};
		return newGameState;
	}

	doesHitWall(radius: number, pos: number, direction: number): boolean {
		const fullHeigthOrWidth = 100;
		return (
			pos + direction > fullHeigthOrWidth - radius || pos + direction < radius
		);
	}

	doesHitPaddle(ball: Ball, rect: Paddle, canvas: Position) {
		const paddleY = rect.position.y;
		const paddleHeight = rect.height;
		const paddleTop = paddleY - paddleHeight / 2;
		const paddleBottom = paddleY + paddleHeight / 2;
		const magicOffset = 0.2;
		const paddleWall = ball.radius - magicOffset + this.paddleWidth / 2;

		// if ball will hit the invisible wall that extends from the paddle
		// and ball position is within the paddle top and bottom
		// console.log(paddleWall);
		if (
			this.doesHitWall(paddleWall, ball.position.x, this.dx) &&
			ball.position.y > paddleTop &&
			ball.position.y < paddleBottom
		) {
			return true;
		}

		return false;
	}

	// moves ball dy(directioY) / x(directionX)%
	// if ball hits a wall the directiion (dx /dy) reverses
	// with game logic implemented, hitting the y axis-wall would be a point
	moveBall(gameState: GameState) {
		const radius = gameState.ball.radius;
		const ballPos: Position = gameState.ball.position;
		const paddleP1: Paddle = gameState.playerOnePaddle;
		const paddleP2: Paddle = gameState.playerTwoPaddle;

		//  check collision for paddle one
		if (this.doesHitPaddle(gameState.ball, paddleP1, gameState.canvas)) {
			console.log('Collision Paddle one');
			const paddleCenter = paddleP1.position.y + paddleP1.height / 2;
			const d = paddleCenter - ballPos.y;
			//  speed up the ball
			this.dx = -(this.dx - 0.02);
			// change bounce angle
			this.dy -= d * -0.01;
			// check collision for paddle two
			// DRY I know but
		} else if (this.doesHitPaddle(gameState.ball, paddleP2, gameState.canvas)) {
			console.log('Collision Paddle two');
			const paddleCenter = paddleP2.position.y + paddleP2.height / 2;
			const d = paddleCenter - ballPos.y;
			// speed up ball
			this.dx = -(this.dx + 0.02);
			//  change bounce angle
			this.dy += d * -0.01;
		} else if (this.doesHitWall(radius, ballPos.x, this.dx)) {
			console.log('Wall hit');
			this.dx = -this.dx;
		}

		// checks wall hit top or bottom
		if (this.doesHitWall(radius, ballPos.y, this.dy)) {
			this.dy = -this.dy;
		}
		ballPos.x += this.dx;
		ballPos.y += this.dy;
	}

	// checks if paddle is at max x/y otherwise move it 1% up/down
	movePaddles(
		pressedKey: MovementKeys,
		playerOnePaddle: Paddle,
		playerTwoPaddle: Paddle,
	) {
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
