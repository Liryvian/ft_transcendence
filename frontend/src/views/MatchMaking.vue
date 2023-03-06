<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>MATCHMAKING</h1>
			<div class="c_block c_form_group">
				<form
					method="Post"
					action=""
					class="c_block c_form_group"
					@submit.prevent="
						searchOrCreateChat(createGameForm),
							findOpponent(createGameForm),
							createGame(createGameForm, newMessage)
					"
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
import { useChatStore } from '@/stores/chatStore';

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
			player_one: 0,
			player_two: 0,
		});
		let newMessage: NewMessage = reactive({
			sender_id: 0,
			chat: 17,
			// is_game_request: true,
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

		async findOpponent(createdGameForm: CreateGameForm) {
			const userStore = useUserStore();
			userStore.refreshData();
			const { allUsers } = storeToRefs(userStore);
			const { getOnlineStatus, me } = userStore;

			allUsers.value.find((user) => {
				if (getOnlineStatus(user.id) === true && user.id !== me.id) {
					createdGameForm.player_two = user.id;
				}
			});
			if (createdGameForm.player_two === 0) {
				this.errors.push(
					'OH NO! No online members to play pong with, please try again later',
				);
				return;
			}
		},

		async searchOrCreateChat(createdGameForm: CreateGameForm) {
			const chatStore = useChatStore();
			const { getAllChats } = storeToRefs(chatStore);
			// console.log('ALL CHATS', getAllChats.find();
			// if (useUserStore().me.value.find);
			// if (getAllChats.find(
			// 	(chat) => chat.sender_id === createdGameForm.player_one)){
			// 	return chat;
			// }
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
				const message = await postRequest('messages', newMessage);
				await router.push(`/pong/${newGame.id}`);
			} catch (e: any) {
				this.handleFormError(e.response.data);
			}
		},
	},
});
</script>
