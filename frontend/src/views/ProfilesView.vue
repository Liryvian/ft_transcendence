<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>This is a profiles page</h1>
			<div class="c_block c_split">
				<p><a href="/profile"  :this.id>back</a></p>
				<p>
					<input class="link_button" id="6" />
				</p>
			</div>
		</div>
	</div>
</template>

<!--  THIS SCRIPT IS ONLY TO SHOW A WORKING GAME STORE SETUP-->
<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent } from 'vue';
import ProfileView from '@/views/ProfileView.vue';

export default defineComponent({
	name: 'ProfilesView',
	setup() {
		const userStore = useUserStore();
		userStore.refreshData();
		return {
			userStore,
		};
	},
});
</script>
