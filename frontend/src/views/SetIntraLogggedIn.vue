<template></template>

<script lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/userStore';
import { getRequest } from '@/utils/apiRequests';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'SetIntraLoggedIn',
	setup() {},
	props: {
		next: String,
	},
	async created() {
		try {
			const isAuthenticated = (await getRequest('auth/is_authenticated'))
				.data;
			if (isAuthenticated !== true) {
				return router.push({ name: 'login' });
			}
			useUserStore().isLoggedIn = true;
			useUserStore().finalizeLogin();
			return router.push({ name: this.next });
		} catch (e) {
			console.log(e);
		}
		return router.push({ name: 'login' });
	},
});
</script>
