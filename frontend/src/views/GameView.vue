<template>
	<div>
		<div class="page_box_wrapper">
			<div class="page_box">
				<h1>Games Overview</h1>
				<h2>ACTIVE GAMES</h2>
				<div class="table c_block">
					<div class="line"></div>
					<template v-for="game in allGames">
						<ActiveGameRow
							v-if="game.state === 'active'"
							:player_left="game.player_one.name"
							:player_left_score="game.score_player_one"
							:player_right="game.player_two.name"
							:player_right_score="game.score_player_two"
							:game_id="game.id"
						/>
					</template>
				</div>

				<h2>PAST GAMES</h2>
				<div class="table c_block">
					<div class="line"></div>
					<template v-for="game in allGames">
						<ActiveGameRow
							v-if="game.state === 'done'"
							:player_left="game.player_one.name"
							:player_left_score="game.score_player_one"
							:player_right="game.player_two.name"
							:player_right_score="game.score_player_two"
							:game_id="game.id"
							:watchable="false"
						/>
					</template>
				</div>
			</div>
			<corner-button
				link_text="RULES"
				link_target="/game-rules"
				position="pb_top"
			/>

		</div>
	</div>
</template>

<script lang="ts">
import { useGameStore } from '@/stores/gameStore';
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';
import PlayerNames from '@/components/game-info/PlayerNames.vue';
import ActiveGameRow from '@/components/pongGame/ActiveGameRow.vue';
import CornerButton from '@/components/buttons/CornerButton.vue';

export default defineComponent({
	name: 'GameView',
	components: {
		PlayerNames,
		ActiveGameRow,
		CornerButton,
	},
	setup() {
		const gameStore = useGameStore();
		gameStore.refreshAllGames();
		const { allGames } = storeToRefs(gameStore);
		return {
			allGames,
		};
	},
});
</script>
