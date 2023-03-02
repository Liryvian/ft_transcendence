<template>
	<div class="c_media__asset" :class="is_online">
		<div v-for="member in visible_avatars" class="c_asset c_asset__circle">
			<img
				:src="`/api/avatars/${
					member.avatar ?? 'tmp_default_avatar.png'
				}`"
				:alt="`Avatar of ${member.name}`"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import {
	permissionsEnum,
	type Chat_List_Item,
	type Chat_Member,
} from '@/types/Chat';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
	name: 'ChatProfileImages',
	props: {
		chat: {
			type: Object as PropType<Chat_List_Item>,
			required: true,
		},
		asset_position: {
			type: String,
			default: '',
		},
	},
	setup() {
		const userStore = useUserStore();

		return {
			userStore,
		};
	},
	computed: {
		is_online(): String {
			if (this.chat.type === 'dm') {
				const otherUser: Chat_Member = this.chat.users.filter(
					(user) => user.id !== this.userStore.me.id,
				)[0];
				if (this.userStore.getOnlineStatus(otherUser.id)) {
					return 'c_asset--online';
				}
				return 'c_asset--offline';
			}
			return 'c_asset--multi';
		},
		visible_avatars(): Chat_Member[] {
			const fallback: Chat_Member = {
				id: -1,
				name: '',
				avatar: '../../tmp_default_avatar.png',
				permissions: [],
			};

			const possibleUsers = this.chat.users.filter(
				(user) =>
					user.permissions.indexOf(permissionsEnum.BLOCKED) === -1 &&
					user.permissions.indexOf(permissionsEnum.LEFT) === -1,
			);

			// extract me from array
			const me = possibleUsers.splice(
				possibleUsers.findIndex(
					(user) => user.id === this.userStore.me.id,
				),
				1,
			);

			if (this.chat.type === 'dm') {
				// remove myself
				const users = possibleUsers.filter(
					(user) => user.id !== this.userStore.me.id,
				);
				// return a slice of length 1 (should for DM always be the "other" unless something went wrong..)
				return [fallback, ...users].slice(-1);
			}

			// for channels
			// sort by most/highest permissions
			const sorted = possibleUsers.sort((a, b) => {
				let score_a = 0;
				if (a.permissions.indexOf(permissionsEnum.READ) !== -1) {
					score_a += 1;
				}
				if (a.permissions.indexOf(permissionsEnum.POST) !== -1) {
					score_a += 2;
				}
				if (
					a.permissions.indexOf(permissionsEnum.MANAGE_USERS) !== -1
				) {
					score_a += 10;
				}
				if (
					a.permissions.indexOf(permissionsEnum.EDIT_SETTINGS) !== -1
				) {
					score_a += 10;
				}
				let score_b = 0;
				if (b.permissions.indexOf(permissionsEnum.READ) !== -1) {
					score_b += 1;
				}
				if (b.permissions.indexOf(permissionsEnum.POST) !== -1) {
					score_b += 2;
				}
				if (
					b.permissions.indexOf(permissionsEnum.MANAGE_USERS) !== -1
				) {
					score_b += 0;
				}
				if (
					b.permissions.indexOf(permissionsEnum.EDIT_SETTINGS) !== -1
				) {
					score_b += 0;
				}
				return score_a - score_b;
			});
			// return a slice of length 3 (should now always be at least 2, yourself + fallback)
			return [fallback, me[0], ...sorted]
				.filter((el) => el !== undefined)
				.slice(-3);
		},
	},
});
</script>
