<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>This is a profile page</h1>
			<OverviewWithMidline/>
			<HorizontalAvatarAndUserName :data-array="dataArray"/>
		</div>
	</div>
</template>

<script lang="ts">>
import { onMounted, ref } from 'vue';
import axios from 'axios';

let dataArray = [
	{ left: 'intra name', right: 'x' },
	{ left: 'member since', right: 'a' },
	{ left: 'wins', right: 'a' },
	{ left: 'losses', right: 'a' },
	{ left: 'achievements', right: 'a' },
];
import OverviewWithMidline from '@/components/overviews/OverviewWithMidline.vue';
import HorizontalAvatarAndUserName from '@/components/user-info/HorizontalAvatarAndUserName.vue';
export default {
	components: { HorizontalAvatarAndUserName, OverviewWithMidline },
};
</script>