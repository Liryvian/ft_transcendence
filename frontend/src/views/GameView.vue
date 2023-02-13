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
					<div class="centerLine"></div>
					<canvas ref="GameRef" id="GameCanvas" class="gameBlock">
					</canvas>

				</div>
		</div>
	</div>
</template>

<!--  THIS SCRIPT IS ONLY TO SHOW A WORKING GAME STORE SETUP-->
<script lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
	name: "GameView",

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

	mounted() {
		// var c = document.getElementById("GameCanvas");
		var ctx = (this.$refs.GameRef as any).getContext('2d');
		// c.getContext("2d");
		if (!ctx) {
			console.log("NO CONTEXT!!!");
		}
		else {
			console.log("Drawing!");
			// ctx.beginPath();
			// ctx.moveTo(this.width / 2 + 10, 0)
			// ctx.lineTo(this.width / 2 + 10, this.height);
			// // ctx.moveTo(0, 0);
			// ctx.lineWidth = 1;
			// ctx.strokeStyle = 'black';
			// ctx.stroke();
			// ctx.fill
		}

	}
})
</script> 

<style>
.gameBlock {
	height: 70%;
	width: 95%;
	display: block;
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