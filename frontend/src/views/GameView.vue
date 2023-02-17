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

interface DataObject {
	context: CanvasRenderingContext2D;
}

export default defineComponent({
	name: "GameView",
	components: {
		PlayerNames
	},

	data(): DataObject {
		return {
			context: {} as CanvasRenderingContext2D,
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
			const widthStart: number = this.width / 2;
			const heightStart: number = 0;
			const lineWidth: number = 4;
			const lineHeight: number = this.height;
			
			this.context.fillRect(
					widthStart,
					heightStart,
					lineWidth,
					lineHeight
				);
			},
			
		//  https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc
		drawBall() {
			const startingX: number = this.widthPercentage(40);
			const startingY: number = this.heightPercentage(65)
			const radius: number = 12;
			const startAngle: number = 0;
			const endAngle: number = Math.PI * 2; // full circle

			this.context.arc(
					startingX,
					startingY,
					radius,
					startAngle,
					endAngle,
			)
				// this fills the above defined arc/circle
				this.context.lineWidth = 4;
				this.context.stroke()
			},
				
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
		drawPaddles() {
			let widthStart: number = 0;
			const lineWidth: number = 15;
			const lineHeight: number = this.heightPercentage(12); 
			const heightStart: number = this.heightPercentage(50) - (lineHeight / 2); // middle of the canvas
			
			// Player 1
			this.context.fillRect(
				widthStart,
				heightStart,
				lineWidth,
				lineHeight
			)

			//  opposite side / right side
			// Player 2
			widthStart = this.width - lineWidth; 
			this.context.fillRect(
				widthStart,
				heightStart,
				lineWidth,
				lineHeight
			)
		}
	},

	mounted() {
		this.context = (this.$refs.GameRef as any).getContext('2d');
		this.drawMiddleLine();
		this.drawBall();
		this.drawPaddles();
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