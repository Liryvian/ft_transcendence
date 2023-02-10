<template>
	<div class="c_profileslist__table">
		<template v-for="user in userStore.allUsers">
			<ListLine :user=user />
		</template>
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent, onMounted } from 'vue';
import ProfileView_tmp from '@/views/ProfileView-tmp.vue';
import ListLine from '@/components/profileList/ListLine.vue';
import type { User } from '@/types/User';
import router from '@/router';

export default defineComponent({
	name: 'ProfileList',
	components: {
		ProfileView_tmp,
		ListLine,
	},
	setup() {
		const userStore = useUserStore();
		const {
			refreshData,
			allUsers,
		} = userStore;

		onMounted(async () => {
			await refreshData();
		});

		return {
			userStore,
			refreshData,
			allUsers,
		};
	},

	methods: {
		routeToProfile(id: number) {
			router.push(`/ProfileView/${id}`)
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
</style>
