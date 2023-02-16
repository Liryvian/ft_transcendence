<template>
	<div class="c_list">
		<h1 v-if="info.name.length">{{ info.name }}</h1>
		<RouterLink v-for="chat in info.items" :to="`/chat/${chat.id}`">
			<ChatListItem :chat="chat" :type="info.type" />
		</RouterLink>
	</div>
</template>

<script lang="ts">
import { useChatStore } from '@/stores/chatStore';
import { RouterLink } from 'vue-router';
import { defineComponent, type PropType } from 'vue';
import ChatListItem from './ChatListItem.vue';
import { type Chat_List } from "@/types/Chat";

export default defineComponent({
	name: 'ChatList',
	components: { RouterLink, ChatListItem },
	props: {
		info: {
			type: Object as PropType<Chat_List>,
			required: true,
		},
	},
	setup() {
		// const chatStore = useChatStore();

		// chatStore.refreshData();
		// return {
		// 	chatStore,
		// };
	},
	computed: {
	},
	data() {
		return {};
	},
});
</script>
