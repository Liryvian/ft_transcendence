<template>
	<div class="c_radio_group">
		<label :for="id">{{ label }}</label>
		<input
			:id="id"
			:name="name"
			type="radio"
			:value="value"
			:checked="checked"
			@input="$emit('update:modelValue', $event.target.value)"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'RadioButton',
	props: {
		name: String,
		label: String,
		id: String,
		value: String,
		checked: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['update:modelValue'],
});
</script>
