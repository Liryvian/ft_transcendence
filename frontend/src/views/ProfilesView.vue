<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>This is a profiles page</h1>
			<h1>Profiles</h1>

			<ProfileList />
		</div>
	</div>
</template>

<script lang="ts">
import ProfileList from '@/components/ProfileList.vue';
export default {
	components: {
		ProfileList
	}
}
</script>