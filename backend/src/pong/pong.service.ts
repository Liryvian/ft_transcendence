import { Injectable } from '@nestjs/common';
import { Ball, GameState, MovementKeys, Paddle, Position } from './Game.types';

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
				y: 960
			}
		};
		return newGameState;
	}

	hitsWall(radius: number, pos: number, direction: number): boolean {
		return (
			pos + direction + this.offset > 100 - radius ||
			pos + direction < radius + this.offset
		);
	}

	collisionDetection(ball: Ball, rect: Paddle) {
		var distX = Math.abs(ball.position.x - this.dx - rect.position.x - rect.width / 2);
		var distY = Math.abs(ball.position.y - rect.position.y - rect.height / 2);
	  
		if (distX >= (rect.width / 2 + this.ballRadius - this.dx)) {
		  return false;
		}
		if (distY > (rect.height / 2 + this.ballRadius)) {
		  return false;
		}
	  
		if (distX <= rect.width / 2) {
		  return true;
		}
		if (distY <= rect.height / 2) {
		  return true;
		}
	  }
	
	Option2collisionDetection(ball: Ball, rect: Paddle, canvas: Position)
	{
		// rect.position.x + rect.height + ball.radius
		const playerx = canvas.x / 100 * ball.position.x ;
		const playery = canvas.y / 100 * ball.position.y;
		const playerr = canvas.x / 100 * ball.radius;
		const rectw = canvas.x / 100 * rect.width;
		const recth = canvas.y / 100 * rect.height;
		const rectx = canvas.x / 100 * rect.position.x;
		const recty = canvas.y / 100 * rect.position.y;
		if(playerx > (rectx - playerr) && playerx < (rectx + rectw + playerr)
		 && playery >  (recty - playerr) && playery < recty + recth + playerr)
		return true;
	}

	Option3collisionDetection(ball: Ball, rect: Paddle, canvas: Position) {
		// const paddleX = rect.position.x;
		const paddleY = rect.position.y;
		const paddleHeight = rect.height;
		// radius, ballPos.x, this.dx)
		if (this.hitsWall(Math.abs(this.ballRadius + (this.paddleWidth / 2)), ball.position.x, this.dx)) {
			// console.log("About to hit wall: ")
			// console.log("Ball Y: ", ball.position.y)
			// console.log("Paddle y: ", rect.position.y)
			// console.log("Paddle height: ", rect.height)
			if (ball.position.y > paddleY - (paddleHeight / 2) && ball.position.y < Math.abs(paddleY + (paddleHeight / 2))) {
				return true;
			}
		}

		return false;
	}

	// moves ball dy(directioY) / x(directionX)%
	// if ball hits a wall the directiion (dx /dy) reverses
	moveBall(gameState: GameState) {
		const radius = 1;
		const ballPos: Position = gameState.ball.position;
		const paddleP1: Paddle = gameState.playerOnePaddle;

		if (this.Option3collisionDetection(gameState.ball, paddleP1, gameState.canvas)) {
			console.log("Collision Paddle one");
			const paddleCenter = paddleP1.position.y + (paddleP1.height / 2);
			const d = paddleCenter - ballPos.y;
			// this.dx += d * -0.01;
			// console.log("dx:", this.dx)
			// console.log("d * -0.01:", d, 0.01, d * 0.001,);
			this.dx = -this.dx;
			this.dy += d * -0.01
			gameState.playerOnePaddle.width += 10;
		} else if(this.Option3collisionDetection(gameState.ball, gameState.playerTwoPaddle, gameState.canvas)) {
			console.log("Collision Paddle two");
			const paddleCenter = paddleP1.position.y + (paddleP1.height / 2);
			const d = paddleCenter - ballPos.y;
			// console.log("D:", d);
			// console.log("dx:", this.dx)
			// console.log("d * -0.01:", d, 0.01, d * 0.001,);
			// this.dx += d * -0.01;
			this.dx = -this.dx;
			this.dy -= d * -0.01
		} else if (this.hitsWall(radius, ballPos.x, this.dx)) {
			console.log("wall hit")
			this.dx = -this.dx;
		}
		// else if (ballPos.x + this.dx >=)
		if (this.hitsWall(radius, ballPos.y, this.dy)) {
			this.dy = -this.dy;
		}
		// var paddleCenter = paddle.y + (paddle.height/2);
		// var d = paddleCenter - ball.y;
		// ball.vy += d * - 0.1; // here's the trick

		ballPos.x += this.dx;
		ballPos.y += this.dy;
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
