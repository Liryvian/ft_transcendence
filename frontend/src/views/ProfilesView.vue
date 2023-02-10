<template>
	<div class="page_box_wrapper">
		<div class="page_box c_profileslist">
			<h1>Profiles</h1>
			<div class="c_profileslist__table">
				<template v-for="user in userStore.allUsers">
					<ListRow :user=user />
				</template>
			</div>
		</div>
	</div>
</template>


<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent, onMounted } from 'vue';
import ProfileView_tmp from '@/views/ProfileView-tmp.vue';
import ListRow from '@/components/profileList/ListRow.vue';
import type { User } from '@/types/User';
import router from '@/router';

export default defineComponent({
	name: 'ProfileList',
	components: {
		ProfileView_tmp,
		ListRow,
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
