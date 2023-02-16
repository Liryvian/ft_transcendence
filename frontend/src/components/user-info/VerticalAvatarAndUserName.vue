<template>
	<div class="circle">
		<img :src="`/api/avatars/${profile_picture}`" alt="" />
	</div>
	<div class="userName">
		<b>{{ profile_name }}</b>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: 'verticalAvatarAndUserName',
	props: {
		profile_name: String,
		profile_picture: String,
	},
});
</script >

<style scoped>
.circle {
	margin-left: auto;
	margin-right: auto;
	width: 9em;
	height: 9em;
	border: solid 2px black;
	border-radius: 50%;
	overflow: hidden;
	margin-top: 2.5em;
}

.userName {
	text-align: center;
	margin-top: 0.5em;
}

img {
	max-height: 100%;
}
</style>
