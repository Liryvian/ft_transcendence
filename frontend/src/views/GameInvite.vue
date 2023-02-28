<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>YOU'VE BEEN INVITED</h1>
			<h1>BY</h1>
			<h1>PLAYER_02</h1>
			<form
				method="Post"
				action=""
				class="c_block c_form_group"
				@submit.prevent="updateGame()"
			>
				<InputField
					label="score_to_win"
					:is_disabled="true"
				/>
				<InputField
					label="background_color"
					:is_disabled="true"
				/>
				<div class="page_button pb_bottom">
					<input type="submit" value="request" />
				</div>
				<div v-if="errors.length">
					<p v-for="error in errors" class="c_form--error">
						!! {{ error }}
					</p>
				</div>
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import InputField from '@/components/input-fields/InputField.vue';
import CornerButton from '@/components/buttons/CornerButton.vue';
import { useGameStore } from '@/stores/gameStore';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import type { UpdateGameState } from '@/types/game.fe';


export default defineComponent({
	name: 'GameInvite',
	components: {
		InputField,
		CornerButton,
		props: {
			game_id: { type: String, required: true },
		},
	},
	setup(props) {
		const userStore = useUserStore();
		useUserStore().refreshMe();
		const gameStore = useGameStore();
		useGameStore().refreshMyGames();
		const { errors } = storeToRefs(userStore);
		let updateGameState : UpdateGameState  = reactive({
			player_one: 0,
			player_two: 0,
			state: 1,
		});
		// const { errors } = storeToRefs(gameStore);
		// const {createGame } = gameStore;
	return {
		gameStore,
		errors,
		props,
	};
},
});
</script>

updateGameState
<style scoped></style>

