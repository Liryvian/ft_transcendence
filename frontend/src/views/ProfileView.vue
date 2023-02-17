<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<VerticalAvatarAndUserName
				:profile_picture="this.user.avatar"
				:profile_name="this.user.name"
			/>
			<OverviewWithMidline :data-array="dataArray" />
		</div>
	</div>
</template>

<style scoped></style>

<script lang="ts">
import { defineComponent } from 'vue';
import VerticalAvatarAndUserName from '@/components/user-info/VerticalAvatarAndUserName.vue';
import OverviewWithMidline from '@/components/overviews/OverviewWithMidline.vue';
import type { OverviewArray } from '@/types/OverviewArray';
import type { User } from '../types/User';
import { useUserStore } from '@/stores/userStore';

export default defineComponent({
	name: 'ProfileView',
	components: {
		OverviewWithMidline,
		VerticalAvatarAndUserName,
	},
	props: {
		profile_id: String,
	},
	data() {
		return {
			dataArray: [] as OverviewArray[],
			user: {} as User,
		};
	},
	async created() {
		await useUserStore().refreshAllUsers();
		const filteredUsers = useUserStore().allUsers.find(
			(user: User) => Number(user.id) === Number(this.profile_id),
		);

		if (filteredUsers === undefined) {
			this.$router.push('/profiles');
		} else {
			this.user = filteredUsers;
			console.log('avatar', this.user.avatar);
			this.dataArray = [
				{ left: 'intra name', right: this.user.name },
				{ left: 'member since', right: this.user.created_at },
				{ left: 'wins', right: 1 },
				{ left: 'losses', right: 190 },
				{
					left: 'achievements',
					right: this.user.achievements
						.map((ach) => {
							return ach.name;
						})
						.join(', '),
				},
			];
		}
	},
});
</script>
