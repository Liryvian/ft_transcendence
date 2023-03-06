<!-- Owner can kick, ban, mute other users and
the channel administrators.
A user who is an administrator of a channel can kick, ban mute -->

<template>
	<div class="page_box_wrapper">
		<div class="page_box c_profileslist">
			<h1>CHAT MEMBERS</h1>
			<div class="c_profileslist__table">
				<template v-for="member in members">
					<ChannelMemberRow
						v-if="member.id !== me.id"
						:member="member"
						:channel-id="Number(channelId)"
						:is-owner="ownerId === me.id"
					/>
				</template>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useChatStore } from '@/stores/chatStore';
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue';
import ChannelMemberRow from '@/components/chat/ChannelMemberRow.vue';
import { useUserStore } from '@/stores/userStore';
import { permissionsEnum, type Chat_Member } from '@/types/Chat';

export default defineComponent({
	name: 'ChatMembershipView',
	props: {
		channelId: String,
	},
	components: {
		ChannelMemberRow,
	},
	computed: {
		currentChannel() {
			return this.channels.find(
				(chat) => chat.id.toString() === this.channelId,
			);
		},
		members(): Chat_Member[] {
			return this.currentChannel?.users ?? [];
		},
		ownerId() {
			return (
				this.members.find((user) =>
					user.permissions.find((p) => p === permissionsEnum.OWNER),
				)?.id ?? -1
			);
		},
	},
	setup() {
		const chatStore = useChatStore();
		chatStore.init(false);
		const { channels } = storeToRefs(chatStore);

		const userStore = useUserStore();
		const { me } = storeToRefs(userStore);
		return {
			channels,
			me,
		};
	},
});
</script>

<style scoped></style>
