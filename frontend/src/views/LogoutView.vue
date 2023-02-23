<template>
</template>

<script lang="ts">
import { useChatStore } from '@/stores/chatStore';
import { useGameStore } from '@/stores/gameStore';
import { useUserStore } from '@/stores/userStore';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'Logout',

	setup() {
		useUserStore().logout();
		// reset all stores
		useUserStore().$reset();
		useGameStore().$reset();
		useChatStore().$reset();
	},
});
</script>
