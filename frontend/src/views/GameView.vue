<template>
	<div >

		<div class="page_box_wrapper">
			<div>Renoster</div>
			<div>Aardwolf</div>
				<div class="page_box">
					<div class="gameHeader  space-between">
						<p class="playerOneSore"> 5 </p>
						<p class="pongHeader">PONG</p>
						<p class="playerTwoScore"> 3 </p>
					</div>
					<!-- <div class="centerLine"></div> -->
					<canvas ref="GameRef" id="GameCanvas" class="gameBlock" width="1200"  height="960">
					</canvas>

				</div>
		</div>
	</div>
</template>

<!--  THIS SCRIPT IS ONLY TO SHOW A WORKING GAME STORE SETUP-->
<script lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { defineComponent, onMounted } from 'vue';

interface DataObject {
	context: CanvasRenderingContext2D
}

export default defineComponent({
	name: "GameView",

	data(): DataObject {
		return {
			context: {} as CanvasRenderingContext2D
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
			const startingX: number = this.width / 2 - 100;
			const startingY: number = this.height / 2 - 100;
			const radius: number = 15;
			const startAngle: number = 0;
			const endAngle: number = Math.PI * 2; // full circle
			// const 
			this.context.arc(
				startingX,
				startingY,
				radius,
				startAngle,
				endAngle,
				)
				this.context.fill()
			},
				
		// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillRect
		drawPaddles() {
			let widthStart: number = 0;
			const lineWidth: number = 15;
			const lineHeight: number = this.height / 5; 
			const heightStart: number = this.height / 2 - (lineHeight / 2); // middle of the canvas

			this.context.fillRect(
				widthStart,
				heightStart,
				lineWidth,
				lineHeight
			)


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
	height: 70%;
	width: 80%;
	display: block;
	margin: auto;
}

/* .pongHeader {
	font-weight: bold;
	text-align: center;
}

.playerOne{
	font-weight: bold;
	text-align: left;
}

.playerTwo{
	font-weight: bold;
	text-align: right;
} */

.gameHeader{
	font-weight: bold;
	display: flex;
	font-size: 2.5vw;
	padding-left: 5%;
	padding-right: 5%;
	padding-top: 3%;
}

.gameHeader.space-around {
	justify-content: space-around;
}

.gameHeader.space-between {
	justify-content: space-between;
}

.centerLine {
border-left: 2px solid black;
  height: 63%;
  position: absolute;
  left: 50%;
  top: 10;
}
</style>