<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>NEW GAME</h1>
			<h1>VS</h1>
			<h1>PLAYER_02</h1>
			<div class="c_block c_form_group">
				<div class="c_field_group">
					<InputField label="score_to_win" v-model="score_to_win"/>
					<InputField label="background_colo" v-model="background_color"/>
					<corner-button link_text="request" link_target="/" position="pb_bottom"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import InputField from '@/components/input-fields/InputField.vue';
import CornerButton from '@/components/buttons/CornerButton.vue';

export default defineComponent({
	name: 'GameRequest',
	components: {
		InputField,
		CornerButton
	},


});
</script>
<style scoped></style>
