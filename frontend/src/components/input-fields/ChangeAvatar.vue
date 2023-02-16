<template>
	<form class="button">
		<label for="actual-btn">change avatar</label>
		<input type="file" id="actual-btn" hidden/>
		<input type="submit" value="submit" />
	</form>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: 'ChangeAvatar',
	props: {
		profile_picture: String,
	},
});
</script >

<style scoped>
.button {
	margin-left: auto;
	margin-right: auto;
	margin-top: 1.2em;
}
label {
	color: black;
	padding: 0.5rem;
	cursor: pointer;
	margin-top: 1rem;
}

</style>
