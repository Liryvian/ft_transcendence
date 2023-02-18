<template>
	<div class="c_message" :class="{ 'c_message--mine': isMessageMine }">
		<div class="c_message__name">{{ message.sender.name }}</div>
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

export default defineComponent({
	name: 'Message',
	props: {
		message: {
			type: Object as PropType<SingleMessage>,
			required: true,
		},
	},
	computed: {
		isMessageMine() {
			// logic to determine if message.sender.id === me.id
			return (this.message.sender?.name === 'Hans');
		},
		formattedTime() {
			const hours: String = "0" + this.message.created_at.getHours();
			const minutes: String = "0" + this.message.created_at.getMinutes();

			return `${hours.substr(-2)}:${minutes.substr(-2)}`
		}
	}
});
</script>
