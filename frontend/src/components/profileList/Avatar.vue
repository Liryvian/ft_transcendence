<template>
	<div class="c_media">
		<RouterLink
			:to="to"
			class="c_media__asset"
			:class="{
				'c_asset--online': isOnline,
				'c_asset--offline': !isOnline,
				grayedOut: isBlocked,
			}"
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
		avatar: {
			type: String,
			default: 'tmp_default_avatar.png',
		},
		isOnline: {
			type: Boolean,
			default: false,
		},
		userId: {
			type: Number,
			default: -1,
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		to() {
			if (this.isBlocked || this.userId === -1) {
				return { name: 'profiles' };
			}
			return {
				name: 'profile',
				params: { profile_id: this.userId ?? -1 },
			};
		},
	},
});
</script>
