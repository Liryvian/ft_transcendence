<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<VerticalAvatarAndUserName
				profile_picture="/test-profile.png"
				:profile_name="userStore.me.name"
			/>
			<!--			<VerticalAvatarAndUserName profile_picture="/test-profile.png" :profile_name="name" />-->
			<OverviewWithMidline :data-array="dataArray" />
		</div>
	</div>
</template>

<style scoped></style>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import VerticalAvatarAndUserName from '@/components/user-info/VerticalAvatarAndUserName.vue';
import OverviewWithMidline from '@/components/overviews/OverviewWithMidline.vue';
import router from '@/router';
import { storeToRefs } from 'pinia';
import { ref, onMounted, type Ref } from 'vue';
import type { OverviewArray } from '@/types/OverviewArray';

// type User = {
// 	name: '';
// };

// let dataArray = [
// 	{ left: 'intra name', right: '' },
// 	{ left: 'member since', right: '' },
// 	{ left: 'wins', right: '' },
// 	{ left: 'losses', right: '' },
// 	{ left: 'achievements', right: '' },
// ];
let dataArray: Ref<OverviewArray[]> = ref([]);
export default defineComponent({
	name: 'ProfileView',
	components: {
		OverviewWithMidline,
		VerticalAvatarAndUserName,
	},

	// onMounted: (async () =>{
	// 	const userStore = useUserStore();
	// 	await userStore.refreshData();
	// }),

	setup() {
		const userStore = useUserStore();
		onMounted(async () => {
			// const userStore = useUserStore();
			await userStore.refreshData();
			dataArray.value = [
				{ left: 'intra name', right: userStore.me.intra_name},
				{ left: 'member since', right: userStore.me.created_at },
				{ left: 'wins', right: 1 },
				{ left: 'losses', right: 19000000 },
				{ left: 'achievements', right: "All" },
			];
			// dataArray[0].right = userStore.me.name;
		}),
			// const userStore = useUserStore();
			// userStore.refreshData();
			// userStore.createArray(userStore.me, dataArray);
			// dataArray[0].right = userStore.me.name;
			// dataArray[1].right = userStore.me.created_at;
			// dataArray[2].right = userStore.me.games.wins;
			// dataArray[2].right = userStore.me.games.losses;
			// dataArray[4].right = userStore.me.achievements[0];
			console.log(userStore.me.name);

		// console.log(userStore.me.games[0].player_two);
		// const userForm: UserForm = reactive ({
		//   name: '',
		// })
		return {
			userStore,
			dataArray,
		};
	},
});
</script>

<!--<template>-->
<!--	<div class="page_box_wrapper">-->
<!--		<div class="page_box">-->
<!--			<h1>This is a profile page</h1>-->
<!--		</div>-->
<!--	</div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--</script>-->
