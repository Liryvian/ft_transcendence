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
import router from '@/router';
import { postRequest } from '@/utils/apiRequests';

export default defineComponent({
	name: 'Matchmaking',
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
			player_two: Number(0),
		});
		let newMessage: NewMessage = reactive({
			sender_id: Number(0),
			chat: Number(0),
			is_game_request: true,
			content: 'Is this a Match? Wanna play PONG?',
		});
		const errors = reactive([]);
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
				newMessage.content = `<a href="/games/${newGame.id}">wanna play PONG?</a>`;
				const message = await postRequest('messages', newMessage);
				//the router push is for later, I can imagine you want to return to your current chat @vvissche?
				await router.push(`/pong/${newGame.id}`);
			} catch (e: any) {
				this.handleFormError(e.response.data);
			}
		},
	},
});
</script>
<!--	components: {-->
<!--		InputField,-->
<!--		CornerButton,-->
<!--	},-->
<!--	computed: {-->
<!--		// const onlineGames[] = getOnlineStatus()-->
<!--		// getOnlinePlayers(): string {-->
<!--		// 	const player_two = this.allUsers.find(-->
<!--		// 		(user) => user.id === 10,-->
<!--		// 	)?.name;-->
<!--		// 	if (player_two) {-->
<!--		// 		return player_two;-->
<!--		// 	}-->
<!--		// 	return '!! nobody is online';-->
<!--		// },-->
<!--	},-->
<!--	setup() {-->
<!--		const userStore = useUserStore();-->
<!--		userStore.refreshData();-->
<!--		const { allUsers } = storeToRefs(userStore);-->
<!--		const gameStore = useGameStore();-->
<!--		gameStore.refreshAllGames();-->
<!--		const { errors } = storeToRefs(gameStore);-->
<!--		const { getOnlineStatus } = userStore;-->
<!--		const { createGame } = gameStore;-->
<!--		let createGameForm: CreateGameForm = reactive({-->
<!--			score_to_win: 10,-->
<!--			background_color: '#FFFFFF',-->
<!--			player_one: 0, // assign in createGame()-->
<!--			player_two: Number(0),-->
<!--		});-->
<!--		let newMessage: NewMessage = reactive({-->
<!--			sender_id: Number(0),-->
<!--			chat: Number(0),-->
<!--			content: 'Is this a Match? Wanna play PONG?',-->
<!--		});-->
<!--		return {-->
<!--			gameStore,-->
<!--			errors,-->
<!--			createGame,-->
<!--			allUsers,-->
<!--			createGameForm,-->
<!--			newMessage,-->
<!--		};-->
<!--	},-->
<!--});-->
<!--</script>-->
