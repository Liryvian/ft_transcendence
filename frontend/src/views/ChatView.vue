<template>
	<div class="page_box_wrapper">
		<div class="page_box c_chat" :class="focusTarget">
			<div class="c_chat__userlist">
				<div
					v-if="focusTarget == 'c_chat--msg'"
					@click="toggleFocusTarget('list')"
					class="toggleHandler"
				></div>
				<ChatList :info="dms" />
				<ChatList :info="channels" />
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

import Chat from '@/components/chat/Chat.vue';
import ChatList from '@/components/chat/ChatList.vue';
import type { Chat_List, Chat_List_Item, Chat_Member } from '@/types/Chat';

export default defineComponent({
	name: "ChatView",
	components: { ChatList, Chat },
	props: {
		currentChat: String,
	},
	setup(){
	},
	data() {
		return {
			dms: {
				name: "Direct Messages",
				type: "dm",
				items: [
					{
						id: 1,
						name: 'a dm conversation',
						type: "dm",
						members: [
							{
								name: 'vaalboskat',
								avatar: '/api/avatars/seeded_profile_vaalboskat.png'
							} as Chat_Member,
							{
								name: 'renoster',
								avatar: '/api/avatars/seeded_profile_renoster.png'
							} as Chat_Member
						] as Chat_Member[]
					} as Chat_List_Item,
					{
						id: 2,
						name: 'vaalboskat - flamink',
						type: "dm",
						members: [
							{
								name: 'vaalboskat',
								avatar: '/api/avatars/seeded_profile_vaalboskat.png'
							} as Chat_Member,
							{
								name: 'flamink',
								avatar: '/api/avatars/seeded_profile_flamink.png'
							} as Chat_Member
						] as Chat_Member[]
					} as Chat_List_Item
				] as Chat_List_Item[]
			} as Chat_List,
			channels: {
				name: "Channels",
				type: "channel",
				items: [
					{
						id: 3,
						name: "A channel",
						type: "channel",
						members: [
							{
								name: 'vaalboskat',
								avatar: '/api/avatars/seeded_profile_vaalboskat.png'
							} as Chat_Member,
							{
								name: 'flamink',
								avatar: '/api/avatars/seeded_profile_flamink.png'
							} as Chat_Member,
							{
								name: 'renoster',
								avatar: '/api/avatars/seeded_profile_renoster.png'
							} as Chat_Member
						]
					}
				] as Chat_List_Item[]
			} as Chat_List,
			focusTarget: 'c_chat--msg',
		};
	},
	computed: {
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
