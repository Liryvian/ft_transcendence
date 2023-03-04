<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>
				MATCHMAKING
			</h1>
			<div class="c_block c_form_group">
				<form
					method="Post"
					action=""
					class="c_block c_form_group"
					@submit.prevent="createGame(createGameForm, newMessage)"
				>

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
import { useSocketStore } from '@/stores/socketStore';

export default defineComponent({
	name: 'GameRequest',
	components: {
		InputField,
		CornerButton,
	},
	computed: {
		const onlineGames[] = getOnlineStatus()
		// getOnlinePlayers(): string {
		// 	const player_two = this.allUsers.find(
		// 		(user) => user.id === 10,
		// 	)?.name;
		// 	if (player_two) {
		// 		return player_two;
		// 	}
		// 	return '!! nobody is online';
		// },
	},
	setup() {
		const userStore = useUserStore();
		userStore.refreshData();
		const { allUsers } = storeToRefs(userStore);
		const gameStore = useGameStore();
		gameStore.refreshAllGames();
		const { errors } = storeToRefs(gameStore);
		const { getOnlineStatus } = userStore;
		const { createGame } = gameStore;
		let createGameForm: CreateGameForm = reactive({
			score_to_win: 10,
			background_color: '#FFFFFF',
			player_one: 0, // assign in createGame()
			player_two: Number(0),
		});
		let newMessage: NewMessage = reactive({
			sender_id: Number(0),
			chat: Number(0),
			content: 'Is this a Match? Wanna play PONG?',
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
