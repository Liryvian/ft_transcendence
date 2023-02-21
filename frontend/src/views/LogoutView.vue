<template>
</template>

<script lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/userStore';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Logout',

	setup() {
		useUserStore().logout();
		router.push({name: "login"})
	},
});
</script>
