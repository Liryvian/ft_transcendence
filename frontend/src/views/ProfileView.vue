<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<VerticalAvatarAndUserName
				profile_picture="/test-profile.png"
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
import { ref, onMounted, type Ref, defineProps } from 'vue';
import type { OverviewArray } from '@/types/OverviewArray';
import { getRequest } from '@/utils/apiRequests';
import type { User } from '../types/User';

let dataArray: Ref<OverviewArray[]> = ref([]);
let user: User = {} as User;

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
			user: {} as User,
		};
	},
	async created() {
		this.user = (await getRequest(`users/${this.profile_id}`)).data;
		// await useUserStore().refreshAllUsers();
		// this.user = useUserStore().allUsers.filter((user: User) => (Number(user.id) === Number(this.profile_id)))[0];
		if (!this.profile_id) {
			dataArray.value = [
				{ left: 'this profile', right: 'does not exist' },
			];
		} else {
			dataArray.value = [
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

	setup() {
		return {
			dataArray,
			name: user.name,
		};
	},
});

</script>

// notes: //needs to be connected // { // left: 'achievements', // right: //
this.user.achievements.map((ach) => { // return ach.name; // }), // }, //
<!--So maybe for now add a join with a comma after the map? (map().join(', '))-->
