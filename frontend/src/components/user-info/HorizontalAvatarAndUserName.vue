<template>
	<div class="c_media">
		<div class="c_media__asset" :class="{ 'c_asset--online': online, 'c_asset--offline': !online }">
			<div class="c_asset__circle">
				<img :src="`/api/avatars/${profile_picture}`" alt="" />
			</div>
		</div>
		<div class="c_media__content">{{ profile_name }}
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: 'HorizontalAvatarAndUserName',
	props: {
		profile_name: String,
		profile_picture: String,
		online: Boolean,
	},
});
</script>

<style scoped>

</style>