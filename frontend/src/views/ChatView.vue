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
			<template v-if="currentChatIndex !== -1">
				<Chat
					:info="currentChatInfo"
					:focusTarget="focusTarget"
					@toggleFocusTarget="toggleFocusTarget"
				/>
			</template>
			<template v-else>
				<div class="c_chat__conversation">
					<!-- And then create and load the chat.. and update lists etc? -->
					<img src="/loading.gif" v-if="currentChatInfo.id === -1 && currentChatInfo.type === 'dm'">
				</div>
			</template>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';

import Chat from '@/components/chat/Chat.vue';
import ChatList from '@/components/chat/ChatList.vue';
import type { Chat_List, Chat_List_Item } from '@/types/Chat';
import { useSocketStore } from '@/stores/socketStore';
import { useChatStore } from '@/stores/chatStore';
import { useUserStore } from '@/stores/userStore';
import router from '@/router';

export default defineComponent({
	name: 'ChatView',
	components: { ChatList, Chat },
	props: {
		dmId: String,
		channelId: String,
	},
	setup() {
		const userStore = useUserStore();
		userStore.refreshMe();

		const socketStore = useSocketStore();
		socketStore.initialize();

		const chatStore = useChatStore();
		chatStore.init(false);
		const { dms, channels, getAllChats } = storeToRefs(chatStore);

		return {
			socketStore,
			userStore,
			chatStore,
			dms,
			channels,
			getAllChats,
			router
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
			if (this.dmId !== undefined) {
				return Number(this.dmId);
			}
			return Number(this.channelId ?? '-1');
		},
		currentChatIndex() {
			if (this.router.currentRoute.value.name === 'dm') {
				return this.getAllChats.findIndex(
					(chat) =>
						(chat.users.length === 2 &&
						chat.users.findIndex((u) => u.id === this.currentChatId) !== -1 &&
						chat.users.findIndex((u) => u.id === this.userStore.me.id) !== -1)
				)
			}
			return this.getAllChats.findIndex(
				(chat) => chat.id === this.currentChatId,
			);
		},
		currentChatInfo() {
			if (this.currentChatIndex !== -1) {
				return this.getAllChats[this.currentChatIndex];
			}
			return {
				id: -1,
				name: '',
				type: this.router.currentRoute.value.name,
				users: []
			} as Chat_List_Item;
		},
	},
	methods: {
		toggleFocusTarget(target: string) {
			this.focusTarget = 'c_chat--' + target;
		},
	},
});
</script>
