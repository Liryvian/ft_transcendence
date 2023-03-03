import { Injectable } from '@nestjs/common';
import {
	Ball,
	GameState,
	MovementKeys,
	Paddle,
	Position,
} from './game.types.be';

// expects integers
function randomDirection(min: number, max: number) {
	let directionAndSpeed = Math.floor(Math.random() * (max - min)) + min;
	if (directionAndSpeed > -2 && directionAndSpeed < 2) {
		directionAndSpeed *= min;
	}
	return directionAndSpeed / 10;
}

@Injectable()
export class PongService {
	private readonly paddleWidth = 1;
	private readonly paddleHeight = 12;

	private readonly ballRadius = 1;

	private dy = randomDirection(-5, 5) || 0.3;
	private dx = randomDirection(-5, 5) || 0.3;

	public pointIsOver = false;
	public gameIsFinished = false;

	createNewGameState(): GameState {
		const newGameState: GameState = {
			gameId: -1,
			playerOneId: -1,
			playerTwoId: -1,
			playerOneIsInGame: false,
			playerTwoIsInGame: false,
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
					x: 50,
					y: 50,
				},
				radius: this.ballRadius,
			},
			canvas: {
				x: 1200,
				y: 960,
			},
			scoreToWin: 0,
			scorePlayerOne: 0,
			scorePlayerTwo: 0,
			roomName: '',
			isPressed: {
				w: false,
				s: false,
			},
			gameIsOver: false,
			pointIsover: false,
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
		const ballLineThicknessOffset = 0.2;
		const paddleWall =
			ball.radius - ballLineThicknessOffset + this.paddleWidth / 2;

		// if ball will hit the invisible wall that extends from the paddle
		// and ball position is within the paddle top and bottom
		if (
			this.doesHitWall(paddleWall, ball.position.x, this.dx) &&
			ball.position.y > paddleTop &&
			ball.position.y < paddleBottom &&
			// check that ball hits the paddle on the same side
			Math.abs(ball.position.x - rect.position.x) < 2
		) {
			return true;
		}

		return false;
	}

	changeBallDirection(paddle: Paddle, ballY: number, sign: number) {
		const paddleCenter = paddle.position.y + paddle.height / 2;
		const d = paddleCenter - ballY;
		const changeInDx = 0.02 * sign;
		const changeInDy = 0.01 * sign;
		//  speed up the ball
		this.dx = -(this.dx + changeInDx);
		// change bounce angle
		this.dy -= d * changeInDy;
	}
	// moves ball dy(directioY) / x(directionX)%
	// if ball hits a wall the directiion (dx /dy) reverses
	// hitting the y axis-wall would be a point
	moveBall(gameState: GameState) {
		const radius = gameState.ball.radius;
		const ballPos: Position = gameState.ball.position;
		const paddleP1: Paddle = gameState.playerOnePaddle;
		const paddleP2: Paddle = gameState.playerTwoPaddle;
		const midWayPoint = 50;

		//  check collision for paddle one
		if (this.doesHitPaddle(gameState.ball, paddleP1, gameState.canvas)) {
			console.log('Collision Paddle one');
			this.changeBallDirection(paddleP1, gameState.ball.position.y, -1);
		} else if (this.doesHitPaddle(gameState.ball, paddleP2, gameState.canvas)) {
			console.log('Collision Paddle two');
			this.changeBallDirection(paddleP2, gameState.ball.position.y, 1);
		} else if (this.doesHitWall(radius, ballPos.x, this.dx)) {
			//  check which side the ball hit to decide who the winner is
			ballPos.x > midWayPoint
				? ++gameState.scorePlayerOne
				: ++gameState.scorePlayerTwo;
			this.pointIsOver = true;
			if (
				gameState.scorePlayerOne >= gameState.scoreToWin ||
				gameState.scorePlayerTwo >= gameState.scoreToWin
			) {
				console.log('Setting game is finsished');
				this.gameIsFinished = true;
			}
			this.resetBallPosition(gameState.ball);
			this.dx = -this.dx;
		}

		// checks wall hit top or bottom
		if (this.doesHitWall(radius, ballPos.y, this.dy)) {
			this.dy = -this.dy;
		}
		ballPos.x += this.dx;
		ballPos.y += this.dy;
	}

	moveUp(paddlePosY: number) {
		const topMax = this.paddleHeight / 2;
		return Math.max(paddlePosY - 2, topMax);
	}

	moveDown(paddlePosY: number) {
		const bottomMax = 100 - this.paddleHeight / 2;
		return Math.min(paddlePosY + 2, bottomMax);
	}

	// checks if paddle is at max x/y otherwise move it 1% up/down
	movePaddles(
		pressedKey: MovementKeys,
		playerOnePaddle: Paddle,
		playerTwoPaddle: Paddle,
		isPressedByPlayerOne: boolean,
	) {
		if (isPressedByPlayerOne) {
			if (pressedKey.w) {
				playerOnePaddle.position.y = this.moveUp(playerOnePaddle.position.y);
			}
			if (pressedKey.s) {
				playerOnePaddle.position.y = this.moveDown(playerOnePaddle.position.y);
			}
		} else {
			if (pressedKey.w) {
				playerTwoPaddle.position.y = this.moveUp(playerTwoPaddle.position.y);
			}
			if (pressedKey.s) {
				playerTwoPaddle.position.y = this.moveDown(playerTwoPaddle.position.y);
			}
		}
	}

	resetBallPosition(ball: Ball) {
		ball.position = {
			x: 50,
			y: 50,
		};
		this.dx = randomDirection(-4, 4) || 0.3;
		this.dy = randomDirection(-4, 4) || 0.3;
	}

	startGame() {
		// window.re
	}
}
