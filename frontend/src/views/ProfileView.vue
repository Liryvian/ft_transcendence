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
import { useUserStore } from '@/stores/userStore';
import VerticalAvatarAndUserName from '@/components/user-info/VerticalAvatarAndUserName.vue';
import OverviewWithMidline from '@/components/overviews/OverviewWithMidline.vue';
import { ref, onMounted, type Ref, defineProps } from 'vue';
import type { OverviewArray } from '@/types/OverviewArray';
import { getRequest } from '@/utils/apiRequests';
import type { User } from '../types/User';

let dataArray: Ref<OverviewArray[]> = ref([]);
// let user: Ref<User[]> = ref([]);
// const props = defineProps({
// 	id: Number,
// });
export default defineComponent({
	name: 'ProfileView',
	components: {
		OverviewWithMidline,
		VerticalAvatarAndUserName,
	},
	setup() {
		const user = '';
		const userStore = useUserStore();
		const props = defineProps({ id: Number });
		// const props = defineProps({ myProp: Object });
		// const { myProp } = toRefs(props);
		onMounted(async () => {
			const userStore = useUserStore();
			await userStore.refreshData();
			console.log('id: ', props);
			const user = await getRequest(`users/5`);
			dataArray.value = [
				{ left: 'intra name', right: user.data.intra_login },
				{ left: 'member since', right: user.data.created_at },
				{ left: 'wins', right: 1 },
				{ left: 'losses', right: 19000000 },
				{ left: 'achievements', right: user.data.achievements },
			];
		}),
			console.log(userStore.me.name);
		return {
			userStore,
			dataArray,
			props,
		};
	},
});
</script>