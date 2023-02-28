<template>
	<div class="c_chat__conversation">
		<div
			v-if="focusTarget == 'c_chat--list'"
			@click="$emit('toggleFocusTarget', 'msg')"
			class="toggleHandler"
		></div>
		<ChatHeader :chat="info" />
		<div class="c_messagelist">
			<Message
				v-for="message in activeChatMessages"
				:message="message"
				:key="message.id"
			/>
		</div>
		<div class="join" v-if="canJoin">
			<button :disabled="joinButtonDisabled" @click="joinChat()">
				join chat
			</button>
		</div>
		<SendMessage v-if="canPost" :chatId="info.id" />
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

import Message from './Message.vue';
import ChatHeader from './ChatHeader.vue';
import SendMessage from './SendMessage.vue';
import { useMessageStore } from '@/stores/messageStore';
import {
	permissionsEnum,
	type Chat_List_Item,
	type SingleMessage,
} from '@/types/Chat';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { postRequest } from '@/utils/apiRequests';

export default defineComponent({
	name: 'Chat',
	components: {
		Message,
		ChatHeader,
		SendMessage,
	},
	props: {
		focusTarget: String,
		info: {
			type: Object as PropType<Chat_List_Item>,
			required: true,
		},
	},
	setup() {
		const messageStore = useMessageStore();
		const { messages } = storeToRefs(messageStore);
		const userStore = useUserStore();

		return {
			messageStore,
			messages,
			userStore,
		};
	},
	data() {
		return {
			joinButtonDisabled: false,
		};
	},
	computed: {
		canJoin(): boolean {
			if (this.info.type === 'dm') {
				return false;
			}
			const userInList = this.info.users.find(
				(user) => user.id === this.userStore.me.id,
			);
			if (userInList !== undefined) {
				// users exists in list of permissions
				// if they are blocked, they cannot join
				if (
					userInList.permissions.indexOf(permissionsEnum.BLOCKED) !==
					-1
				) {
					return false;
				}
				// if they aren't blocked, but left, they can join again
				if (
					userInList.permissions.indexOf(permissionsEnum.LEFT) !== -1
				) {
					return true;
				}
				// otherwise they are probably just in the chat and cannot join
				return false;
			}
			// if the user does not exist in the list of users, they can join
			return true;
		},
		canPost(): boolean {
			return (
				this.info.users.find(
					(user) =>
						user.id === this.userStore.me.id &&
						user.permissions.indexOf(permissionsEnum.POST) !== -1 &&
						user.permissions.indexOf(permissionsEnum.BLOCKED) ===
							-1 &&
						user.permissions.indexOf(permissionsEnum.LEFT) === -1,
				) !== undefined
			);
		},
		activeChatMessages(): SingleMessage[] {
			if (!this.messages[this.info.id]) {
				this.messageStore.getActiveChatMessages(this.info.id);
				return [];
			}
			return this.messages[this.info.id];
		},
	},
	methods: {
		async joinChat() {
			this.joinButtonDisabled = true;
			try {
				await postRequest(`chats/${this.info.id}/join`, {});
			} catch (e) {
				console.log('error on joining chat');
				console.log(e);
			}
			this.joinButtonDisabled = false;
		},
	},
});
</script>

<style scoped>
.join {
	display: flex;
	justify-content: center;
	align-content: center;
	flex-basis: 20%;
	padding: var(--single-spacing);
}
</style>
