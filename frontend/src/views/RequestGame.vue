<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>NEW GAME</h1>
			<h1>VS</h1>
			<h1>PLAYER_02</h1>
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
	data() {
		let createGameForm: CreateGameForm = reactive({
			score_to_win: 0,
			background_color: '',
			player_one: 0,
			player_two: 0,
		});
		return { createGameForm };
	},

	async created() {
		const userStore = useUserStore();
		await useUserStore().refreshMe();
		const { me } = storeToRefs(userStore);
		this.createGameForm = {
			score_to_win: 10,
			background_color: 'fff',
			player_one: me.value.id,
			player_two: Number(this.profile_id),
		};
		console.log('THIS IS PLAYER TWO:', Number(this.profile_id));
	},

	// async created() {
	// 	await useUserStore().refreshMe();
	// },

	setup(props) {
		// const userStore = useUserStore();
		// useUserStore().refreshMe();
		// userStore.refreshData();
		const gameStore = useGameStore();
		useGameStore().refreshMyGames();
		const { errors } = storeToRefs(gameStore);
		// const { me } = storeToRefs(userStore);
		// console.log("ME", me.value.id);
		const {createGame } = gameStore;
		// let createGameForm: CreateGameForm = reactive({
		// 	score_to_win: 10,
		// 	background_color: 'fff',
		// 	player_one: me.value.id,
		// 	player_two: Number(props.profile_id),
		// });
		return {
			gameStore,
			errors,
			// createGameForm,
			createGame,
			// me,
		};
	},
});
</script>
<style scoped></style>
