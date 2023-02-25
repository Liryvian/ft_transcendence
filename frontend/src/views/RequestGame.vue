<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>NEW GAME</h1>
			<h1>VS</h1>
			<h1>PLAYER_02</h1>
			<div class="c_block c_form_group">
				<div class="c_field_group">
					<InputField
						label="score_to_win"
						:modelValue="score_to_win"
						@update:modelValue="updateProfileForm.name = $event"
					/>
					<InputField
						label="background_color"
						v-model="background_color"
					/>
					<corner-button
						link_text="request"
						link_target="/"
						position="pb_bottom"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from 'vue';
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
	// computed: {
	// 	getprofileId(){
	// 		return this.profile_id;
	// 	}
	// },
	data(){
		let createGameForm: CreateGameForm = reactive({
			score_to_win: 0,
			background_color: '',

			player_one: 0,
			player_two: 0,
		});
		return { createGameForm }
	},

	created(){
	 this.createGameForm = {
		 score_to_win: 0,
		 background_color: '',

		 player_one: 0,
		 player_two: Number(this.profile_id),
	 };
	 console.log("THIS IS PLAYER TWO:", Number(this.profile_id));
	},

	setup() {
		const userStore = useUserStore();
		const {me} = storeToRefs(userStore);
		const gameStore = useGameStore();
		useUserStore().refreshMe();
		useGameStore().refreshMyGames();
		// let createGameForm: CreateGameForm = reactive({
		// 	score_to_win: 0,
		// 	background_color: '',
		//
		// 	player_one: 0,
		// 	player_two: 0,
		// });
		// onMounted(() => {
		// 	createGameForm = {
		// 		score_to_win: 10,
		// 		background_color: 'fff',
		//
		// 		player_one: me.value.id,
		// 		player_two: Number(this.$props.profile_id),
		// 	}
		// 	})


		return {
			gameStore,
			me,
			// errors,
			// profile_id,
		};
	}

});
</script>
<style scoped></style>
