<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>NEW GAME<br>
			VS<br>
			{{ getNamePlayerTwo }}<br></h1>
			<div class="c_block c_form_group">
				<form
					method="Post"
					action=""
					class="c_block c_form_group"
					@submit.prevent="createGame(createGameForm,newMessage)"
				>
					<InputField
						label="score_to_win"
						:modelValue="String(createGameForm.score_to_win)"
						@update:modelValue="
							createGameForm.score_to_win = $event
						"
					/>
					<InputField
						label="background_color"
						:modelValue="String(createGameForm.background_color)"
						@update:modelValue="
							createGameForm.background_color = $event
						"
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
import type { NewMessage } from '@/types/Chat';

export default defineComponent({
	name: 'GameRequest',
	components: {
		InputField,
		CornerButton,
	},
	props: {
		profile_id: { type: String, required: true },
		chat_id: {type: String, required: true},
	},
	computed: {
		getNamePlayerTwo(): string {
			const player_two = this.allUsers.find(
				(user) => user.id === Number(this.profile_id),
			)?.name;
			if (player_two) {
				return player_two;
			}
			return '!! Invalid user';
		},
	},
	setup(props) {
		const userStore = useUserStore();
		userStore.refreshData();
		const { allUsers } = storeToRefs(userStore);
		const gameStore = useGameStore();
		gameStore.refreshMyGames();
		const { errors } = storeToRefs(gameStore);
		const { createGame } = gameStore;
		let createGameForm: CreateGameForm = reactive({
			score_to_win: 10,
			background_color: '#FFFFFF',
			player_one: 0, // assign in createGame()
			player_two: Number(props.profile_id),
		});
		let newMessage: NewMessage = reactive({
			sender_id: Number(0),
			chat: Number(props.chat_id),
			content: 'wanna play PONG?',
		});

		return {
			gameStore,
			errors,
			createGame,
			allUsers,
			createGameForm,
			newMessage,
		};
	},
});
</script>
