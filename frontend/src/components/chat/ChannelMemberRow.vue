<template>
	<div class="c_media">
		<div class="c_asset__circle">
			<img
				:src="`/api/avatars/${
					member.avatar ?? 'tmp_default_avatar.png	'
				}`"
				alt=""
			/>
		</div>
	</div>
	<div>
		{{ member.name }}
	</div>

	<div v-if="isOwner">
		<button
			class="link_button"
			v-on:click.prevent="kick(member.id, channelId)"
		>
			Kick
		</button>
	</div>
	<div v-else>
		<button class="link_button grayedOut">Kick</button>
	</div>

	<div v-if="isOwner">
		<button
			v-if="isMuted"
			class="link_button"
			v-on:click.prevent="unmute(member.id, channelId)"
		>
			Unmute
		</button>
		<button
			v-else
			class="link_button"
			v-on:click.prevent="mute(member.id, channelId)"
		>
			Mute
		</button>
	</div>
	<div v-else>
		<button class="link_button grayedOut">Mute</button>
	</div>
	<div v-if="isOwner">
		<button
			v-if="isBanned"
			class="link_button"
			v-on:click.prevent="unblock(member.id, channelId)"
		>
			Unban
		</button>
		<button
			v-else
			class="link_button"
			v-on:click.prevent="block(member.id, channelId)"
		>
			Ban
		</button>
	</div>
	<div v-else>
		<button class="link_button grayedOut">Block</button>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { patchRequest } from '@/utils/apiRequests';
import { permissionsEnum, type Chat_Member } from '@/types/Chat';

export default defineComponent({
	name: 'ChannelMemberRow',
	props: {
		channelId: {
			type: Number,
			required: true,
		},
		member: {
			type: Object as PropType<Chat_Member>,
			required: true,
		},
		isOwner: {
			type: Boolean,
			required: true,
		},
	},
	setup() {
		const userStore = useUserStore();
		userStore.refreshData();
		return {
			userStore,
		};
	},
	computed: {
		isMuted() {
			return (
				this.member.permissions.find(
					(p) => p === permissionsEnum.POST,
				) === undefined
			);
		},
		isBanned() {
			return (
				this.member.permissions.find(
					(p) => p === permissionsEnum.BLOCKED,
				) !== undefined
			);
		},
	},
	methods: {
		//  should call update chat form chatStore
		async kick(userId: number, channelId: number) {
			try {
				await patchRequest(`chats/${channelId}/kick/${userId}`, {});
			} catch (e) {
				console.log(e);
			}
		},
		async mute(userId: number, channelId: number) {
			try {
				await patchRequest(`chats/${channelId}/mute/${userId}`, {});
			} catch (e) {
				console.log(e);
			}
		},
		async unmute(userId: number, channelId: number) {
			try {
				await patchRequest(`chats/${channelId}/unmute/${userId}`, {});
			} catch (e) {
				console.log(e);
			}
		},
		async block(userId: number, channelId: number) {
			try {
				await patchRequest(`chats/${channelId}/block/${userId}`, {});
			} catch (e) {
				console.log(e);
			}
		},
		async unblock(userId: number, channelId: number) {
			try {
				await patchRequest(`chats/${channelId}/unblock/${userId}`, {});
			} catch (e) {
				console.log(e);
			}
		},
	},
});
</script>
