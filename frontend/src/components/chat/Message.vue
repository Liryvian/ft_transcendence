<template>
	<div class="c_message" :class="{ 'c_message--mine': isMessageMine }">
		<div class="c_message__name">{{ getName }}</div>
		<div class="c_message__wrap">
			<div class="c_message__msg">
				<div class="c_message__time">
					{{ formattedTime }}
				</div>
				<div v-for="msgpart in message.content.split('\n')">
					{{ msgpart }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { SingleMessage } from '@/types/Chat';
import type { PropType } from 'vue';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
	name: 'Message',
	props: {
		message: {
			type: Object as PropType<SingleMessage>,
			required: true,
		},
	},
	setup() {
		const userStore = useUserStore();

		// shouldbe removed in favour of sockets + init once
		userStore.refreshData();
		return {
			userStore,
		};
	},
	computed: {
		getName() {
			if (this.message.user_id) {
				if (this.message.user_id === this.userStore.me.id) {
					return this.userStore.me.name;
				}
				return (
					this.userStore.getUserById(this.message.user_id)?.name ?? ''
				);
			}
			if (this.message.sender && this.message.sender.name) {
				return this.message.sender.name;
			}
			return '...';
		},
		isMessageMine() {
			return this.message.user_id === this.userStore.me.id;
		},
		formattedTime() {
			const date = new Date(this.message.created_at);
			const hours: String = '0' + date.getHours();
			const minutes: String = '0' + date.getMinutes();

			return `${hours.slice(-2)}:${minutes.slice(-2)}`;
		},
	},
});
</script>
