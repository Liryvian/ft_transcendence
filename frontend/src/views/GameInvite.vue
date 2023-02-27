<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>YOU'VE BEEN INVITED</h1>
			<h1>BY</h1>
			<h1>PLAYER_02</h1>
			<div class="c_block c_form_group">
				<div class="c_field_group">
					<InputField label="score_to_win" id="disabled_field" v-model="score_to_win"/>
					<InputField label="background_color" value="disabled field" v-model="background_color"/>
					<corner-button link_text="accept" link_target="/" position="pb_bottom"/>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import InputField from '@/components/input-fields/InputField.vue';
import CornerButton from '@/components/buttons/CornerButton.vue';

export default {
	name: 'GameInvite',
	components: {
		InputField,
		CornerButton
	},
};
</script>

<style scoped></style>

