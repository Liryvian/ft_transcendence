<template>
	<div class="c_message" :class="{ 'c_message--mine': message.sender_id }">
		<div class="c_message__name">{{ message.sender_id }}</div>
		<div class="c_message__wrap">
			<div class="c_message__msg">
				<div class="c_message__time">
					{{ message.created_at }}
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
import type { Message } from '@/types/Chat';
import type { PropType } from 'vue';

export default defineComponent({
	name: 'Message',
	props: {
		message: {
			type: Object as PropType<Message>,
			required: true,
		},
	},
});
</script>
