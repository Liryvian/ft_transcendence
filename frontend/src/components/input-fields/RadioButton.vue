<template>
		<div class="c_radio_group">
			<label :for="id">{{ label }}</label>
			<input
				:id="id"
				type="radio"
				v-model="model"
				:value="value"
			/>
		</div>
</template>

//
<script>
export default {
	name: 'RadioButton',
	props: {
		label: String,
		id: String,
		value: String,
	},
};
</script>

<style scoped>

</style>