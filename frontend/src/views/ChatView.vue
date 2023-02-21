<template>
	<div class="page_box_wrapper">
		<div class="page_box c_chat" :class="focusTarget">
			<div class="c_chat__userlist">
				<div
					v-if="focusTarget == 'c_chat--msg'"
					@click="toggleFocusTarget('list')"
					class="toggleHandler"
				></div>
				<ChatList v-if="dmList.items.length" :info="dmList" />
				<ChatList v-if="channelList.items.length" :info="channelList" />
			</div>
			<template v-if="currentChatInfo">
				<Chat
					:info="currentChatInfo"
					:focusTarget="focusTarget"
					@toggleFocusTarget="toggleFocusTarget"
				/>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';

import Chat from '@/components/chat/Chat.vue';
import ChatList from '@/components/chat/ChatList.vue';
import type { Chat_List } from '@/types/Chat';
import { useSocketStore } from '@/stores/socketStore';
import { useChatStore } from '@/stores/chatStore';

export default defineComponent({
	name: 'ChatView',
	components: { ChatList, Chat },
	props: {
		currentChat: String,
	},
	setup() {
		const socketStore = useSocketStore();

		const chatStore = useChatStore();
		chatStore.init(false);
		const { dms, channels, getAllChats } = storeToRefs(chatStore);

		socketStore.initialize();
		return {
			socketStore,
			chatStore,
			dms,
			channels,
			getAllChats,
		};
	},
	data() {
		return {
			focusTarget: 'c_chat--msg',
		};
	},
	computed: {
		dmList(): Chat_List {
			return {
				name: 'Direct Messages',
				type: 'dm',
				items: this.dms,
			};
		},
		channelList(): Chat_List {
			return {
				name: 'Channels',
				type: 'channel',
				items: this.channels,
			};
		},
		currentChatId() {
			return Number(this.currentChat ?? '-1');
		},
		currentChatInfo() {
			return this.getAllChats.find(
				(chat) => chat.id === this.currentChatId,
			);
		},
	},
	methods: {
		toggleFocusTarget(target: string) {
			this.focusTarget = 'c_chat--' + target;
		},
	},
});
</script>
