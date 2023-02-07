<template>
	<!-- Without pb_bottom it's positioned on the top -->
	<div class="page_button" :class="position">
		<a href="link_target">{{ link_text }}</a>
	</div>
</template>

<script>
export default {
	name: 'cornerButton',
	props: {
		link_target: String,
		link_text: String
	},
};
</script>

<style scoped>

</style>