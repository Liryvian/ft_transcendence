<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>NEW GAME</h1>
			<h1>VS</h1>
			<h1>PLAYER_02</h1>
			<form
				method="Post"
				action=""
				class="c_block c_form_group"
				@submit.prevent="createGame(me.id, requestGameForm)"
			>
				<InputField

					label="Score to win"
					v-model="requestGameForm.score_to_win"
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
</template>

<script>
import InputField from '@/components/input-fields/InputField.vue';
import { defineComponent, reactive } from 'vue';
import { useUserStore} from '@/stores/userStore';
import type { RequestGameForm} from '@/types/Game';
import { storeToRefs } from 'pinia';

export default defineComponent({
	name: 'RequestGame',
	components: {
		InputField,
	},

	async created() {
		await useUserStore().refreshMe();
	},

	setup() {
		const userStore = useUserStore();
		useUserStore().refreshMe();
		const { me, errors } = storeToRefs(userStore);
		let requestGameForm: RequestGameForm = reactive({
			score_to_win: '',
			background_color: '',
			player_one: '',
			player_two: '',
		});
		return {
			userStore,
			requestGame,
			requestGameForm,
			me,
			errors,
		};
	},
});
</script>

<style scoped></style>
