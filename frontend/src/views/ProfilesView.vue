<template>
	<div class="page_box_wrapper">
		<div class="page_box">
			<h1>This is a profiles page</h1>
		</div>
		<p class="table table-striped table-sm">
			All Profiles:
			<tbody>
				<tr v-for="user in userStore.allUsers" :key="user.id">
					<td> Id: {{ user.id }} </td>
					<td> Username: {{ user.name }} </td>
				</tr>
				
			</tbody>

		</p>
	</div>
</template>

<!--  THIS SCRIPT IS ONLY TO SHOW A WORKING GAME STORE SETUP-->
<script lang="ts">
import { useUserStore } from '@/stores/userStore';
import { defineComponent } from 'vue';

export default defineComponent({
	name: "ProfilesView",

	setup(){
		const userStore = useUserStore();
		useUserStore().login();
		userStore.refreshData();
		return {
			userStore,
		}
	}
})
</script>