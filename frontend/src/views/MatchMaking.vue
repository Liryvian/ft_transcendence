<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>MATCHMAKING</h1>
			<div class="c_block c_form_group">
				<form
					method="Post"
					action=""
					class="c_block c_form_group"
					@submit.prevent="makeMatch()"
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
import { useGameStore } from '@/stores/gameStore';
import { useUserStore } from '@/stores/userStore';
import { storeToRefs } from 'pinia';
import type { CreateGameForm } from '@/types/game.fe';
import type { NewMessage } from '@/types/Chat';
import router from '@/router';
import { getRequest, postRequest } from '@/utils/apiRequests';

export default defineComponent({
	name: 'Matchmaking',
	setup(props) {
		const userStore = useUserStore();
		userStore.refreshData();
		const { allUsers } = storeToRefs(userStore);
		const gameStore = useGameStore();
		gameStore.refreshAllGames();
		let createGameForm: CreateGameForm = reactive({
			score_to_win: 10,
			background_color: '#FFFFFF',
			player_one: 0,
			player_two: 0,
		});
		let newMessage: NewMessage = reactive({
			sender_id: -1,
			chat: -1,
			content: 'Is this a Match? Wanna play PONG?',
			is_game_request: true,
		});
		const errors = reactive([]);
		return {
			userStore,
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

		async makeMatch() {
			const opponent = await this.findOpponent();
			this.createGameForm.player_one = this.userStore.me.id;
			this.createGameForm.player_two = opponent.id;

			const dmId = (
				await getRequest(
					`chats/findOrCreateDm/${this.createGameForm.player_one}/${this.createGameForm.player_two}`,
				)
			).data;
			this.newMessage.chat = dmId;

			try {
				const newGame = (
					await postRequest('games', this.createGameForm)
				).data;
				this.newMessage.sender_id = useUserStore().me.id;
				this.newMessage.content = `<a href="/pong/${newGame.id}">wanna play PONG?</a>`;
				await postRequest('messages', this.newMessage);
				console.log('router push to game', {
					name: 'pong',
					params: { currentGameId: newGame.id },
				});
				return router.push({
					name: 'pong',
					params: { currentGameId: newGame.id },
				});
			} catch (e) {
				this.errors.length = 0;
				this.errors.push(
					'There seems to be a pending game for you already',
				);
			}
		},
		async findOpponent() {
			this.errors.length = 0;

			const usersWithoutGame = (
				await getRequest('users/without_game')
			).data
				.filter((user: any) => user.id !== this.userStore.me.id)
				.filter((user: any) => this.userStore.getOnlineStatus(user.id));
			if (usersWithoutGame.length === 0 || !usersWithoutGame[0]) {
				this.errors.push(
					'OH NO! No online members to play pong with, please try again later',
				);
				return;
			}
			return usersWithoutGame[0];
		},
	},
});
</script>
