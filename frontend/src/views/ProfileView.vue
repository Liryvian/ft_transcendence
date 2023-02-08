<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<VerticalAvatarAndUserName profile_picture="/test-profile.png" profile_name="name" />
<!--			<VerticalAvatarAndUserName profile_picture="/test-profile.png" :profile_name="name" />-->
			<OverviewWithMidline :data-array="dataArray" />
		</div>
	</div>
</template>

<style scoped></style>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
import VerticalAvatarAndUserName from '@/components/user-info/VerticalAvatarAndUserName.vue';
import OverviewWithMidline from '@/components/overviews/OverviewWithMidline.vue';

type User = {
	name: '';
};

let dataArray = [
	{ left: 'intra name', right: 'x' },
	{ left: 'member since', right: 'a' },
	{ left: 'wins', right: 'a' },
	{ left: 'losses', right: 'a' },
	{ left: 'achievements', right: 'a' },
];

export default defineComponent({
	name: 'ProfileView',
	components: {
		OverviewWithMidline,
		VerticalAvatarAndUserName,
	},

	setup() {
		const userStore = useUserStore();
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