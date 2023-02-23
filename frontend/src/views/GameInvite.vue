<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>YOU'VE BEEN INVITED </h1>
			<h1>BY</h1>
			<h1>PLAYER_02</h1>
			<div class="c_block c_form_group">
				<div class="c_field_group">
					<div class="c_field_group">
						<label for="disabled_field">score to win:</label>
						<input
							id="disabled_field"
							type="text"
							placeholder="5"
							disabled
						/>
					</div>
					<div class="c_field_group">
						<label for="disabled_field">background color:</label>
						<input
							id="disabled_field"
							type="text"
							placeholder="#FFC0CB"
							disabled
						/>
					</div>
					<div class="page_button pb_bottom">
						<a href="#">play</a>
					</div>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
export default {
	name: 'GameInvite',
};
</script>

<style scoped>

</style>