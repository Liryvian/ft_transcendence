<template>
		<div class="c_radio_group">
			<label :for="id">{{ label }}</label>
			<input
				:id="id"
				:name="name"
				type="radio"
				:value="value"
				@input="$emit('update:modelValue', $event.target.value)"
			/>
		</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: 'RadioButton',
	props: {
		name: String,
		label: String,
		id: String,
		value: Boolean
	},
	emits: ['update:modelValue'],
});
</script >

<style scoped>

</style>