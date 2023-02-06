<template>
	<div class="circle">
		<img :src="profile_picture" alt="" />
	</div>
	<div class="userName">
		<b>{{ profile_name }}</b>
	</div>
</template>

<script>
export default {
	name: 'verticalAvatarAndUserName',
	props: {
		profile_name: String,
		profile_picture: String,
		online: true,
	},
};
</script>

// vincent you probably dont want this style below, but I'm not sure where to put this :)
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
