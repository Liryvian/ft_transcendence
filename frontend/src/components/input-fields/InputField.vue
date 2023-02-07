<template>
	<div class="c_field_group">
		<label :for="id">{{ label }}:</label>
		<input
			:id="id"
			type="text"
			:value="modelValue"
			@input="$emit('update:modelValue', $event.target.value)"
			:disabled="is_disabled"
		/>
	</div>

</template>

<script lang="ts">
export default {
	name: 'InputField',
	props: {
		id: String,
		label: String,
		is_disabled: false,
		modelValue: String
	},
	emits: ['update:modelValue'],
};
</script>

<style scoped>

</style>
