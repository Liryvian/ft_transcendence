<template>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Logout',

	setup() {
		useUserStore().logout();
	},
});
</script>
