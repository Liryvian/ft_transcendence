<template>
	<div class="table_row">
		<div class="table_cell table_left" :class="{ green: leftIsWinner }">
			{{ player_left }} {{ player_left_score }}
		</div>
		<div
			class="table_cell table_right table_extra"
			:class="{ green: rightIsWinner }"
		>
			{{ player_right_score }} {{ player_right }}
			<router-link
				v-if="watchable"
				:to="{ name: 'pong', params: { currentGameId: game_id } }"
			>
				[watch game]
			</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ActiveGameRow',
	props: {
		player_left: String,
		player_left_score: {
			type: Number,
			required: true,
		},
		player_right: String,
		player_right_score: {
			type: Number,
			required: true,
		},
		game_id: Number,
		watchable: {
			type: Boolean,
			default: true,
		},
	},
	computed: {
		leftIsWinner() {
			return (
				!this.watchable &&
				this.player_left_score > this.player_right_score
			);
		},
		rightIsWinner() {
			return (
				!this.watchable &&
				this.player_right_score > this.player_left_score
			);
		},
	},
});
</script>

<style scoped>
.green {
	color: green;
}
</style>
