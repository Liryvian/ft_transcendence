<template>
	<div class="c_conversation__header">
		<div v-if="canInviteForAGame()">invite for a game</div>
		<div v-if="canEditChannelSettings()">channel settings</div>
		<div>
			<div class="c_media c_media--assetright c_media--clickable">
				<div class="c_media__asset" :class="is_online">
					<ChatProfileImages :chat="chat" />
				</div>
				<div class="c_media__content">{{ chat.name }}</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Chat_List_Item } from '@/types/Chat'
import ChatProfileImages from '@/components/chat/ChatProfileImages.vue'

export default defineComponent({
	name: 'ChatHeader',
	components: {
		ChatProfileImages
	},
	props: {
		chat: {
			type: Object as PropType<Chat_List_Item>,
			required: true,
		},
	},
	computed: {
		is_online(): String {
			if (this.chat.type === 'dm') {
				// here logic to check if other user in dm is online or not
				return 'c_asset--online';
			}
			return 'c_asset--multi';
		},
	},
	methods: {
		canInviteForAGame() {
			// logic here to check if there is not already a game going on between the two users
			return this.chat.type === 'dm';
		},
		canEditChannelSettings() {
			// logic here to get current users permissions in this chat
			return this.chat.type === 'channel';
		}
	}
});
</script>
