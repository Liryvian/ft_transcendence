<template>
	<div class="page_box_wrapper">
		<div class="page_box c_chat" :class="focusTarget">
			<div class="c_chat__userlist">
				<div
					v-if="focusTarget == 'c_chat--msg'"
					@click="toggleFocusTarget('list')"
					class="toggleHandler"
				></div>
				<ChatList :list="dms" type="dm" title="Direct Messages" />
				<ChatList :list="channels" type="channel" title="Channels" />
			</div>
			<Chat
				v-if="currentChatId !== ''"
				:chatId="Number(currentChatId)"
				:focusTarget="focusTarget"
				:key="currentChatId"
				@toggleFocusTarget="toggleFocusTarget"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useChatStore } from '@/stores/chatStore';

export default defineComponent({
	name: "ChatView",
	components: {},
	setup(){
		const chatStore = useChatStore();

		chatStore.refreshData();
		return {
			chatStore,
		}
	},
	// type inference enabled
	data() {
		return {
			focusTarget: 'c_chat--msg',
			messages: [
				{
					time: '14:55',
					is_mine: false,
					name: 'renoster',
					msg: 'hey!',
				},
				{
					time: '14:56',
					is_mine: false,
					name: 'renoster',
					msg: 'What are your plans for today?',
				},
				{
					time: '14:58',
					is_mine: true,
					name: 'vaalboskat',
					msg: "I'm going to work hard and fail harder!!",
				},
				{ time: '14:58', is_mine: true, name: 'vaalboskat', msg: 'jk' },
				{
					time: '14:58',
					is_mine: true,
					name: 'vaalboskat',
					msg: 'How about wo go to the forest for a nice and cozy walk with the whole team? That would be great right?\nIt would make a lot of sense to do something like that in regards to the teambuilding converstation we had earlier this month.\nLet me know what you think!\nps. this message was composed without using chatgpt',
				},
			],
		};
	},
	methods: {
		toggleFocusTarget(target: string) {
			this.focusTarget = 'c_chat--' + target;
			console.log(this.focusTarget);
		},
	},
});
</script>
