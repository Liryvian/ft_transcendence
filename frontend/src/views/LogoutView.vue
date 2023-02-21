<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>GOODBYE!</h1>
			<form
				method="post"
				action=""
				class="c_block c_form_group"
				@submit.prevent="userStore.logout()">
				<p><a href="/login">logout</a></p>
			</form>
			</div>
		</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent, reactive } from 'vue';
import InputField from '@/components/input-fields/InputField.vue';

export default defineComponent({
	name: 'Logout',
	components: {
		InputField,
	},
	setup() {
		const userStore = useUserStore().me;
		return {
			userStore,
		};
	},
});
</script>

