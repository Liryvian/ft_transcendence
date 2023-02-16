<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>This is a request for a game page</h1>
			<form
				method="post"
				action=""
				class="c_block c_form_group"
				@submit.prevent="
					gameStore.requestGame(newGameForm)
				"
			>
				<InputField
					label="score to win"
					value="5"
					v-model="newGameForm.score_to_win"
				/>
				<InputField
					label="background color"
					value="#ff4400"
					v-model="newGameForm.background_color"
				/>
			<div class="page_button pb_bottom">
				<input type="submit" value="save" />
			</div>
			<div v-if="userStore.errors.length">
				<p v-for="error in userStore.errors" class="c_form--error">
					!! {{ error }}
				</p>
			</div>
			</form>
		</div>
	</div>
</template>

<script>
import InputField from '@/components/input-fields/InputField.vue';
import { useUserStore } from '@/stores/userStore';
import { useGameStore } from '@/stores/userStore';

export default {
	name: 'RequestGame',
	components: {
		InputField,
	},
	setup() {
		const userStore = useUserStore().me;
		const gameStore = useGameStore().getMyGames();
		const newGameForm: NewGameForm = reactive({
			score_to_win: '',
			background_color: '',
			player_one: '',
			player_two: '',
		});
		return {
			userStore,
			newGameForm,
		};
	},
};
</script>
<style scoped>

</style>