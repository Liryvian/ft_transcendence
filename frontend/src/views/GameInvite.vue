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
			<div class="c_block c_form_group">
				<div class="c_field_group">
					<InputField label="score_to_win" id="disabled_field" v-model="score_to_win"/>
					<InputField label="background_color" value="disabled field" v-model="background_color"/>
					<corner-button link_text="accept" link_target="/" position="pb_bottom"/>
				</div>
			</div>

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
import type { Game, UpdateGameState } from '@/types/game.fe';
import { User } from '@/types/User';


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
		const gameStore = useGameStore();
		useGameStore().refreshMyGames();
		// const currentGame = useGameStore().allGames.find(
		// 	(game: Game) => Number(game.id) === Number(props.game_id),
		// );
		// useUserStore().refreshMe();
		// const { me, errors } = storeToRefs(userStore);
		// const { errors } = storeToRefs(gameStore);
		const updateGameState : UpdateGameState  = reactive({
			player_one: '',
			player_two: '',
			state: '',
		});
		// const { errors } = storeToRefs(gameStore);
		// const {createGame } = gameStore;
	return {
		gameStore,
		// errors,
		props,
		updateGameState,
	};
},
});
</script>
<style scoped></style>

