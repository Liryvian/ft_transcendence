<template>
	<div class="table_row">
		<div class="table_cell table_left">
			{{ player_left }} {{ player_left_score }}
		</div>
		<div class="table_cell table_right table_extra">
			{{ player_right_score }} {{ player_right }}
			<router-link :to="{ name: 'pong' }"> [watch game] </router-link>
		</div>
	</div>
</template>

<script lang="ts">
import type { Game } from '@/types/game.fe';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
	name: 'ActiveGameRow',
	props: {
		player_left: String,
		player_left_score: Number,
		player_right: String,
		player_right_score: Number,
		game_id: Number,
	},
});
</script>
