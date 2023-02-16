<template>
	<div class="c_media c_media--clickable">
		<div class="c_media__asset" :class="is_online">
			<div v-for="member in visible_avatars" class="c_asset__circle">
				<img :src="member.avatar" :alt="`Avatar of ${member.name}`" />
			</div>
		</div>
		<div class="c_media__content">{{ chat.name }}</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
// import { useUserStore } from '@/stores/userStore';
import { type Chat_List_Item, type Chat_Type, type Chat_Member } from '@/types/Chat';

export default defineComponent({
	name: 'ChatListItem',
	props: {
		chat: {
			type: Object as PropType<Chat_List_Item>,
			required: true,
		},
		type: {
			type: "channel" as PropType<Chat_Type>,
			default: "channel"
		}
	},
	setup() {
	},
	computed: {
		visible_avatars(): Chat_Member[] {
			if (this.type === 'dm') {
				// filter out self, but need self for that
				return this.chat.members.slice(0,1);
			}
			// filter out self, and sort by some method
			// or sort by some method and make sure self is last (so if others.length < 3 you are last/first/bottom avatar))
			return this.chat.members.slice(0,3);
		},
		is_online(): String {
			if (this.type === 'dm') {
				// here logic to check if other user in dm is online or not
				return 'c_asset--online';
			}
			return 'c_asset--multi';
		},
	},
});
</script>

<style scoped></style>
