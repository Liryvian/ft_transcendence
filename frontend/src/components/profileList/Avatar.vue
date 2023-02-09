<template>
	<div class="c_media">
		<a
			href="#"
			class="c_media__asset"
			:class="{ 'c_asset--online': isOnline, 'c_asset--offline': !isOnline }"
		>
			<div class="c_asset__circle">
				<img :src="`/api/avatars/${avatar}`" alt="" />
			</div>
		</a>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
const avatarPath: string = "/api/avatar/"
export default defineComponent({
	name: 'Avatar',

    methods: {
        getAvatar() {
            console.log("getting avatar");
        }
    },

	props: {
        avatar: String,
        isOnline: Boolean
	},
});
</script>