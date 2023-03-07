<template>
	<div>
		<div class="page_box_wrapper">
			<PlayerNames
				:player_left="getPlayerOne?.name ?? 'Player One'"
				:player_right="getPlayerTwo?.name ?? 'Player Two'"
			/>

			<div class="page_box">
				<div class="gameHeader space-between">
					<p class="playerOneSore">{{ score_player_one }}</p>
					<p class="pongHeader">PONG</p>
					<p class="playerTwoScore">{{ score_player_two }}</p>
				</div>

				<canvas
					ref="GameRef"
					id="GameCanvas"
					class="gameBlock"
					width="1200"
					height="960"
				>
				</canvas>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { defineComponent, ref, type Ref } from 'vue';
import PlayerNames from '@/components/game-info/PlayerNames.vue';
import type { ElementPositions, Ball, Paddle, Game } from '@/types/game.fe';
import GameStatusEnum from '@/types/game.fe';
import { io, type Socket } from 'socket.io-client';
import { storeToRefs } from 'pinia';
import router from '@/router';
import { patchRequest } from '@/utils/apiRequests';
import { useUserStore } from '@/stores/userStore';
import type { NavigationGuardNext } from 'vue-router';

interface DataObject {
	context: CanvasRenderingContext2D;
	socket: Socket;
	currentGame: Game;
}

type ValidKeys = 'w' | 's';

export default defineComponent({
	name: 'GameView',
	components: {
		PlayerNames,
	},
	props: {
		currentGameId: {
			type: String,
			required: true,
		},
	},

	beforeRouteLeave(to, from, next: NavigationGuardNext) {
		void to;
		void from;
		if (
			this.gameStatus !== GameStatusEnum.GAME_OVER &&
			(this.isPlayerOne || this.isPlayerTwo)
		) {
			this.socket.emit('PlayerDisconnected', from.params.currentGameId);
			this.finishGame();
		} else {
			this.socket.disconnect();
		}
		next();
	},

	data(): DataObject {
		return {
			context: {} as CanvasRenderingContext2D,
			socket: io('http://localhost:8080/pong', { withCredentials: true }),
			currentGame: {} as Game,
		};
	},

	setup(props: any) {
		const userStore = useUserStore();
		userStore.refreshMe();
		const { me } = storeToRefs(userStore);
		const gameStore = useGameStore();
		gameStore.refreshAllGames();
		setTimeout(() => {}, 1000);
		const {
			allGames,
			isPressed,
			previousTimeStamp,
			score_player_one,
			score_player_two,
			gameStatus,
		} = storeToRefs(gameStore);
		let currentGame = allGames.value.find(
			(game) => game.id === Number(props.currentGameId),
		);
		if (!currentGame) {
			currentGame = allGames.value.find(
				(game) =>
					(game.state === 'pending' &&
						game.player_one.id === me.value.id) ||
					game.player_two.id === me.value.id,
			);
		}
		return {
			me,
			gameStore,
			allGames,
			isPressed,
			previousTimeStamp,
			score_player_one,
			score_player_two,
			gameStatus,
			currentGame,
		};
	},

	computed: {
		// typescript wants values used from html to have a type
		width(): number {
			return (this.$refs.GameRef as HTMLCanvasElement).width;
		},
		height(): number {
			return (this.$refs.GameRef as HTMLCanvasElement).height;
		},
		currentgameId(): number {
			return this.currentGame!.id;
		},
		getCurrentGame() {
			if (!this.currentGame) {
				this.currentGame = this.allGames.find(
					(game) =>
						(game.state === 'pending' &&
							game.player_one.id === this.me.value.id) ||
						game.player_two.id === this.me.value.id,
				);
			}
			console.log('CurGame: ', this.currentGame);
			return this.currentGame;
		},
		getPlayerOne() {
			return this.getCurrentGame?.player_one;
		},
		getPlayerTwo() {
			return this.getCurrentGame?.player_two;
		},
		getMyId() {
			return useUserStore().me.id;
		},
		isPlayerOne() {
			return this.getPlayerOne.id === this.me.id;
		},
		isPlayerTwo() {
			return this.getPlayerTwo.id === this.me.id;
		},
		isPlayer() {
			return (this.isPlayerOne || this.isPlayerTwo) ?? false;
		},
	},

	methods: {
		heightPercentage(percent: number): number {
			return (this.height / 100) * percent;
		},
		widthPercentage(percent: number) {
			return (this.width / 100) * percent;
		},

		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
		drawMiddleLine() {
			const heightStart: number = 0;
			const lineWidth: number = this.widthPercentage(0.3);
			const widthStart: number = this.widthPercentage(50 - lineWidth / 2);
			const lineHeight: number = this.heightPercentage(100);

			this.context.fillRect(
				widthStart,
				heightStart,
				lineWidth,
				lineHeight,
			);
		},

		//  https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
		drawBall(ball: Ball) {
			const startingX: number = this.widthPercentage(ball.position.x);
			const startingY: number = this.heightPercentage(ball.position.y);
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
			);
			this.context.lineWidth = this.widthPercentage(0.3);
			this.context.stroke();
		},

		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
		drawPaddle(paddle: Paddle) {
			const lineWidth: number = this.widthPercentage(1);
			const lineHeight: number = this.heightPercentage(12);
			const y: number =
				this.heightPercentage(paddle.position.y) - lineHeight / 2; // middle of the canvas

			let x = 0;
			if (paddle.position.x === 100) {
				x = this.width - lineWidth;
			}
			this.context.fillRect(x, y, lineWidth, lineHeight);
		},

		clearCanvas() {
			this.context.clearRect(0, 0, this.width, this.height);
		},

		render(elementPositions: ElementPositions) {
			this.clearCanvas();
			this.drawMiddleLine();
			this.drawPaddle(elementPositions.playerOnePaddle);
			this.drawPaddle(elementPositions.playerTwoPaddle);
			this.drawBall(elementPositions.ball);
		},

		emitKeyStateUpdate() {
			this.socket!.emit('keyStateUpdate', {
				id: this.currentGameId,
				keyPress: this.isPressed,
				userId: this.me.id,
			});
		},

		keyDown(keyPress: KeyboardEvent) {
			if (this.isPressed[keyPress.key as ValidKeys] !== undefined) {
				this.isPressed[keyPress.key as ValidKeys] = true;
				this.emitKeyStateUpdate();
			}
		},

		keyUp(keyPress: KeyboardEvent) {
			if (this.isPressed[keyPress.key as ValidKeys] !== undefined) {
				this.isPressed[keyPress.key as ValidKeys] = false;
				this.emitKeyStateUpdate();
			}
		},

		resetPressedKeys() {
			this.isPressed.w = false;
			this.isPressed.s = false;
		},

		// MAIN GAME LOOP
		getUpdatedPositions(timeStamp: DOMHighResTimeStamp) {
			if (this.previousTimeStamp === 0) {
				this.previousTimeStamp = timeStamp;
			}
			const elapsedTime = timeStamp - this.previousTimeStamp;
			const intervalMs = 10; // refresh rate of a browser is 1/60th of a sec (17)
			// redraws after intervalMs
			if (elapsedTime > intervalMs && this.isPlayer) {
				this.previousTimeStamp = timeStamp;
				this.socket!.emit('updatePositions', {
					id: this.currentgameId,
					keyPress: this.isPressed,
					userId: this.me.id,
				});
			}

			if (this.gameStatus === GameStatusEnum.PLAYING) {
				window.requestAnimationFrame(this.getUpdatedPositions);
			} else if (this.gameStatus === GameStatusEnum.POINT_OVER) {
				// update scores

				this.gameStatus = GameStatusEnum.PLAYING;
				this.resetPressedKeys();

				// restart game loop
				window.requestAnimationFrame(this.getUpdatedPositions);
			}
			//  else game is over
		},

		startGameLoop() {
			window.requestAnimationFrame(this.getUpdatedPositions);
		},

		finishGame() {
			const updateGameDto = {
				score_player_one: this.score_player_one,
				score_player_two: this.score_player_two,
				state: 'done',
			};
			this.gameStatus = GameStatusEnum.GAME_OVER;
			this.socket.disconnect();
			// patch game in database with the updated scores
			patchRequest(`games/${this.currentgameId}`, updateGameDto);
			if (this.score_player_one === this.score_player_two) {
				alert(`Game over!\nIt's a draw, boooooring!`);
			} else {
				const winner: string | undefined =
					this.score_player_one > this.score_player_two
						? this.getPlayerOne?.name
						: this.getPlayerTwo?.name;
				alert(`Game over!\nWell done ${winner}!`);
			}
		},

		setSocketOn() {
			this.socket.on('elementPositions', this.render);
			this.socket.on(
				'pointOver',
				(scores: {
					scorePlayerOne: number;
					scorePlayerTwo: number;
				}) => {
					this.gameStatus = GameStatusEnum.POINT_OVER;
					this.score_player_one = scores.scorePlayerOne;
					this.score_player_two = scores.scorePlayerTwo;
				},
			);
			this.socket.on('gameOver', () => {
				router.push({ name: 'activeGames' });
			});
		},
	},

	mounted() {
		setTimeout(() => {
			this.context = (this.$refs.GameRef as any).getContext('2d');
			if (this.currentGame?.background_color) {
				document.getElementById('GameCanvas')!.style.backgroundColor =
					this.currentGame.background_color;
			}

			if (this.isPlayer) {
				document.addEventListener('keydown', this.keyDown);
				document.addEventListener('keyup', this.keyUp);
				this.socket.on('disconnect', () => {
					this.socket.emit('PlayerDisconnected', this.currentgameId);
				});
			}
			this.socket.emit('joinGameRoom', this.getCurrentGame);
			this.setSocketOn();

			// START MAIN GAME LOOP
			this.socket.once('GameCanStart', () => {
				const updateGameDto = {
					state: 'active',
				};
				try {
					patchRequest(`games/${this.currentgameId}`, updateGameDto);
				} catch (e) {}
				this.startGameLoop();
			});
		}, 100);
	},
});
</script>

<style>
.gameBlock {
	height: 80%;
	width: 90%;
	display: block;
	margin: auto;
	transform: translateY(5%);
}

.gameHeader {
	font-weight: bolder;
	display: flex;
	font-size: 2.5vh;
	padding-left: 2.5%;
	padding-right: 5%;
	padding-top: 2.4%;
}

.gameHeader.space-between {
	justify-content: space-between;
}
</style>
