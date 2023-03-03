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
					<img
						src="/loading.gif"
						v-if="currentChatInfo.id === -1 && currentChatInfo.type === 'dm'"
						:class="tryCreateNewDm()"
					/>
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
import { type Chat_List, type Chat_List_Item, permissionsEnum } from '@/types/Chat';
import { useSocketStore } from '@/stores/socketStore';
import { useChatStore } from '@/stores/chatStore';
import { useUserStore } from '@/stores/userStore';
import router from '@/router';
import { postRequest } from '@/utils/apiRequests';

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
		const { me } = storeToRefs(userStore);

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
			me,
			channels,
			getAllChats,
			router
		};
	},
	data() {
		return {
			focusTarget: 'c_chat--msg',
			requestsDoneFor: [] as number[]
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
						chat.users.findIndex((u) => u.id === this.me.id) !== -1)
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
				users: [],
			} as Chat_List_Item;
		},
	},
	methods: {
		toggleFocusTarget(target: string) {
			this.focusTarget = 'c_chat--' + target;
		},
		async tryCreateNewDm() {
			const otherUser = this.userStore.getUserById(Number(this.dmId ?? '-1'));
			if (this.dmId === undefined ||
				otherUser === undefined ||
				this.me?.id === undefined
			) {
				router.push({ name: 'chat' });
				return;
			}
			// try to make sure the request only happens once..
			if (this.requestsDoneFor.indexOf(otherUser.id) !== -1) {
				return;
			}
			try {
				console.log("trying to make new chat");
				this.requestsDoneFor.push(otherUser.id);
				const newChat = await postRequest('chats', {
					type: 'dm',
					name: `${this.me.name}-${otherUser.name}`,
					users: [
						{
							id: otherUser.id,
							permissions: [
								permissionsEnum.READ,
								permissionsEnum.POST,
								permissionsEnum.OWNER
							]
						},
						{
							id: this.me.id,
							permissions: [
								permissionsEnum.READ,
								permissionsEnum.POST,
								permissionsEnum.OWNER
							]
						}
					]
				});
				console.log({newChat});
			} catch (e) {
				console.log(e);
			}
		}
	},
});
</script>
