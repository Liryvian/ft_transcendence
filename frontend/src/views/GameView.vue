<template>
	<div >

		<div class="page_box_wrapper">
			<PlayerNames player_left="renoster" player_right="aardwolf" />

				<div class="page_box">
					<div class="gameHeader space-between">
						<p class="playerOneSore"> 5 </p>
						<p class="pongHeader">PONG</p>
						<p class="playerTwoScore"> 3 </p>
					</div>

					<canvas
					ref="GameRef"
					id="GameCanvas"
					class="gameBlock"
					width="1200"  
					height="960">
					</canvas>

				</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { defineComponent } from 'vue';
import PlayerNames from '@/components/game-info/PlayerNames.vue'
import type  { ElementPositions, Ball, Paddle }  from "@/types/Game"
import { io, Socket } from 'socket.io-client';

interface MovementKeys {
	ArrowUp: boolean;
	ArrowDown: boolean;
	w: boolean;
	s: boolean;
}

interface DataObject {
	context: CanvasRenderingContext2D;
	socket: Socket;
	isPressed: MovementKeys;
	gameLoopInterval: number;
	timeStampStart: DOMHighResTimeStamp;
	previousTimeStamp: DOMHighResTimeStamp;
	done: boolean;
}

export default defineComponent({
	name: "GameView",
	components: {
		PlayerNames
	},

	beforeRouteLeave(to, from, next) {
		this.done = true;
		this.socket.off("updatePosition", this.render);
		console.log("Game disconnected")
		next();
	},
	
	data(): DataObject {
		return {
			context: {} as CanvasRenderingContext2D,
			socket: io('http://localhost:8080/pong'),
			isPressed: {
				ArrowUp: false,
				ArrowDown: false,
				w: false,
				s: false,
			},
			gameLoopInterval: 0,
			timeStampStart: 0,
			previousTimeStamp: 0,
			done: false,
		}
	},

	setup(){
		const gameStore = useGameStore();
		gameStore.refreshData();
		return {
			gameStore,
		}
	},

 	computed: {
		// typescript wants values used from html to have a type
		width() {
			return (this.$refs.GameRef as HTMLCanvasElement).width;
		},
		height() {
			return (this.$refs.GameRef as HTMLCanvasElement).height;
		},
	},

	methods: {
		heightPercentage(percent: number): number {
			return this.height / 100 * percent;
		},
		widthPercentage(percent: number) {
			return this.width / 100 * percent;
		},
		
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
		drawMiddleLine() {
			const heightStart: number = 0;
			const lineWidth: number = this.widthPercentage(0.3);
			const widthStart: number = this.widthPercentage(50 - (lineWidth / 2))
			const lineHeight: number = this.heightPercentage(100);
			
			this.context.fillRect(
					widthStart,
					heightStart,
					lineWidth,
					lineHeight
				);
			},
			
		//  https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
		drawBall(ball: Ball) {
			const startingX: number = this.widthPercentage(ball.position.x);
			const startingY: number = this.heightPercentage(ball.position.y)
			const radius: number = this.widthPercentage(ball.radius);
			const startAngle: number = 0;
			const endAngle: number = Math.PI * 2; // full circle

			this.context.beginPath();
			this.context.arc(
					startingX,
					startingY,
					radius,
					startAngle,
					endAngle,
			)
				this.context.lineWidth = this.widthPercentage(0.3);
				this.context.stroke()
			},
				
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
		drawPaddle(paddle: Paddle) {
			const lineWidth: number = this.widthPercentage(1);
			const lineHeight: number = this.heightPercentage(12);
			const y: number = this.heightPercentage(paddle.position.y) - (lineHeight / 2); // middle of the canvas

			// Player 1
			let x = 0
			if (paddle.position.x === 100) {
				// Player 2
				x = this.width - lineWidth;
			}
			this.context.fillRect(
				x,
				y,
				lineWidth,
				lineHeight
			)
		},

		clearCanvas() {
			this.context.clearRect(0, 0, this.width, this.height)
		},

		render(elementPositions: ElementPositions) {
			this.clearCanvas();
			this.drawMiddleLine();
			this.drawPaddle(elementPositions.playerOnePaddle);
			this.drawPaddle(elementPositions.playerTwoPaddle);
			this.drawBall(elementPositions.ball);
		},
		
		keyDown(keyPress: KeyboardEvent) {
			if (this.isPressed[keyPress.key] !== undefined) {
				this.isPressed[keyPress.key] = true;
			}
			
		},
		
    	keyUp(keyPress: KeyboardEvent) {
			if (this.isPressed[keyPress.key] !== undefined) {
				this.isPressed[keyPress.key] = false;
      		}
		},

		// MAIN GAME LOOP
		getUpdatedPositions(timeStamp: DOMHighResTimeStamp) {
			if (this.previousTimeStamp === 0) {
				this.previousTimeStamp = timeStamp;
			}
			const elapsedTime = timeStamp - this.previousTimeStamp;
			const intervalMs = 10;
			// redraws after intervalMs
			if (elapsedTime > intervalMs) {
				this.previousTimeStamp = timeStamp;
				this.socket!.emit("updatePositions", this.isPressed)
			}

			if (!this.done) {
				window.requestAnimationFrame(this.getUpdatedPositions);
			}
			else {
				console.log("DONE")!
			}
		},
		
		startGameLoop() {
			window.requestAnimationFrame(this.getUpdatedPositions);
		}
	},
	
	mounted() {
		this.context = (this.$refs.GameRef as any).getContext('2d');
		document.addEventListener("keydown", this.keyDown);
		document.addEventListener("keyup", this.keyUp);
		
		this.socket.on("elementPositions", this.render);
		// MAIN GAME LOOP
		this.startGameLoop()
	},
})
</script> 

<style>
.gameBlock {
	height: 80%;
	width: 90%;
	display: block;
	margin: auto;
  	transform: translateY(5%);
}

.gameHeader{
	font-weight: bolder;
	display: flex;
	/* font size changes on window HEIGHT! */
	font-size: 2.5vh; 
	padding-left: 2.5%;
	padding-right: 5%;
	padding-top: 4%;
}

.gameHeader.space-between {
	justify-content: space-between;
}

</style>