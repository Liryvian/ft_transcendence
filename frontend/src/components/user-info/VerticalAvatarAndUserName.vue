<template>
	<div class="circle">
		<img src="../assets/default-avatar/seasnail.jpg" alt="" />
	</div>
	<div class="userName">
		<b>username</b>
<!--			<b>{{ username }}</b>//should be connected-->
	</div>
</template>

<script>
export default {
	name: 'verticalAvatarAndUserName',
	// props: {
	// 	name: String,
	// },
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
