<template>
	<div class="c_field_group">
		<label :for="id">{{ name }}:</label>
		<input
			:id="id"
			type="text"
			v-model="input_data"
			:disabled="is_disabled"
		/>
	</div>

</template>

<script lang="ts">
export default {
	name: 'InputField',
	props: {
		id: String,
		name: String,
		// input_data: String,   //not sure what to dooo
		is_disabled: false
	},
};
</script>

<style scoped>

</style>
