<template>
	<div>
		<!-- The "tabindex" centers the element, the canvas in this case, by default-->
		<canvas
			tabindex="0"
			ref="game"
			width="800"
			height="480"
			style="border: 1px solid black"
		>
		</canvas>
	</div>
</template>

<script lang="ts">
import { io, Socket } from 'socket.io-client';
import { ref } from 'vue';

//  Creating intefaces for data object, because typescript
interface Position {
	x: number;
	y: number;
}

interface GameData {
	socket: Socket;
	position: Position;
	context: CanvasRenderingContext2D | null;
}

export default {
	name: 'BlockGame',
	data(): GameData {
		return {
			socket: io('http://localhost:8080/pong'),
			context: null,
			position: {
				x: 0,
				y: 0,
			},
		};
	},

	//
	computed: {
		// typescript wants values used from html to have a type
		width() {
			return (this.$refs.game as HTMLCanvasElement).width;
		},

		height() {
			return (this.$refs.game as HTMLCanvasElement).height;
		},
	},

	created() {
		//  adds listener to page so key presses will move game objects by default
		window.addEventListener('keyup', this.move);
	},
	mounted() {
		this.context = (this.$refs.game as any).getContext('2d');

		// Listens for the "position emit from the pong.gateway"
		this.socket.on('position', (data) => {
			console.log('\n\nReceiving from backend: \n\n' + JSON.stringify(data));
			this.position = data;
			// Question mark checks if ths.context is not null
			// Supresses ts "Object is possibly null" error
			this.context?.clearRect(0, 0, this.width, this.height);
			this.context?.fillRect(this.position.x, this.position.y, 20, 20);
		});
	},
	methods: {
		// sends an emit with specific key pressed to backend
		move(keyPress: KeyboardEvent) {
			this.socket.emit('move', keyPress.key);
		},
	},
};
</script>
