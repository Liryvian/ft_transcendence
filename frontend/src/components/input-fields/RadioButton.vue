<template>
<!--	/<div class="c_field_group c_field_group&#45;&#45;radio">-->
		<div class="c_radio_group">
			<<label :for="id">{{ name }}:</label>
			<input
				name="same"
				id="example_radio2"
				type="radio"
				value="on"
				checked
			/>
		</div>
<!--		<div class="c_radio_group">-->
<!--			<label for="example_radio1">private</label>-->
<!--			<input-->
<!--				name="same"-->
<!--				id="example_radio1"-->
<!--				type="radio"-->
<!--				value="on"-->
<!--			/>-->
<!--		</div>-->
<!--	</div>-->

<!--	<div class="c_field_group c_field_group&#45;&#45;radio">-->
<!--		<InputRadio values='' />-->
<!--		<InputRadio values='' />-->
<!--	</div>-->

</template>

<script>
export default {
	name: 'ballButton',
	data: {
		name: 'ball name',
	};
},
};
</script>

<style scoped>

</style>