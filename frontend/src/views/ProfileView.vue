<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<VerticalAvatarAndUserName
				:profile_picture="user.avatar ?? 'tmp_default_avatar.png'"
				:profile_name="user.name"
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
import type { User, GamesHistory } from '../types/User';
import { useUserStore } from '@/stores/userStore';
import { getRequest } from '@/utils/apiRequests';

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
		const userToView = useUserStore().allUsers.find(
			(user: User) => Number(user.id) === Number(this.profile_id),
		);
		if (userToView === undefined) {
			this.$router.push('/profiles');
		} else {
			this.user = userToView;
			const gamesHistory: GamesHistory = await (
				await getRequest(`users/${this.user.id}/games-history`)
			).data;
			this.dataArray = [
				{ left: 'intra name', right: this.user.name },
				{ left: 'member since', right: this.user.created_at },
				{ left: 'wins', right: gamesHistory.wins },
				{ left: 'losses', right: gamesHistory.losses },
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
