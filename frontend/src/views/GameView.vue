<template>
	<div>
		<div class="page_box_wrapper">
			<div class="page_box">
				<h1>This is the list of games view</h1>
					<template v-for="game in allGames">
						<ActiveGameRow v-if="game.state === 'active'"
							:player_left="game.player_one.name"
							:player_left_score="game.score_player_one"
							:player_right="game.player_two.name"
							:player_right_score="game.score_player_two"
							:game_id="game.id"
						/>
					</template>
				<router-link to="/pong/3">Go to /pong/3</router-link>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';
import PlayerNames from '@/components/game-info/PlayerNames.vue';
import ActiveGameRow from '@/components/pongGame/ActiveGameRow.vue'


export default defineComponent({
	name: 'GameView',
	components: {
		PlayerNames,
		ActiveGameRow
	},
	setup(){
		const gameStore = useGameStore();
		gameStore.refreshAllGames()
		const { allGames } = storeToRefs(gameStore);
		return {
			allGames
		}

	}
});
</script>

<style scoped>
.vl {
	padding-top: 20%;
  	border-left: 3px solid black;
  	height: 500px;
  	position: absolute;
  	left: 50%;
  	margin-left: -3px;
  	top: 0;
}

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
