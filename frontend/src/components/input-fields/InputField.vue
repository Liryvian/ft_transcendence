<template>
	<div class="c_field_group">
		<label :for="getId">{{ label }}:</label>
		<input
			:tabindex="tabindex"
			:id="getId"
			:type="inputType"
			:value="modelValue"
			@input="$emit('update:modelValue', $event.target.value)"
			:disabled="is_disabled"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'InputField',
	props: {
		id: String,
		label: String,
		is_disabled: {
			type: Boolean,
			default: false,
		},
		modelValue: String,
		inputType: {
			type: String,
			default: 'text',
		},
		tabindex: {
			type: String,
			default: '0',
		},
	},
	emits: ['update:modelValue'],
	computed: {
		getId() {
			if (this.id && this.id.length) {
				return this.id;
			}
			return this.label?.split(' ').join('') ?? Math.random().toString();
		},
	},
});
</script>

<style scoped></style>
