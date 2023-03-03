<template>
	<div class="">{{ player_left }} {{ player_left_score }}</div>
    <!-- MIDDLE LINE HERE -->
	<div class="">{{ player_right }} {{ player_right_score }}</div>

    <router-link :to="{name: 'pong'}"> [watch game]</router-link>
</template>

<script lang="ts">
import type { Game } from "@/types/game.fe";
import {defineComponent, type PropType} from "vue";

export default defineComponent({
	name: 'ActiveGameRow',
	props: {
		player_left: String,
        player_left_score: Number,
		player_right: String,
        player_right_score: Number,
        game_id: Number
	},
});
</script>

<style scoped>

.lefty {
	position: absolute;
	left: 25%;
	top: 50%;
	/* writing-mode: vertical-lr; */
	/* text-orientation: mixed; */
	/* color: rgb(120, 117, 117); */
}

.righty {
	text-align: right;
	left: auto;
	right: 25%;
}
</style>