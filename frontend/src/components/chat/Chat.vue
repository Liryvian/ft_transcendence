<template>
	<div class="c_chat__conversation">
		<div
			v-if="focusTarget == 'c_chat--list'"
			@click="$emit('toggleFocusTarget', 'msg')"
			class="toggleHandler"
		></div>
		<div class="c_conversation__header">
			<div v-if="chatInfo?.type === 'dm'">invite for a game</div>
			<div v-if="chatInfo?.type === 'channel'">channel settings</div>
			<div>
				<div class="c_media c_media--assetright c_media--clickable">
					<div class="c_media__asset c_asset--online">
						<div class="c_asset__circle">
							<img src="/test-profile.png" alt="" />
						</div>
					</div>
					<div class="c_media__content">username</div>
				</div>
			</div>
		</div>
		<div class="c_messagelist">
			messages
			<!-- <Message
				v-for="message in messageStore.getActiveMessages(chatId)"
				:message="message"
				:key="message.id"
			/> -->
		</div>
		<div class="c_send_message">
			<textarea
				name="new_message"
				id="new_message"
				placeholder="type..."
			></textarea>
			<input type="submit" value="enter" />
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useChatStore } from '@/stores/chatStore';

import Message from './Message.vue';

export default defineComponent({
	name: 'Chat',
	components: {
		Message,
	},
	props: {
		focusTarget: String,
		chatId: {
			type: Number,
			required: true
		},
	},
	setup(props) {
		const chatStore = useChatStore();

		// chatStore.refreshChatInfo(props.chatId);
		return {
			chatStore,
		};
	},
});
</script>
