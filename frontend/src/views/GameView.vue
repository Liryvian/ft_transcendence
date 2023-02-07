<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>This is a game page</h1>
		</div>
		<p class="table table-striped table-sm">
			All Games:
			<tbody>
				<tr v-for="game in gameStore.allGames" :key="game.id">
					<td> Game id: {{ game.id }} </td>
					<td> Score player one: {{ game.score_player_one }} </td>
					<td> Score player two: {{ game.score_player_two }} </td>
					<td>Is active: {{ game.is_active }}</td>
				</tr>
				
			</tbody>

		</p>
		<p class="table table-striped table-sm">
			All My Games:
			<tbody>
				<tr v-for="game in gameStore.getMyGames" :key="game.id">
					<td>Game id: {{ game.id }}</td>
					<td>Score player one: {{ game.score_player_one }}</td>
					<td>Score player two: {{ game.score_player_two }}</td>
					<td>Is active: {{ game.is_active }}</td>
				</tr>
				
			</tbody>
			
		</p>
	</div>
</template>

<!--  THIS SCRIPT IS ONLY TO SHOW A WORKING GAME STORE SETUP-->
<script lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { defineComponent } from 'vue';

export default defineComponent({
	name: "GameView",

	setup(){
		const gameStore = useGameStore();
		gameStore.refreshData();
		return {
			gameStore,
		}
	}
})
</script>