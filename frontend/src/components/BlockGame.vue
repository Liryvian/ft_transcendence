<template>
	<div>
		<canvas ref="game" width="800" height="480" style="border: 1px solid black">
		</canvas>
	</div>
</template>

<script>
import io from 'socket.io-client';
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
		this.socket = io('http://localhost:8080/pong');
	},
	mounted() {
		this.context = this.$refs.game.getContext('2d');
	},
};
</script>
