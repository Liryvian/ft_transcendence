<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>
				NEW GAME<br />
				VS<br />
				{{ getNamePlayerTwo }}<br />
			</h1>
			<div class="c_block c_form_group">
				<form
					method="Post"
					action=""
					class="c_block c_form_group"
					@submit.prevent="createGame(createGameForm, newMessage)"
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
import router from '@/router';
import { postRequest } from '@/utils/apiRequests';

export default defineComponent({
	name: 'GameRequest',
	components: {
		InputField,
		CornerButton,
	},
	props: {
		profile_id: { type: String, required: true },
		chat_id: { type: String, required: true },
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
		gameStore.refreshAllGames();
		let createGameForm: CreateGameForm = reactive({
			score_to_win: 10,
			background_color: '#FFFFFF',
			player_one: 0, // assign in createGame()
			player_two: Number(props.profile_id),
		});
		let newMessage: NewMessage = reactive({
			sender_id: Number(0),
			chat: Number(props.chat_id),
			is_game_request: true,
			content: 'wanna play PONG?',
		});
		return {
			gameStore,
			allUsers,
			createGameForm,
			newMessage,
		};
	},
	data() {
		return {
			errors: [] as String[],
		};
	},
	methods: {
		handleFormError(responseData: any) {
			if (typeof responseData.message === 'string') {
				this.errors.length = 0;
				this.errors.push(responseData.message);
			} else {
				this.errors = responseData.message.map((msg: String) =>
					msg.replace('(o) => o.', ''),
				);
			}
		},
		async createGame(
			createdGameForm: CreateGameForm,
			newMessage: NewMessage,
		) {
			try {
				this.errors.length = 0;
				if (
					/^#[a-fA-F0-9]{6}$/.test(
						createdGameForm.background_color,
					) === false
				) {
					this.errors.push('Not a valid color');
					return;
				}
				createdGameForm.player_one = useUserStore().me.id;
				const newGame = (await postRequest('games', createdGameForm))
					.data;
				newMessage.sender_id = useUserStore().me.id;
				newMessage.content = `<a href="/pong/${newGame.id}">wanna play PONG?</a>`;
				await postRequest('messages', newMessage);

				await router.push(`/pong/${newGame.id}`);
			} catch (e: any) {
				this.handleFormError(e.response.data);
			}
		},
	},
});
</script>
