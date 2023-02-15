<template>
	<div class="c_media">
		<div class="c_media__asset" :class=>
			<div class="c_asset__circle">
				<img :src="profile_picture" alt="" />
			</div>
		</div>
		<div class="c_media__content">
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name: 'ProfileSettingsAvatar',
	props: {
		profile_picture: String,
	},
});
</script>

<style scoped>

</style>