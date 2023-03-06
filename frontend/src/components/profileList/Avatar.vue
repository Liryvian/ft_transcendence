<template>
	<div class="c_media">
		<RouterLink
			:to="to"
			class="c_media__asset"
			:class="{ 'c_asset--online': isOnline, 'c_asset--offline': !isOnline, 'grayedOut': isBlocked }"
		>
			<div class="c_asset__circle">
				<img :src="`/api/avatars/${avatar}`" alt="" />
			</div>
		</RouterLink>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
	name: 'Avatar',

	props: {
        avatar: String,
        isOnline: Boolean,
		userId: Number,
		isBlocked: Boolean,
	},
	computed: {
		to() {
			if (this.isBlocked) {
				return { name: 'profiles' };
			}
			return { name: 'profile', params: { profile_id: this.userId} };
		}
	}
});
</script>