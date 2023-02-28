<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>NEW GAME</h1>
			<h1>VS</h1>
			<h1>{{ getNamePlayerTwo }}</h1>
			<div class="c_block c_form_group">
				<form
					method="Post"
					action=""
					class="c_block c_form_group"
					@submit.prevent="createGame(createGameForm)"
				>
					<InputField
						label="score_to_win"
						:modelValue=String(createGameForm.score_to_win)
						@update:modelValue="createGameForm.score_to_win = $event"
					/>
					<InputField
						label="background_color"
						:modelValue=String(createGameForm.background_color)
						@update:modelValue="createGameForm.background_color = $event"
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
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import InputField from '@/components/input-fields/InputField.vue';
import CornerButton from '@/components/buttons/CornerButton.vue';
import { useGameStore } from '@/stores/gameStore';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import type { CreateGameForm } from '@/types/game.fe';

export default defineComponent({
	name: 'GameRequest',
	components: {
		InputField,
		CornerButton,
	},
	props: {
		profile_id: { type: String, required: true },
	},
	computed: {
		// get the display name of player 2
		getNamePlayerTwo(): string {
			const player_two = this.allUsers.find(user => (user.id === Number(this.profile_id)))?.name;
			if (player_two) {
				return player_two;
			}
			return "!! Invalid user"
		},
	},
	setup(props) {
		const userStore = useUserStore();
		useUserStore().refreshData();
		const { allUsers } = storeToRefs(userStore);
		const gameStore = useGameStore();
		useGameStore().refreshMyGames();
		const { errors } = storeToRefs(gameStore);
		const {createGame } = gameStore;
		let createGameForm : CreateGameForm = reactive({
			score_to_win: 10,
			background_color: '#FFFFFF',
			player_one: 0, // assign in createGame()
			player_two: Number(props.profile_id),
		});
		return {
			gameStore,
			errors,
			createGame,
			allUsers,
			createGameForm,
		};
	},
});
</script>

