<template>
	<div>
		<canvas
			tabindex="0"
			ref="game"
			width="800"
			height="480"
			style="border: 1px solid black"
			v-on:keyup.right="move('right')"
			v-on:keyup.left="move('left')"
			v-on:keyup.up="move('up')"
			v-on:keyup.down="move('down')"
		>
		</canvas>
		<!-- <p>
			<button v-on:click="move('right')">Right</button>
			<button v-on:click="move('left')">Left</button>
			<button v-on:click="move('up')">Up</button>
			<button v-on:click="move('down')">Down</button>
		</p> -->
	</div>
</template>

<script>
import io from 'socket.io-client';
var keyState = {};
export default {
	name: 'BlockGame',
	data() {
		return {
			socket: {},
			context: {},
			position: {
				x: 0,
				y: 0,
			},
		};
	},

	created() {
		console.log('Created()');
		this.socket = io('http://localhost:8080/pong');
		console.log('Created() done!');
		window.addEventListener('keyup', this.move);
	},
	mounted() {
		console.log('Mounted()');
		this.context = this.$refs.game.getContext('2d');
		this.socket.on('position', (data) => {
			console.log('\n\nReceiving from backend: \n\n' + JSON.stringify(data));
			this.position = data;
			this.context.clearRect(
				0,
				0,
				this.$refs.game.width,
				this.$refs.game.height,
			);
			this.context.fillRect(this.position.x, this.position.y, 20, 20);
		});
		console.log('Mounted() done!');
	},
	methods: {
		positionChange() {
			console.log('Called');
			this.socket.emit('position', this.position);
		},

		move(event) {
			console.log(event.which);
			this.socket.emit('move', event.which);
		},
	},
};
</script>
