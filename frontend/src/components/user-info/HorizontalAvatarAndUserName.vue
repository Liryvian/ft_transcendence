<template>
	<div class="c_media">
		<div class="c_media__asset" :class="{ 'c_asset--online': online, 'c_asset--offline': !online }">
			<div class="c_asset__circle">
				<img :src="profile_picture" alt="" />
			</div>
		</div>
		<div class="c_media__content">{{ profile_name }}</div>
	</div>
</template>

<script lang="ts">
export default {
	name: 'horizontalAvatarAndUserName',
	props: {
		profile_name: String,
		profile_picture: String,
		online: true,
	},
};
</script>

<style scoped>

</style>