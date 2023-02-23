<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>NEW GAME</h1>
			<h1>VS</h1>
			<h1>PLAYER_02</h1>
			<div class="c_block c_form_group">
				<div class="c_field_group">
					<div class="c_field_group">
						<label for="score_to_win">score to win:</label>
						<input
							id="score_to_win"
							type="text"
							placeholder="5"
						/>
					</div>
					<div class="c_field_group">
						<label for="background_color">background color:</label>
						<input
							id="background_color"
							type="text"
							placeholder="#FFC0CB"
						/>
					</div>
					<div class="page_button pb_bottom">
						<a href="#">request</a>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script></script>
import InputField from '@/components/input-fields/InputField.vue';
import { defineComponent, reactive } from 'vue';
import { useUserStore} from '@/stores/userStore';
import type { RequestGameForm} from '@/types/Game';
import { storeToRefs } from 'pinia';

// export default defineComponent({
// 	name: 'RequestGame',
// 	components: {
// 		InputField,
// 	},

// 	async created() {
// 		await useUserStore().refreshMe();
// 	},
//
// 	setup() {
// 		const userStore = useUserStore();
// 		useUserStore().refreshMe();
// 		const { me, errors } = storeToRefs(userStore);
// 		let requestGameForm: RequestGameForm = reactive({
// 			score_to_win: '',
// 			background_color: '',
// 			player_one: me.id,
// 			player_two: id,
// 		});
// 		return {
// 			userStore,
// 			requestGame,
// 			requestGameForm,
// 			me,
// 			errors,
// 		};
// 	},
// });


<style scoped></style>
