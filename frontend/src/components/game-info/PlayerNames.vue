<template>
	<div class="c_game__name">{{ player_left }}</div>
	<div class="c_game__name c_game__name--right">{{ player_right }}</div>
</template>

<script lang="ts">
export default {
	name: 'PlayerNames',
	props: {
		player_left: String,
		player_right: String
	},
};
</script>

<style scoped>

</style>