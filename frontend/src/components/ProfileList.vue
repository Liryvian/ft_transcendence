<template>
	<div class="c_profileslist__table">
		<template v-for="user in userStore.allUsers">
			<ListLine :user="user" />
		</template>
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent } from 'vue';
import ProfileView_tmp from '@/views/ProfileView-tmp.vue';
import ListLine from '@/components/listLine.vue';
import type { User } from '@/types/User';

export default defineComponent({
	name: 'ProfileList',
	components: {
		ProfileView_tmp,
		ListLine,
	},
	setup() {
		const userStore = useUserStore();
		const {
			login,
			refreshData,
			isBlocked,
			isFriend,
			updateRelationship,
			allUsers,
			me,
		} = userStore;
		refreshData();

		return {
			userStore,
			login,
			refreshData,
			isBlocked,
			isFriend,
			updateRelationship,
			allUsers,
			me,
		};
	},

	methods: {
		viewProfile(user: User) {
			console.log(`Profile of ${user.name} clicked`);
		},
		createChat(user: User) {
			console.log(`Starting chat with ${user.name}`);
		},
	},
});
</script>

<style>
.avatar {
	vertical-align: middle;
	width: 50px;
	height: 50px;
	border-radius: 50%;
}

.grayedOut {
	color: grey;
}

button {
	all: unset;
	cursor: pointer;
}

button:focus {
	outline: blue 5px auto;
}
</style>
