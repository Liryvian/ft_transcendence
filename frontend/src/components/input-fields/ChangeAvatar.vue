<template>
	<form
		method="POST"
		:action="`/api/users/${userStore.me.id}/avatar`"
		enctype="multipart/form-data"
		class="button"
	>
		<label for="actual-btn">change avatar</label>
		<input
			type="file"
			name="avatar"
			id="actual-btn"
			hidden
			@change="checkChange($event)"
		/>
		<input v-if="hasFile" type="submit" value="submit" />
	</form>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'ChangeAvatar',
	props: {
		profile_picture: String,
	},
	setup() {
		const userStore = useUserStore();
		return {
			userStore,
		};
	},
	data() {
		return {
			hasFile: false,
		};
	},
	methods: {
		checkChange(event: Event) {
			if (event.target.value) {
				this.hasFile = true;
			} else {
				this.hasFile = false;
			}
		},
	},
});
</script>

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
