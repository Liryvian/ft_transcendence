<template>
	<div class="c_list">
		<h1 v-if="info.name.length">
			<span>{{ info.name }}</span>
			<RouterLink
				class="add_channel"
				v-if="info.type === 'channel'"
				:to="{ name: 'new-channel' }"
			>+
			</RouterLink>
		</h1>

		<template v-for="item in info.items">
			<ChatListItem :chat="item" :type="item.type" />
		</template>

	</div>
</template>

<script lang="ts">
import { RouterLink } from 'vue-router';
import { defineComponent, type PropType } from 'vue';
import ChatListItem from './ChatListItem.vue';
import type { Chat_List } from '@/types/Chat';

export default defineComponent({
	name: 'ChatList',
	components: { RouterLink, ChatListItem },
	props: {
		info: {
			type: Object as PropType<Chat_List>,
			required: true,
		},
	},
});
</script>

<style scoped>
.add_channel {
	padding-left: 2.5em;
}
</style>
