<template>
	<div class="circle">
		<img :src="profile_picture" alt="" />
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: 'ProfileSettingAvatar',
	props: {
		profile_picture: String,
	},
});
</script >

<style scoped>
.circle {
	margin-left: auto;
	margin-right: auto;
	width: 10em;
	height: 10em;
	border: solid 2px black;
	border-radius: 50%;
	overflow: hidden;
	margin-top: 1.2em;
}

.userName {
	text-align: center;
	margin-top: 0.5em;
}

img {
	max-height: 100%;
}
</style>
