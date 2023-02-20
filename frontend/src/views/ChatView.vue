<template>
	<div class="page_box_wrapper">
		<div class="page_box c_chat" :class="focusTarget">
			<div class="c_chat__userlist">
				<div
					v-if="focusTarget == 'c_chat--msg'"
					@click="toggleFocusTarget('list')"
					class="toggleHandler"
				></div>
				<ChatList v-if="dms.items.length" :info="dms" />
				<ChatList v-if="channels.items.length" :info="channels" />
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
import type { Chat_List, Chat_List_Item, Chat_Member } from '@/types/Chat';
import { useSocketStore } from '@/stores/socketStore';
import { useChatStore } from '@/stores/chatStore';

export default defineComponent({
	name: "ChatView",
	components: { ChatList, Chat },
	props: {
		currentChat: String,
	},
	setup(){
		const socketStore = useSocketStore();

		const chatStore = useChatStore();
		const { getDms, getChannels } = storeToRefs(chatStore);

		socketStore.initialize();
		return {
			socketStore,
			chatStore,
			getDms,
			getChannels,
		}
	},
	data() {
		return {
			focusTarget: 'c_chat--msg',
		};
	},
	computed: {
		dms(): Chat_List {
			return {
				name: "Direct Messages",
				type: "dm",
				items: this.getDms
			}
		},
		channels(): Chat_List {
			return {
				name: "Channels",
				type: "channel",
				items: this.getChannels
			}
		},
		allChats() {
			return [...this.dms.items, ...this.channels.items];
		},
		currentChatId() {
			return Number(this.currentChat ?? '-1');
		},
		currentChatInfo() {
			return this.allChats.find((chat) => chat.id === this.currentChatId);
		}
	},
	methods: {
		toggleFocusTarget(target: string) {
			this.focusTarget = 'c_chat--' + target;
		},
	},
});
</script>
