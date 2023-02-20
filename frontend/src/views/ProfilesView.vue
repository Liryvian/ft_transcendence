<template>
	<div class="page_box_wrapper">
		<div class="page_box c_profileslist">
			<h1>Profiles</h1>
			<div class="c_profileslist__table">
				<template v-for="user in allUsers">
					<ListRow
						v-if="user.id !== me.id"
						:user="user"
						:relationship="getCurrentRel(user.id)"
					/>
				</template>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent, onMounted } from 'vue';
import ListRow from '@/components/profileList/ListRow.vue';
import type { User } from '@/types/User';
import router from '@/router';
import { storeToRefs } from 'pinia';

export default defineComponent({
	name: 'ProfileList',
	components: {
		ListRow,
	},
	setup() {
		const userStore = useUserStore();
		const { refreshData, isBlocked, getCurrentRel } = userStore;
		const {me , allUsers} = storeToRefs(userStore)
		onMounted(async () => {
			await refreshData();
		});

		return {
			userStore,
			refreshData,
			allUsers,
			isBlocked,
			getCurrentRel,
			me,
		};
	},

	methods: {
		routeToProfile(id: number) {
			router.push(`/ProfileView/${id}`);
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
