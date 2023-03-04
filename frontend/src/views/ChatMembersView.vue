<!-- Owner can kick, ban, mute other users and  
the channel administrators.  
A user who is an administrator of a channel can kick, ban mute -->

<template>
	<div class="page_box_wrapper">
		<div class="page_box c_profileslist">
			<h1>CHAT MEMBERS</h1>
			<div class="c_profileslist__table">
				<template v-for="member in getCurrentChannel?.users">
					<ChannelMemberRow
						v-if="member.id !== me.id"
						:channel-id="Number(chatID)"
						:user-id="member.id"
						:user-name="member.name"
						:avatar-string="member.avatar"
						:is-owner="getOwnerId() === me.id"
					/>
					<!-- {{ member.name}} -->
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
import { permissionsEnum } from '@/types/Chat';

export default defineComponent({
	name: 'ChatMembershipiew',
	props: {
		chatID: String,
	},
	components: {
		ChannelMemberRow,
	},
	computed: {
		getCurrentChannel() {
			console.log(
				this.channels.find(
					(chat) => this.chatID === chat.id.toString(),
				),
			);
			return this.channels.find(
				(chat) => this.chatID === chat.id.toString(),
			);
		},
	},
	methods: {
		getOwnerId(): number {
			//  if logged in user is owner
			let ownerId = -1;
			this.getCurrentChannel?.users.forEach((user) => {
				if (
					user.id === this.me.id &&
					user.permissions.find(
						(permission) => permission === permissionsEnum.OWNER,
					)
				) {
					ownerId = user.id;
				}
			});
			return ownerId;
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
